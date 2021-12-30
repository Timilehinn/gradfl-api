const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    balance: {
        type: Number
    }
});

module.exports = mongoose.model('Users', userSchema);