require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const DatasetStats = require('./models/DatasetStats');
const ModelMetrics = require('./models/ModelMetrics');
const PredictionHistory = require('./models/PredictionHistory');

const app = express();
const PORT = process.env.PORT || 5000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/veritasai')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// GET /api/summary - Dashboard KPIs
app.get('/api/summary', async (req, res) => {
    try {
        const stats = await DatasetStats.findOne();
        const metrics = await ModelMetrics.findOne();
        
        let datasetSize = 0;
        if (stats && stats.eda && stats.eda.class_balance) {
            datasetSize = stats.eda.class_balance.reduce((acc, val) => acc + val.value, 0);
        }

        let bestAccuracy = 0;
        let bestModelName = "";
        let modelsCompared = 0;

        if (metrics && metrics.comparison) {
            modelsCompared = metrics.comparison.length;
            bestModelName = metrics.best_model_name;
            const best = metrics.comparison.find(m => m.name === bestModelName);
            if (best) bestAccuracy = best.accuracy;
        }

        res.json({
            datasetSize,
            bestAccuracy,
            modelsCompared,
            deployedModel: bestModelName
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/eda - EDA stats & charts
app.get('/api/eda', async (req, res) => {
    try {
        const stats = await DatasetStats.findOne();
        res.json(stats ? stats.eda : {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/features - Feature engineering/selection results
app.get('/api/features', async (req, res) => {
    try {
        const stats = await DatasetStats.findOne();
        res.json(stats ? stats.features : {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/models - Model comparison & confusion matrix
app.get('/api/models', async (req, res) => {
    try {
        const metrics = await ModelMetrics.findOne();
        res.json(metrics || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/classify - Proxy to ML service
app.post('/api/classify', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required" });

        // Forward to FastAPI ML service
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, { text });
        
        const { prediction, confidence } = response.data;

        // Save to history
        const history = new PredictionHistory({
            text,
            prediction,
            confidence
        });
        await history.save();

        res.json(response.data);
    } catch (err) {
        if (err.response) {
            res.status(err.response.status).json(err.response.data);
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// GET /api/classify/history - Recent predictions
app.get('/api/classify/history', async (req, res) => {
    try {
        const history = await PredictionHistory.find().sort({ timestamp: -1 }).limit(10);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const notebooksMetadata = [
  {
    id: "01_EDA",
    filename: "Phase1_EDA_FakeNewsDetection.ipynb",
    title: "Phase 1: Exploratory Data Analysis",
    description: "In-depth exploratory data analysis, text length distributions, duplicate checking, and word frequency visualization.",
    libraries: ["pandas", "numpy", "matplotlib", "seaborn"],
    rubricAligned: true
  },
  {
    id: "02_Feature_Engineering_Baseline",
    filename: "Phase2_FeatureEngineering_BaselineModel.ipynb",
    title: "Phase 2: Feature Engineering & Baseline Modeling",
    description: "Train/test split, TF-IDF vectorization, feature selection (Chi-Square/RF), and baseline model evaluations.",
    libraries: ["pandas", "scikit-learn", "joblib"],
    rubricAligned: true
  },
  {
    id: "03_Advanced_Modeling_Optimization",
    filename: "Phase3_AdvancedModeling_Optimization.ipynb",
    title: "Phase 3: Advanced Modeling & Optimization",
    description: "Ensemble training (RF, XGBoost, Linear SVM), GridSearchCV hyperparameter optimization, and LSA dimensionality reduction.",
    libraries: ["pandas", "scikit-learn", "xgboost", "joblib"],
    rubricAligned: true
  }
];

// GET /api/notebooks - list notebooks with size/modified times dynamically
app.get('/api/notebooks', (req, res) => {
    try {
        const list = notebooksMetadata.map(nb => {
            const filePath = path.join(__dirname, 'public/notebooks', nb.filename);
            let size = "Unknown";
            let lastModified = "Unknown";
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                size = (stats.size / 1024).toFixed(1) + " KB";
                lastModified = stats.mtime.toLocaleString();
            }
            return { ...nb, size, lastModified };
        });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/notebooks/:id/download
app.get('/api/notebooks/:id/download', (req, res) => {
    const nb = notebooksMetadata.find(n => n.id === req.params.id);
    if (!nb) return res.status(404).json({ error: "Notebook not found" });
    const filePath = path.join(__dirname, 'public/notebooks', nb.filename);
    res.download(filePath, nb.filename);
});

// GET /api/notebooks/:id/preview
app.get('/api/notebooks/:id/preview', (req, res) => {
    const nb = notebooksMetadata.find(n => n.id === req.params.id);
    if (!nb) return res.status(404).json({ error: "Notebook not found" });
    const htmlFilename = nb.filename.replace('.ipynb', '.html');
    const htmlPath = path.join(__dirname, 'public/notebooks/rendered', htmlFilename);
    if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
    } else {
        res.status(404).send(`<h3>Notebook preview not generated.</h3><p>Please run the render script on the server: <code>node server/scripts/render-notebooks.js</code></p>`);
    }
});

// GET /api/downloads/cleaned-dataset.csv
app.get('/api/downloads/cleaned-dataset.csv', (req, res) => {
    const filePath = path.join(__dirname, 'public/downloads/cleaned_dataset.csv');
    res.download(filePath, 'cleaned_dataset.csv');
});

// GET /api/downloads/data-dictionary
app.get('/api/downloads/data-dictionary', (req, res) => {
    const filePath = path.join(__dirname, 'public/downloads/data_dictionary.csv');
    res.download(filePath, 'data_dictionary.csv');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
