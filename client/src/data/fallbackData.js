export const fallbackSummary = {
  datasetSize: 39105,
  bestAccuracy: 0.9982,
  modelsCompared: 5,
  deployedModel: 'Random Forest (Tuned)'
};

export const fallbackEda = {
  class_balance: [
    { name: 'Real', value: 21197 },
    { name: 'Fake', value: 17908 }
  ],
  average_word_count: { real: 384.9, fake: 414.7 },
  average_text_length: { real: 2378.7, fake: 2486.5 },
  average_title_length: { real: 64.7, fake: 91.3 },
  average_punctuation: { real: 1.6, fake: 1.9 },
  average_uppercase_words: { real: 0.4, fake: 2.8 },
  missing_values: 28484,
  duplicates: 0,
  total_records: 39105,
  word_count_distribution: [
    { range: '0-100', real: 3621, fake: 1370 },
    { range: '100-200', real: 2710, fake: 1323 },
    { range: '200-500', real: 9148, fake: 10328 },
    { range: '500-1000', real: 5190, fake: 3874 },
    { range: '1000+', real: 527, fake: 567 }
  ],
  dataset_info: {
    name: 'ISOT Fake News Dataset',
    source: 'Kaggle / University of Victoria',
    time_period: '2015-2018',
    languages: 'English',
    real_source: 'Reuters.com',
    fake_source: 'PolitiFact + other fact-checking sites'
  }
};

export const fallbackFeatures = {
  top_tfidf_features: [
    { term: 'trump', importance: 2108.96 },
    { term: 'said', importance: 1396.7 },
    { term: 'president', importance: 772.24 }
  ],
  vectorizer_config: {
    max_features: 5000,
    ngram_range: [1, 2],
    stop_words: 'english',
    min_df: 5,
    max_df: 1.0,
    sublinear_tf: false
  },
  feature_matrix: {
    train_samples: 31284,
    test_samples: 7821,
    n_features: 63
  },
  selection_methods: [
    {
      name: 'Chi-Square Test',
      type: 'Filter Method',
      description: 'Statistical test to measure dependence between each feature and class label'
    },
    {
      name: 'Random Forest Importance',
      type: 'Embedded Method',
      description: 'Mean decrease in impurity across trees used to rank feature relevance'
    }
  ],
  engineering_steps: [
    { step: 'Train/Test Split', detail: '80/20 stratified split' },
    { step: 'Log Transformation', detail: 'Applied to numeric text-length features' },
    { step: 'Standard Scaling', detail: 'Zero mean, unit variance on numeric features' },
    { step: 'Subject Dropped', detail: 'Data leakage prevention — subject perfectly separates classes' },
    { step: 'TF-IDF Vectorization', detail: '5,000 features, 1-2 grams' },
    { step: 'Chi-Square Selection', detail: 'Top-k features with highest chi2 statistic' },
    { step: 'RF Importance Selection', detail: 'Top-k features with highest mean impurity decrease' }
  ]
};

export const fallbackModels = {
  comparison: [
    {
      name: 'Random Forest (Tuned)',
      accuracy: 0.9982,
      precision: 0.9986,
      recall: 0.9981,
      f1Score: 0.9983,
      auc: 0.9999
    },
    {
      name: 'Random Forest',
      accuracy: 0.9981,
      precision: 0.9983,
      recall: 0.9981,
      f1Score: 0.9982,
      auc: 0.9999
    },
    {
      name: 'Gradient Boosting',
      accuracy: 0.9980,
      precision: 0.9983,
      recall: 0.9979,
      f1Score: 0.9981,
      auc: 0.9999
    },
    {
      name: 'SVM (Linear)',
      accuracy: 0.9959,
      precision: 0.9955,
      recall: 0.9969,
      f1Score: 0.9962,
      auc: 0.9997
    },
    {
      name: 'Logistic Regression (Before SVD)',
      accuracy: 0.9835,
      precision: 0.9764,
      recall: 0.9936,
      f1Score: 0.9849,
      auc: 0.9979
    }
  ],
  best_model_name: 'Random Forest (Tuned)',
  confusion_matrix: [[862, 11], [10, 866]],
  grid_search: {
    method: 'RandomizedSearchCV',
    cv_folds: 5,
    n_iter: 20
  },
  svd_analysis: {
    explained_variance: 0.95
  }
};
