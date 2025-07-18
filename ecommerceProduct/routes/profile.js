const express = require('express');
const users = require('../model/user');
const carts = require('../model/cartItem');
const orders = require('../model/order');
const auth = require('../middleware/requireAuth');
const router = express.Router();

router.get('/',auth, async(req,res) => {

    const userInfo = req.user;
    try {
        const user = await users.findOne({ email: userInfo.email }).select('-password');
        if(!user) return res.status(401).json('User does not exist');
        const cart = await carts.find({ user: user.id });
        
        const order = await orders.find({ user: user.id });
        
        if(!cart.length && !order.length) return res.status(200).json({
            userInfo: { user },
            cart: 'Cart is empty',
            orders: 'No orders yet been made',
        });
        else if(!cart.length) return res.status(200).json({
            userInfo: user,
            cart: 'Cart is empty',
            orders: order
        });
        else if(!order.length) return res.status(200).json({
            userInfo: user ,
            cart:  cart ,
            orders: 'Not orders yet been made'
        });
        else{
            return res.status(200).json({ userInfo: user,
            cart: cart,
            orders: order 
        });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

});

module.exports = router;