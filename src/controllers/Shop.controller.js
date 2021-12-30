require('dotenv').config();
const Shop = require('../schemas/ShopItems');
const Transactions = require('../schemas/Transactions')
const Orders = require('../schemas/Orders')
const User = require('../schemas/User');
const Codes = require('../schemas/Codes');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose')

exports.getMarketItems = async(req, res)=>{
    try{
        const Items = await Shop.aggregate([
            {$lookup: {
                from: 'users',
                localField: 'sellerId',
                foreignField: '_id',
                as: 'seller'
            }},
            {$unwind: {
                path: '$seller', 
                preserveNullAndEmptyArrays: true
            }}
        ]);
        res.json({ data: Items, status: true }).status(201);
    }catch(err){
        console.log(err.message);
        res.json({ error: err.message, message: 'Something went wrong, try refreshing', status: false }).status(500);
    }
}


exports.getMarketItem = async(req, res)=>{
    try{
        const exists =  await Codes.exists({code: req.params.code})
        if(!exists){
            return res.json({ data: [], message: 'Purchase code not found', status: false })
        }
        // if()
        const Item = await Codes.aggregate([
            {$match: {
                code: req.params.code
            }},
            {$lookup: {
                from: 'shopitems',
                localField: 'itemId',
                foreignField: '_id',
                as: 'item'
            }},
            {$lookup: {
                from: 'users',
                localField: 'sellerId',
                foreignField: '_id',
                as: 'seller'
            }},
            {$unwind: {
                path: '$seller', 
                preserveNullAndEmptyArrays: true
            }},
            {$unwind: {
                path: '$item', 
                preserveNullAndEmptyArrays: true
            }}
        ]);
        res.json({ data: Item, status: true, message: 'Item found' }).status(201);
    }catch(err){
        console.log(err.message);
        res.json({ error: err.message, message: 'Something went wrong, try refreshing', status: false }).status(500);
    }
}

exports.declinePurchase = async(req, res)=>{
    try{
       await Codes.deleteOne({ code: req.params.code });
       res.json({ message: 'Payment declined', status: true })
    }catch(err){
        res.json({ error: err.message, message: 'Somethng went wrong ' }).status(500)
    }
}


exports.makePayment = async(req, res)=>{
    try{
        const { price, sellerId, itemId } = req.body
        const buyerId = req.userId;
        const code = req.params.code
        await Shop.updateOne({ _id: mongoose.Types.ObjectId(itemId) }, {$inc: { purchases: 1 }});
        await User.updateOne({ _id: mongoose.Types.ObjectId(buyerId) }, {$inc: { balance: -price }});
        await User.updateOne({ _id: mongoose.Types.ObjectId(sellerId) }, {$inc: { balance: price }});
        await Orders.create({
            userId: buyerId,
            itemId
        })
        await Codes.deleteOne({ code }); // no longer needed
        await Transactions.create(
            {
                userId: buyerId,
                type: 'debit',
                amount: price
            },
            {
                userId: sellerId,
                type: 'credit',
                amount: price
            }
        )
       res.json({ message: 'Payment successful', status: true })
    }catch(err){
        console.log(err.message)
        res.json({ error: err.message, message: 'Somethng went wrong', status: false }).status(500)
    }
}