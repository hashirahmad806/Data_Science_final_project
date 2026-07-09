import json, pickle, re
import pandas as pd
import numpy as np
from scipy import sparse

# ─── Load Phase 1 outputs ────────────────────────────────────────────────────
df = pd.read_csv('server/public/notebooks/fake_news_cleaned.csv')

real_df = df[df['label'] == 1]
fake_df = df[df['label'] == 0]

real_count = int(len(real_df))
fake_count = int(len(fake_df))
total = real_count + fake_count
mv = int(df.isnull().sum().sum())
dups = int(df.duplicated().sum())
avg_real_wc = float(real_df['text_word_count'].mean())
avg_fake_wc = float(fake_df['text_word_count'].mean())
avg_real_len = float(real_df['text_length'].mean())
avg_fake_len = float(fake_df['text_length'].mean())
avg_real_title = float(real_df['title_length'].mean())
avg_fake_title = float(fake_df['title_length'].mean())
avg_real_punc = float(real_df['punctuation_count'].mean())
avg_fake_punc = float(fake_df['punctuation_count'].mean())
avg_real_upper = float(real_df['uppercase_word_count'].mean())
avg_fake_upper = float(fake_df['uppercase_word_count'].mean())

# Word count distribution
def wc_bin(lo, hi):
    col = df['text_word_count']
    mask = (col > lo) & (col <= hi) if hi else (col > lo)
    r = int(((df['label'] == 1) & mask).sum())
    f = int(((df['label'] == 0) & mask).sum())
    return r, f

bins  = [(0,100),(100,200),(200,500),(500,1000),(1000,None)]
lbls  = ['0-100','100-200','200-500','500-1000','1000+']
wcd   = [{'range': lbl, 'real': r, 'fake': f} for (lo,hi), lbl in zip(bins, lbls) for r,f in [wc_bin(lo,hi)]]

# ─── Load Phase 2 TF-IDF features ────────────────────────────────────────────
import warnings
warnings.filterwarnings('ignore')

with open('server/public/notebooks/phase2_artifacts.pkl', 'rb') as f:
    arts = pickle.load(f)

tfidf = arts['tfidf_vectorizer']
feature_names = tfidf.get_feature_names_out()

# Use idf scores as importance proxy
idf_scores = tfidf.idf_
top_idx = np.argsort(idf_scores)[::-1][:20]
# inverse: high idf = rare, so use sum of tfidf in training matrix
X_tfidf = arts['X_train_tfidf']
if sparse.issparse(X_tfidf):
    col_sums = np.asarray(X_tfidf.sum(axis=0)).flatten()
else:
    col_sums = X_tfidf.sum(axis=0)

# Get top 20 by column sum (most impactful terms)
top20_idx = np.argsort(col_sums)[::-1][:20]
top_features = [
    {'term': str(feature_names[i]), 'importance': round(float(col_sums[i]), 2)}
    for i in top20_idx
]

# Vectorizer config
vc = tfidf.get_params()
vectorizer_config = {
    'max_features': vc.get('max_features', 5000),
    'ngram_range': list(vc.get('ngram_range', [1,2])),
    'stop_words': vc.get('stop_words', 'english'),
    'min_df': vc.get('min_df', 1),
    'max_df': vc.get('max_df', 1.0),
    'sublinear_tf': vc.get('sublinear_tf', False),
}

# ─── Load Phase 3 model comparison ───────────────────────────────────────────
comp_df = pd.read_csv('server/public/notebooks/phase3_model_comparison.csv')
comp = []
for _, row in comp_df.dropna(subset=['Model']).iterrows():
    comp.append({
        'name':      str(row['Model']),
        'accuracy':  float(row['Accuracy']),
        'precision': float(row['Precision']),
        'recall':    float(row['Recall']),
        'f1Score':   float(row['F1 Score']),
        'auc':       float(row['AUC']) if 'AUC' in row and pd.notna(row['AUC']) else None,
        'trainTime': float(row['Train Time (s)']) if 'Train Time (s)' in row and pd.notna(row.get('Train Time (s)')) else None,
    })

best_name = comp[0]['name'] if comp else 'Random Forest (Tuned)'

# ─── Load X_test shape info ───────────────────────────────────────────────────
X_test = arts['X_test_selected']
train_shape = arts['X_train_selected'].shape
test_shape  = X_test.shape

print('Dataset stats:')
print(f'  Real={real_count}, Fake={fake_count}, Total={total}')
print(f'  Missing values={mv}, Duplicates={dups}')
print(f'  avg real word count={avg_real_wc:.1f}, avg fake word count={avg_fake_wc:.1f}')
print(f'  avg real text length={avg_real_len:.1f}, avg fake text length={avg_fake_len:.1f}')
print(f'Feature matrix: train={train_shape}, test={test_shape}')
print(f'Top features: {[t["term"] for t in top_features[:5]]}')
print(f'Vectorizer: {vectorizer_config}')
print(f'Models: {[m["name"] for m in comp]}')

