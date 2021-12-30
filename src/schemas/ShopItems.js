const mongoose = require('mongoose');

const shopItemsSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    price: {
        type: Number
    },
    purchases: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('ShopItems', shopItemsSchema);