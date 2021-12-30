require('dotenv').config();
const User = require('../schemas/User');
const Code = require('../schemas/Codes');
const Shop = require('../schemas/ShopItems');
const JWT = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { nanoid } = require('nanoid');
const createCode = require('../utils/genCode')
const Transactions = require('../schemas/Transactions');
const Orders = require('../schemas/Orders');
const mongoose = require('mongoose');

exports.login = async (req,res)=>{
    const { email, password } = req.body
    User.findOne({ email: email.toLowerCase() }).then(async (user)=>{
        if(!user){
            res.json({message: 'There is no account registered with this username, try creating an account' ,done: true, session: false})
        }else{
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                res.json({ message: 'password is incorrect', done: true, session: false})
            }else{
                const id = user._id
                const email = user.email
                const token = JWT.sign({id, email}, process.env.JWT_SECRET, {
                    expiresIn:'30d',
                })
                res.json({message: 'login successful.', done: true, session: true, token: token, details: user})
            }
        }
    })
    .catch(err => {
        console.log(err)
        res.json({message: 'An error occurred.',done: true, session: false}).status(500)
        console.log(err)
    })
}

exports.isUserAuth = async (req,res) =>{
    User.findOne({ _id: req.userId })
    .then((data) => {
      if(data){
        res.json({message:'you are authorised',details: data, authenticated: true})
      }else{
        res.json({message:'not auth', authenticated:false}).status(401)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message:'An error occurred.', authenticated:false})
    });
};


exports.createPurchaseCode = async(req, res)=>{
    try{
        const { itemId } = req.body
        const code = createCode(12)
        await Code.create({
            sellerId: req.userId,
            code,
            itemId
        })
        res.json({ purchaseCode: code, status: true })
    }catch(err){
        console.log(err.message)
        res.json({ error: err.message, status: false }).status(500)
    }
}

exports.getTransactions = async(req, res)=>{
    try{
        const transactions = await Transactions.find({ userId: mongoose.Types.ObjectId(req.userId) });
        res.json({ transactions, status: true })
    }catch(err){
        console.log(err.message)
        res.json({ error: err.message, status: false }).status(500);
    }
}


exports.getOrders = async(req, res)=>{
    try{
        const orders = await Orders.aggregate([
            {$match: {
                userId: mongoose.Types.ObjectId(req.userId)
            }},
            {$lookup: {
                from: 'shopitems',
                localField: 'itemId',
                foreignField: '_id',
                as: 'item'
            }},
            {$unwind: {
                path: '$item',
                preserveNullAndEmptyArrays: true
            }}
        ]);
        res.json({ orders, status: true })
    }catch(err){
        console.log(err.message)
        res.json({ error: err.message, status: false }).status(500);
    }
}

