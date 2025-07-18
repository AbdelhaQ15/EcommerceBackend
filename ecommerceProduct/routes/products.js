const express = require('express');
const products = require('../model/product');
const users = require('../model/user');
const categories = require('../model/category');
const auth = require('../middleware/requireAuth');
const router = express.Router();
const fs = require('fs');

//multer for uploading product image
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

//return all products access(all)
router.get('/', async(req,res) => {

    try {
        const allProducts = await products.find();
        if(!allProducts) return res.status(404).json({ success: true, message: 'No products at the moment' });
        return res.status(201).json(allProducts);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

});

//return single product access(all)
router.get('/:id', async(req,res) => {
    const { id } = req.params;

    try {
        const singleProduct = await products.findById(id);
        if(!singleProduct) return res.status(404).json('Products not found');
        return res.status(200).json(singleProduct);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

//Create new product access(admin only)
router.post('/',auth,upload.single('product'), async(req,res) => {

    const userInfo = req.user;
    const fileInfo = req.file;
    
    try {
        const user = await users.findOne({ email: userInfo.email });
        if(user.role ==='admin') {
            
            if(!req.body.title || !req.body.description || !req.body.price ||
                !req.body.stock
            ) return res.status(400).json({ success: false, message: 'Fill all required fields' });
            const newProduct = await products.create({
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                image: fileInfo.path,
                category: req.body.categories,
                stock: req.body.stock,
            });
            return res.status(201).json(newProduct);
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    
});


//Update product details  access(admin only)
router.put('/:id',auth,upload.single('product'), async(req,res) => {

    const userInfo = req.user;
    const { id } = req.params;
    const fileInfo = req.file;
    


    try {
        const user = await users.findOne({ email: userInfo.email });
        if(user.role ==='admin') {
            if(!req.body.title || !req.body.description || !req.body.price ||
                !req.body.stock)
                return res.status(400).json({ success: false, message: 'Fill all required fields' });
            const product = await products.findById(id);
            fs.unlink(product.image, () =>{
                console.log('the file been deleted');
            });

            const updateProduct = await products.findByIdAndUpdate(id ,{
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                stock: req.body.stock,
                image: fileInfo.path,
            });
            return res.status(201).json(updateProduct);
        };


    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

});

//Delete a product access(admin only)
router.delete('/:id',auth, async(req,res) => {
    const userInfo = req.user;
    const { id } = req.params;

    try {
        const user = await users.findOne({ email: userInfo.email });
        if(user.role ==='admin') {
            const deleteProduct = await products.findByIdAndDelete(id);
            return res.status(201).json(deleteProduct);
        };
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

});

module.exports = router;