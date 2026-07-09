const mongoose = require('mongoose');

const DatasetStatsSchema = new mongoose.Schema({
    eda: {
        class_balance: Array,
        average_word_count: Object,
        missing_values: Number,
        duplicates: Number,
        word_count_distribution: Array
    },
    features: {
        top_tfidf_features: Array,
        vectorizer_config: Object
    }
});

module.exports = mongoose.model('DatasetStats', DatasetStatsSchema);
