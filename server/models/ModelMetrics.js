const mongoose = require('mongoose');

const ModelMetricsSchema = new mongoose.Schema({
    comparison: Array,
    best_model_name: String,
    confusion_matrix: Array,
    grid_search: Object
});

module.exports = mongoose.model('ModelMetrics', ModelMetricsSchema);
