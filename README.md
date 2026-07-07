# Fake News Detection on Social Media

> **Course:** Data Science | **Semester:** 4th | **Department:** CS, UET Peshawar

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange)](https://jupyter.org/)
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-green)](https://scikit-learn.org/)

---

## Project Overview

An end-to-end Data Science pipeline that detects fake news articles using machine learning. We use the **ISOT Fake News Dataset** (~44,898 news articles) and build multiple ML models to classify articles as **Real (1)** or **Fake (0)** news.

**Best Model Achieved: ~99% F1 Score (Linear SVM / Tuned Random Forest)**

---

## Dataset

| Property | Value |
|----------|-------|
| **Name** | ISOT Fake News Dataset |
| **Source** | [Kaggle](https://www.kaggle.com/clmentbisaillon/fake-and-real-news-dataset) |
| **Records** | ~44,898 articles |
| **Features** | 4 raw + 8 engineered |
| **Classes** | 2 (Real / Fake) — Balanced |
| **Language** | English |
| **Time Period** | 2015–2018 |

**Files:**
- `True.csv` — 21,417 authentic news articles (Reuters)
- `Fake.csv` — 23,481 fake/misinformation articles

---

## Project Structure

```
DataScience Project/
│
├── True.csv                                       # Real news articles
├── Fake.csv                                       # Fake news articles
├── fake_news_cleaned.csv                          # Cleaned dataset (Phase 1 output)
├── phase2_artifacts.pkl                           # Feature matrices & vectorizers (Phase 2 output)
├── best_model.pkl                                 # Best trained model (Phase 3 output)
├── phase3_model_comparison.csv                    # Model comparison results
│
├── Phase1_EDA_FakeNewsDetection.ipynb             # Phase 1: EDA
├── Phase2_FeatureEngineering_BaselineModel.ipynb  # Phase 2: Features + Baseline
├── Phase3_AdvancedModeling_Optimization.ipynb     # Phase 3: Advanced ML + Tuning
│
└── README.md                                      # This file
```

---

## Project Phases

### Phase 1: Problem Definition + EDA
**Notebook:** `Phase1_EDA_FakeNewsDetection.ipynb`

Key steps:
- Problem definition and business objective
- Data collection — ISOT dataset from Kaggle
- Data quality assessment (missing values, duplicates, outliers)
- Exploratory Data Analysis with 10+ visualizations:
  - Class balance (pie chart + bar chart)
  - Text length distributions (histogram, boxplot by class)
  - Correlation heatmap
  - Pair plots
  - Subject category analysis (data leakage detection)
  - Word frequency analysis (Fake vs Real vocabulary)
  - Time series of article publication
  - Scatter plot (title length vs text length)

**Key EDA Finding:** Real news articles are ~67% longer than Fake news on average. Word choice (vocabulary) is the strongest discriminating feature.

---

### Phase 2: Feature Engineering + Baseline Modeling
**Notebook:** `Phase2_FeatureEngineering_BaselineModel.ipynb`

Key steps:
- Train/test split (80/20, stratified)
- **Feature Transformation:** Log transformation + Standard Scaling on numeric features
- **Feature Encoding:** Subject column dropped due to data leakage
- **Feature Creation:** TF-IDF vectorization (5,000 features, unigrams + bigrams)
- **Feature Selection (2 methods):**
  1. Chi-Square Test (Filter Method)
  2. Random Forest Feature Importance (Embedded Method)
- **Baseline Models:**
  - Logistic Regression: ~98% accuracy
  - Multinomial Naive Bayes: ~95% accuracy
- ROC curves and confusion matrices

---

### Phase 3: Advanced Modeling + Optimization
**Notebook:** `Phase3_AdvancedModeling_Optimization.ipynb`

Key steps:
- **Advanced Models (3 implemented):**
  1. Random Forest Classifier (200 trees)
  2. Linear SVM (LinearSVC with probability calibration)
  3. XGBoost / Gradient Boosting
- **Hyperparameter Tuning:** RandomizedSearchCV on Random Forest
- **Dimensionality Reduction (Bonus):** Truncated SVD (LSA, 50 components)
- **Full evaluation:** Confusion matrices, ROC curves, F1 comparison table
- **Feature importance** analysis of best model
- **Business insights** and deployment recommendations

---

## Results

| Model | Accuracy | Precision | Recall | F1 Score | AUC |
|-------|----------|-----------|--------|----------|-----|
| Logistic Regression (Baseline) | ~98% | ~0.98 | ~0.98 | ~0.98 | ~0.99 |
| Naive Bayes (Baseline) | ~95% | ~0.95 | ~0.95 | ~0.95 | ~0.97 |
| Random Forest | ~99% | ~0.99 | ~0.99 | ~0.99 | ~0.99 |
| **Linear SVM** | **~99%** | **~0.99** | **~0.99** | **~0.99** | **~0.99** |
| XGBoost | ~98% | ~0.98 | ~0.98 | ~0.98 | ~0.99 |
| Tuned Random Forest | ~99% | ~0.99 | ~0.99 | ~0.99 | ~0.99 |

**Best Model:** Linear SVM and Tuned Random Forest

---

## How to Run

### Prerequisites
```bash
pip install pandas numpy matplotlib seaborn scikit-learn scipy xgboost
```

### Run Order
```
1. Phase1_EDA_FakeNewsDetection.ipynb        → produces fake_news_cleaned.csv
2. Phase2_FeatureEngineering_BaselineModel.ipynb  → produces phase2_artifacts.pkl + best_model.pkl
3. Phase3_AdvancedModeling_Optimization.ipynb     → produces phase3_model_comparison.csv
```

> **Note:** Make sure `True.csv` and `Fake.csv` are in the same directory as the notebooks.

---

## Key Libraries Used

| Library | Purpose |
|---------|---------|
| `pandas`, `numpy` | Data manipulation |
| `matplotlib`, `seaborn` | Visualization |
| `scikit-learn` | ML models, feature engineering, evaluation |
| `scipy` | Sparse matrix operations |
| `xgboost` | Gradient boosting (optional) |
| `re`, `string` | Text preprocessing |

---

## Evaluation Rubric Coverage

| Criterion | Weight | Addressed |
|-----------|--------|-----------|
| Problem Definition & EDA | 20% | Phase 1 (57 cells, 10+ plots) |
| Feature Engineering & Selection | 20% | Phase 2 (TF-IDF, 2 selection methods) |
| Model Development | 25% | Phase 3 (3 advanced models) |
| Model Evaluation & Optimization | 20% | Phase 3 (tuning, ROC, confusion matrix) |
| Report & Presentation | 15% | Report PDF + README |

---

## Authors

- [Student Name 1] — [Student ID]
- [Student Name 2] — [Student ID]
- [Student Name 3] — [Student ID]
- [Student Name 4] — [Student ID]

**Department of Computer Science**  
**University of Engineering & Technology, Peshawar**  
**Semester 4, 2024–25**

---

## References

1. Ahmed, H., Traore, I., & Saad, S. (2018). Detecting opinion spams and fake news using text classification. *Security and Privacy*, 1(1), e9.
2. Scikit-learn Documentation: https://scikit-learn.org/stable/
3. ISOT Fake News Dataset: https://www.kaggle.com/clmentbisaillon/fake-and-real-news-dataset
4. Pedregosa et al. (2011). Scikit-learn: Machine Learning in Python. *JMLR 12*, 2825-2830.
