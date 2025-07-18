const express = require('express');
const cartItems = require('../model/cartItem');
const products = require('../model/product');
const users = require('../model/user');
const auth = require('../middleware/requireAuth');
const product = require('../model/product');
const router = express.Router();

//Get all cart items access(user)
router.get('/',auth, async(req,res) => {
    const userInfo = req.user;

    try {
        const cart = await cartItems.find();
        if(!cart.length) return res.status(404).json({ succes: false, message: 'Cart is empty' });
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

});

//Add product to user’s cart or increase quantity if already present
router.post('/',auth, async(req,res) => {

    const currentUser = req.user;

    try {
        const userInfo = await users.findOne({ email: currentUser.email });
        if(!req.body.product || !req.body.quantity)
            return res.status(400).json({ success: false, message: error.message });
        const user = await users.findOne({ email: userInfo.email });
        const cartProduct = await cartItems.findOne({ user: user._id, product: req.body.product });
        if(!cartProduct) {
            const addProductToCart = await cartItems.create({
                product: req.body.product,
                quantity: req.body.quantity,
                user: userInfo.id
            });
            return res.status(201).json(addProductToCart);
            
        }else {
            const updateProductToCart = await cartItems.findByIdAndUpdate(cartProduct._id,{
                quantity: cartProduct.quantity + req.body.quantity,
            });
            return res.status(201).json(updateProductToCart);
        }

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });    
    }

});

//Update quantity of a cart item access(user)
router.put('/:id',auth, async(req,res) => {
    
    const currentUser = req.user;
    const { id } = req.params;
    try {
        if(!req.body.quantity)
            res.status(400).json({
                success: false,
                message: 'Fill all required fields'
            });
        const userInfo = await users.findOne({ email: currentUser.email });
        const cartProduct = await cartItems.find({
            product: req.body.product,
            user: userInfo._id
        });
        const updateQuantity = await cartItems.findByIdAndUpdate(id,{
            quantity: req.body.quantity
        });
        return res.status(200).json({
            success: true,
            data: updateQuantity,
            message: 'Product updated from the cart successfully'
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }

});

//Remove a cart item access(user)
router.delete('/:id',auth, async(req,res) => {
    
    const { id } = req.params;
    const currentUser = req.user;
    try {
        const userInfo = await users.findOne({ email: currentUser.email });
        const deleteProductInCart = await cartItems.findOneAndDelete({
            user: userInfo._id,
            product: id,
        });
        if(deleteProductInCart)
            return res.status(404).json({
                success: false,
                message: 'Product Not found in your cart'
            });
        return res.status(200).json({
            success: true,
            data: deleteProductInCart,
            message: 'Product removed from the cart successfully'
        });
    } catch (error) {
        res.status(401).json({ sucess: false, message: error.message });
    }

});


//Clear all items from user’s cart.
router.delete('/',auth,async(req,res) => {

    try {
        const currentUser = req.user;
        const userInfo = await users.findOne({ email: currentUser.email });
        const deleteUserCart = await cartItems.deleteMany({
            user: userInfo._id
        });
        if(!deleteUserCart.length)
            return res.status(404).json({
                success: false,
                message: 'Cart is empty'
        });
        return res.status(200).json({
            success: true,
            data: deleteUserCart,
            message: 'The cart been cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart'
        });
    }

});

module.exports = router;