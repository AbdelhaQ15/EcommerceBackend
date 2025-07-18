const express = require('express');
const router = express.Router();
const orders = require('../model/order');
const users = require('../model/user');
const cart = require('../model/cartItem');
const products = require('../model/product');
const auth = require('../middleware/requireAuth');
const product = require('../model/product');


//Get all orders placed by the logged-in user.
router.get('/',auth,async(req,res) => {

    try {
        const currentUser = req.user;
        const userInfo = await users.findOne({ email: currentUser.email });
        const getOrders = await orders.find({ user: userInfo._id });
        if(!getOrders)
            return res.status(404).json({
                succes: false,
                data: [],
                message: 'You did not order any product yet'
            });
        return res.status(200).json({
            success: true,
            data: getOrders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get order items'
        });
    }

});

//Create a new order (user only)
router.post('/',auth,async(req,res) => {

    try {
        const currentUser = req.user;
        const userInfo = await users.findOne({ email: currentUser.email });
        if(!req.body.shippingaddress) 
            return res.status(400).json({
                success: false,
                message: 'Something went wrong please try again later'
            });
        const cartItems = await cart.find({ user: userInfo._id });
        const productIds = cartItems.map(cart => cart.product);
        const productModel = await products.find({ _id: { $in: productIds } });
        let productOrder = [];
        let totalAmount= 0;
        
        cartItems.forEach(item => {
            const matchedProduct = productModel.find(p => p._id.toString()  === item.product.toString());
            if(matchedProduct) {
                productOrder.push({
                    product: matchedProduct._id,
                    quantity: item.quantity,
                    price: matchedProduct.price
                });
                totalAmount += item.quantity * matchedProduct.price
            }
        });

        const newOrder = await orders.create({
            user: userInfo._id,
            products: productOrder,
            shippingAddress: req.body.shippingaddress,
            totalAmount: totalAmount,
        });
        const deleteCartItems = await cart.deleteMany({ user: userInfo._id });
        return res.status(201).json({
            success: true,
            data: newOrder,deleteCartItems,
            message: 'Order has been submitted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server problem'
        });
    }

});



//Get details of a specific order (only if it belongs to the user).
router.get('/:id',auth,async(req,res) => {

    try {
        const { id } = req.params;
        const currentUser = req.user;
        const getOrder = await orders.findOne({ _id: id, user: currentUser._id });
        if(!getOrder)
            return res.status(404).json({
                success: false,
                data: [],
                message: 'Order not found or does not belong to you'
            });
        return res.status(200).json({
            success: true,
            data: getOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get order'
        });
    }

});


//Admin only: Return all orders from all users.
router.get('/admin/all',auth,async(req,res) => {

    try {
        const currentUser = req.user;
        const userInfo = await users.findOne({ email: currentUser.email });
        if(userInfo.role !== 'admin')
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        const allOrders = await orders.find();
        return res.status(200).json({
            success: true,
            data: allOrders,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders',
        });
    }

});

//Admin only: Update status of the order (e.g. to shipped/delivered).
router.put('/admin/:id',auth,async(req,res) => {

    try {
        const { id } = req.params;
        const currentUser = req.user;
        const userInfo = await users.findOne({ email: currentUser.email });
        if(userInfo.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        const updateOrderStatus = await orders.findByIdAndUpdate(id,{
            status: 'delivered',
        });
        return res.status(201).json({
            success: true,
            data: updateOrderStatus,
            message: 'Successfully the order has been updated'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update the order'
        });
    }

});

module.exports = router;