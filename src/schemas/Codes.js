const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    code: {
        type: String
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
});

module.exports = mongoose.model('Codes', codeSchema);