const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    type: {
       type: String,
       enum: ['debit', 'credit']
    },
    amount: {
        type: Number
    },
    date: {
        type: Date,
        default:  Date.now()
    }
});

module.exports = mongoose.model('Transactions', transactionSchema);