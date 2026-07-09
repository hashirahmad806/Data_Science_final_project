const mongoose = require('mongoose');

const PredictionHistorySchema = new mongoose.Schema({
    text: String,
    prediction: String,
    confidence: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PredictionHistory', PredictionHistorySchema);
