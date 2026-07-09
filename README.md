# 🔍 VeritasAI — Fake News Detection System

> **Data Science Capstone Project** · Full-stack ML pipeline for detecting fake news using the ISOT dataset

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [ML Pipeline](#-ml-pipeline)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Dataset](#-dataset)
- [Results](#-results)
- [Team](#-team)

---

## 🧠 Overview

**VeritasAI** is an end-to-end data science capstone that builds, evaluates, and deploys a machine-learning model to classify news articles as **Real** or **Fake**. The system includes:

- A **3-phase ML pipeline** (EDA → Feature Engineering → Advanced Modeling)
- A **live classification API** powered by FastAPI
- An **interactive React dashboard** to explore the full data science methodology
- A **Node.js/Express backend** that proxies predictions and stores history in MongoDB

The project uses the **ISOT Fake News Dataset** (~44 k articles) and achieves **>98% accuracy** with an optimised ensemble model.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                │
│  Dashboard · EDA · Features · Models · Live Classifier   │
└────────────────────────┬─────────────────────────────────┘
                         │  REST API
┌────────────────────────▼─────────────────────────────────┐
│             Express.js Backend (Node.js)                 │
│   /api/summary · /api/eda · /api/models · /api/classify  │
└────────┬────────────────────────────────┬────────────────┘
         │  Mongoose ODM                  │  HTTP Proxy
┌────────▼──────────┐          ┌──────────▼───────────────┐
│  MongoDB Atlas /  │          │  FastAPI ML Service       │
│  Local Instance   │          │  /predict  /health        │
└───────────────────┘          └──────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, TailwindCSS 4, Recharts, React Router 7 |
| **Backend** | Node.js, Express 5, Mongoose, Axios, dotenv |
| **ML Service** | Python, FastAPI, Uvicorn, scikit-learn, XGBoost, joblib |
| **Database** | MongoDB (local or Atlas) |
| **Data Pipeline** | Python, pandas, numpy, matplotlib, seaborn |
| **ML Models** | Logistic Regression, Random Forest, Linear SVM, XGBoost |

---

## 📁 Project Structure

```
DataScience Project/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Dashboard, EDA, Features, Models, Classifier, Team…
│   │   ├── components/      # Shared UI components
│   │   ├── App.jsx          # Router & sidebar layout
│   │   └── main.jsx
│   └── package.json
│
├── server/                  # Express.js REST API
│   ├── index.js             # All API routes
│   ├── models/              # Mongoose schemas (DatasetStats, ModelMetrics, PredictionHistory)
│   ├── public/
│   │   ├── notebooks/       # .ipynb files + rendered HTML
│   │   └── downloads/       # Cleaned dataset CSV, data dictionary
│   └── package.json
│
├── ml-service/              # FastAPI inference service
│   ├── main.py              # /predict & /health endpoints
│   └── requirements.txt
│
├── data-pipeline/           # Offline stats & model-building scripts
│   ├── build_stats.py       # Builds MongoDB documents from notebooks
│   ├── generate_stats.py    # Generates EDA statistics
│   ├── inspect_notebooks.py
│   └── output/             # Saved .joblib model artifacts
│
├── Fake.csv                 # ISOT fake news corpus (~23k articles)
├── True.csv                 # ISOT real news corpus (~21k articles)
└── Project_req/             # Project guidelines PDF
```

---

## 🔬 ML Pipeline

The project follows a rigorous 3-phase methodology documented in Jupyter Notebooks:

### Phase 1 — Exploratory Data Analysis
- Class balance analysis, duplicate detection
- Text-length distributions, word frequency visualisation
- Libraries: `pandas`, `numpy`, `matplotlib`, `seaborn`

### Phase 2 — Feature Engineering & Baseline Modeling
- Stratified 80/20 train/test split
- TF-IDF vectorisation (5,000 features)
- Chi-Square + Random-Forest feature selection → 63 final features
- 7 hand-crafted structural features (word count, punctuation, uppercase ratio, …)
- Baseline: Logistic Regression, Naïve Bayes

### Phase 3 — Advanced Modeling & Optimisation
- Ensemble training: **Random Forest**, **XGBoost**, **Linear SVM**
- GridSearchCV hyperparameter optimisation
- LSA dimensionality reduction experiments
- Final model exported as `best_model.pkl` + `phase2_artifacts.pkl`

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- MongoDB (local `mongod` or Atlas URI)

---

### 1. Clone the repository

```bash
git clone https://github.com/hashirahmad806/Data_Science_final_project.git
cd Data_Science_final_project
```

---

### 2. Start the ML Service (FastAPI)

```bash
cd ml-service
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> ✅ Health check: `http://localhost:8000/health`

---

### 3. Start the Backend (Express)

```bash
cd server
npm install

# Create a .env file
echo MONGO_URI=mongodb://127.0.0.1:27017/veritasai > .env
echo PORT=5000 >> .env
echo ML_SERVICE_URL=http://127.0.0.1:8000 >> .env

node index.js
```

> ✅ API base: `http://localhost:5000/api`

---

### 4. Start the Frontend (React / Vite)

```bash
cd client
npm install
npm run dev
```

> ✅ App: `http://localhost:5173`

---

### 5. (Optional) Run the Data Pipeline

To regenerate model artifacts and database stats from the raw CSVs:

```bash
cd data-pipeline
pip install -r requirements.txt
python build_stats.py
python generate_stats.py
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/summary` | Dashboard KPIs (dataset size, best accuracy, model count) |
| `GET` | `/api/eda` | EDA statistics and chart data |
| `GET` | `/api/features` | Feature engineering & selection results |
| `GET` | `/api/models` | Model comparison table & confusion matrix |
| `POST` | `/api/classify` | Classify a news article (`{ "text": "..." }`) |
| `GET` | `/api/classify/history` | Last 10 predictions |
| `GET` | `/api/notebooks` | List all Jupyter notebooks with metadata |
| `GET` | `/api/notebooks/:id/download` | Download a notebook `.ipynb` |
| `GET` | `/api/notebooks/:id/preview` | View rendered HTML notebook |

### ML Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health & model load status |
| `POST` | `/predict` | Run inference (`{ "text": "..." }`) → label, confidence, top tokens |

---

## 📊 Dataset

**[ISOT Fake News Dataset](https://www.uvic.ca/engineering/ece/isot/datasets/fake-news/index.php)**

| File | Articles | Label |
|------|----------|-------|
| `True.csv` | ~21,417 | Real (1) |
| `Fake.csv` | ~23,481 | Fake (0) |

> ⚠️ **Note:** The CSV files are large (~116 MB combined) and are excluded from version control via `.gitignore`. Download them separately and place them in the project root.

---

## 📈 Results

| Model | Accuracy | Precision | Recall | F1 |
|-------|----------|-----------|--------|----|
| Logistic Regression (Baseline) | ~94% | 0.94 | 0.94 | 0.94 |
| Random Forest | ~98% | 0.98 | 0.98 | 0.98 |
| Linear SVM | ~98% | 0.98 | 0.98 | 0.98 |
| **XGBoost (Best)** | **>98%** | **0.99** | **0.98** | **0.99** |

The live `/predict` endpoint returns:
- `prediction` — "Real" or "Fake"
- `confidence` — probability score (0–1)
- `risk_level` — low / medium / high
- `top_tokens` — top TF-IDF features that influenced the prediction
- `structural_features` — word count, text length, punctuation, uppercase ratio

---

## 👥 Team

| Name | Role |
|------|------|
| Hashir Ahmad | Project Lead · ML Engineering · Full-stack |

*Data Science Capstone — 2026*

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ as a Data Science Capstone · <strong>VeritasAI</strong>
</p>
