import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI(title="VeritasAI ML Service", description="Fake News Detection Inference API")

# Allow CORS for Express proxy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

# Paths to models — use real .pkl artifacts from notebooks dir, fallback to .joblib
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
notebooks_dir = os.path.join(project_root, "server", "public", "notebooks")

model_path = os.path.join(notebooks_dir, "best_model.pkl")
vectorizer_path = os.path.join(notebooks_dir, "phase2_artifacts.pkl")

# Fallback to joblib if pkl not found
if not os.path.exists(model_path):
    model_path = os.path.join(project_root, "data-pipeline", "output", "best_model.joblib")
if not os.path.exists(vectorizer_path):
    vectorizer_path = os.path.join(project_root, "data-pipeline", "output", "tfidf_vectorizer.joblib")

model = None
vectorizer = None

artifacts_dict = {}

@app.on_event("startup")
def load_models():
    global model, vectorizer, artifacts_dict
    try:
        import pickle
        # Try loading the pkl files first (from notebooks)
        if model_path.endswith(".pkl"):
            with open(model_path, "rb") as f:
                model = pickle.load(f)
        else:
            import joblib
            model = joblib.load(model_path)

        if vectorizer_path.endswith(".pkl"):
            with open(vectorizer_path, "rb") as f:
                artifacts = pickle.load(f)
                vectorizer = artifacts["tfidf_vectorizer"]
                artifacts_dict = artifacts
        else:
            import joblib
            vectorizer = joblib.load(vectorizer_path)

        print(f"[OK] Model loaded: {type(model).__name__}")
        print(f"[OK] Vectorizer loaded: {type(vectorizer).__name__}")
    except Exception as e:
        print(f"[ERROR] Error loading models: {e}")

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict")
def predict(request: TextRequest):
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please run the data pipeline.")
    
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    try:
        import string
        import numpy as np
        import pandas as pd
        
        text = request.text
        words = text.split()
        num_words = max(len(words), 1)
        
        # The 7 structural features the scaler was fitted on (exact order matters)
        # Scaler feature_names_in_: ['title_length', 'text_length', 'title_word_count',
        #   'text_word_count', 'avg_word_length', 'punctuation_count', 'uppercase_word_count']
        structural_feature_names = ['title_length', 'text_length', 'title_word_count',
                                    'text_word_count', 'avg_word_length', 'punctuation_count',
                                    'uppercase_word_count']
        structural_values = [
            0,                                                           # title_length (no title in live input)
            len(text),                                                   # text_length
            0,                                                           # title_word_count
            num_words,                                                   # text_word_count
            sum(len(w) for w in words) / num_words,                     # avg_word_length
            sum(1 for c in text if c in string.punctuation),            # punctuation_count
            sum(1 for w in words if w.isupper()),                       # uppercase_word_count
        ]
        structural_arr = np.array([structural_values], dtype=float)
        
        # 1. Scale ONLY the 7 structural features
        if artifacts_dict.get("scaler"):
            scaler = artifacts_dict["scaler"]
            structural_scaled = scaler.transform(structural_arr)
        else:
            structural_scaled = structural_arr
        
        # 2. TF-IDF vectorize text → 5000 features
        tfidf_dense = vectorizer.transform([text]).toarray()
        
        # 3. Build the full 5007-column feature array: [tfidf(5000) | structural(7)]
        if "all_feature_names" in artifacts_dict:
            all_feats = artifacts_dict["all_feature_names"]
            df = pd.DataFrame(0.0, index=[0], columns=all_feats)
            
            # Fill TF-IDF columns (first 5000)
            num_tfidf = tfidf_dense.shape[1]
            df.iloc[0, :num_tfidf] = tfidf_dense[0]
            
            # Fill scaled structural features (last 7)
            for i, col in enumerate(structural_feature_names):
                if col in df.columns:
                    df.at[0, col] = float(structural_scaled[0][i])
            
            # 4. Select the 63 features the model expects
            final_features = artifacts_dict["final_feature_names"]
            X_final = df[final_features].values
        else:
            # Fallback: raw tfidf only
            X_final = tfidf_dense
            
        # 5. Predict
        prediction = model.predict(X_final)[0]
        
        confidence = 0.99 
        all_probs = None
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_final)[0]
            all_probs = probs.tolist()
            confidence = float(max(probs))
        elif hasattr(model, "decision_function"):
            import math
            df_val = model.decision_function(X_final)[0]
            prob = 1 / (1 + math.exp(-df_val))
            confidence = prob if prediction == 1 else 1 - prob
        
        label = "Real" if prediction == 1 else "Fake"
        
        # 6. Extract top contributing TF-IDF tokens for this specific input
        top_tokens = []
        try:
            if "final_feature_names" in artifacts_dict:
                final_features = artifacts_dict["final_feature_names"]
                feat_values = df[final_features].values[0]
                # Pair feature name with its value and sort by abs value descending
                pairs = sorted(zip(final_features, feat_values), key=lambda x: abs(x[1]), reverse=True)
                # Only include actual word tokens (not structural features)
                struct_names = set(structural_feature_names)
                top_tokens = [{"token": k, "weight": round(float(v), 4)} for k, v in pairs if k not in struct_names and float(v) > 0][:8]
        except Exception:
            pass
        
        # 7. Confidence risk level
        if confidence >= 0.95:
            risk = "low"
            risk_label = "High Confidence — Likely Correct"
        elif confidence >= 0.80:
            risk = "medium"
            risk_label = "Moderate Confidence — Could Be Borderline"
        else:
            risk = "high"
            risk_label = "Low Confidence — May Be Misclassified"
        
        return {
            "prediction": label,
            "confidence": float(confidence),
            "label_int": int(prediction),
            "risk_level": risk,
            "risk_label": risk_label,
            "structural_features": {
                "word_count": num_words,
                "text_length": len(text),
                "avg_word_length": round(sum(len(w) for w in words) / num_words, 2),
                "punctuation_count": sum(1 for c in text if c in string.punctuation),
                "uppercase_words": sum(1 for w in words if w.isupper()),
            },
            "top_tokens": top_tokens,
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