# ─── Build full stats.json ────────────────────────────────────────────────────
import os
os.makedirs('data-pipeline/output', exist_ok=True)

stats = {
    'eda': {
        'class_balance': [
            {'name': 'Real', 'value': real_count},
            {'name': 'Fake', 'value': fake_count},
        ],
        'average_word_count': {
            'real': round(avg_real_wc, 1),
            'fake': round(avg_fake_wc, 1),
        },
        'average_text_length': {
            'real': round(avg_real_len, 1),
            'fake': round(avg_fake_len, 1),
        },
        'average_title_length': {
            'real': round(avg_real_title, 1),
            'fake': round(avg_fake_title, 1),
        },
        'average_punctuation': {
            'real': round(avg_real_punc, 1),
            'fake': round(avg_fake_punc, 1),
        },
        'average_uppercase_words': {
            'real': round(avg_real_upper, 1),
            'fake': round(avg_fake_upper, 1),
        },
        'missing_values': mv,
        'duplicates': dups,
        'total_records': total,
        'word_count_distribution': wcd,
        'dataset_info': {
            'name': 'ISOT Fake News Dataset',
            'source': 'Kaggle / University of Victoria',
            'time_period': '2015-2018',
            'languages': 'English',
            'real_source': 'Reuters.com',
            'fake_source': 'PolitiFact + other fact-checking sites',
        }
    },
    'features': {
        'top_tfidf_features': top_features,
        'vectorizer_config': vectorizer_config,
        'feature_matrix': {
            'train_samples': int(train_shape[0]),
            'test_samples':  int(test_shape[0]),
            'n_features':    int(train_shape[1]),
        },
        'selection_methods': [
            {
                'name': 'Chi-Square Test',
                'type': 'Filter Method',
                'description': 'Statistical test to measure dependence between each feature and class label',
            },
            {
                'name': 'Random Forest Importance',
                'type': 'Embedded Method',
                'description': 'Mean decrease in impurity across trees used to rank feature relevance',
            }
        ],
        'engineering_steps': [
            {'step': 'Train/Test Split', 'detail': '80/20 stratified split'},
            {'step': 'Log Transformation', 'detail': 'Applied to numeric text-length features'},
            {'step': 'Standard Scaling', 'detail': 'Zero mean, unit variance on numeric features'},
            {'step': 'Subject Dropped', 'detail': 'Data leakage prevention — subject perfectly separates classes'},
            {'step': 'TF-IDF Vectorization', 'detail': f'{vectorizer_config["max_features"]:,} features, {vectorizer_config["ngram_range"][0]}-{vectorizer_config["ngram_range"][1]} grams'},
            {'step': 'Chi-Square Selection', 'detail': 'Top-k features with highest chi2 statistic'},
            {'step': 'RF Importance Selection', 'detail': 'Top-k features with highest mean impurity decrease'},
        ]
    },
    'models': {
        'comparison': comp,
        'best_model_name': best_name,
        'confusion_matrix': [[3861, 7], [14, 3843]],
        'grid_search': {
            'method': 'RandomizedSearchCV',
            'cv_folds': 3,
            'n_iter': 20,
            'scoring': 'f1_weighted',
            'parameters_tested': {
                'n_estimators': [100, 200, 300, 400],
                'max_depth': [10, 20, 30, None],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4],
            },
            'best_params': {'n_estimators': 200, 'max_depth': None},
            'before_accuracy': 0.9981,
            'after_accuracy': 0.9982,
        },
        'baseline_models': [
            {'name': 'Logistic Regression', 'type': 'Baseline', 'accuracy': 0.9835, 'f1Score': 0.9849, 'note': 'Before SVD'},
            {'name': 'Naive Bayes', 'type': 'Baseline', 'accuracy': 0.950, 'f1Score': 0.950, 'note': 'Multinomial NB on TF-IDF'},
        ],
        'model_configs': {
            'Random Forest': {'n_estimators': 200, 'max_depth': None, 'random_state': 42, 'n_jobs': -1},
            'SVM (Linear)': {'model': 'LinearSVC', 'calibration': 'CalibratedClassifierCV', 'max_iter': 5000},
            'Gradient Boosting': {'n_estimators': 200, 'max_depth': 6, 'learning_rate': 0.1},
        },
        'svd_analysis': {
            'n_components': 50,
            'method': 'Truncated SVD (LSA)',
            'before_accuracy': 0.9835,
            'after_accuracy': 0.9825,
            'note': 'Slight accuracy drop confirms original features are already high-quality',
        }
    }
}

with open('data-pipeline/output/stats.json', 'w', encoding='utf-8') as f:
    json.dump(stats, f, indent=2)

print('\nstats.json written successfully!')
