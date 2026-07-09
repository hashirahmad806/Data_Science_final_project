const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DatasetStats = require('../models/DatasetStats');
const ModelMetrics = require('../models/ModelMetrics');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/veritasai';
const STATS_PATH = path.join(__dirname, '../../data-pipeline/output/stats.json');

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected for seeding");

        if (!fs.existsSync(STATS_PATH)) {
            console.error("Error: stats.json not found. Run the data pipeline first.");
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(STATS_PATH, 'utf-8'));

        await DatasetStats.deleteMany({});
        await ModelMetrics.deleteMany({});
        console.log("Cleared existing collections");

        const stats = new DatasetStats({
            eda: data.eda,
            features: data.features
        });
        await stats.save();

        const metrics = new ModelMetrics({
            comparison: data.models.comparison,
            best_model_name: data.models.best_model_name,
            confusion_matrix: data.models.confusion_matrix,
            grid_search: data.models.grid_search
        });
        await metrics.save();

        console.log("Database seeded successfully with stats.json!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();
