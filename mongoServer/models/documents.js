const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    document_id: {
        type: String,
        required: true,
        unique: true
    },
    receipt_id: {
        type: String,
        required: true,
        index: true
    },
    document_file: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Documents", DocumentSchema);