const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    delivered: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default:  Date.now()
    }
});

module.exports = mongoose.model('Orders', orderSchema);