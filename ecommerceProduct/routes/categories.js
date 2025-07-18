const express = require('express');
const categories = require('../model/category');
const users = require('../model/user');
const router = express.Router();
const auth = require('../middleware/requireAuth');

//return all categories
router.get('/', async(req,res) => {
    
    try {
        const category = await categories.find();
        if(!category.length) return res.status(404).json('Categories not found');
        res.status(200).json({ Categories: category });
    } catch (error) {
        res.json({success: false, message: error.message });
    }

});

//Create new category (admin only)
router.post('/',auth, async(req,res) => {

    const currentUser = req.user;
    if(!req.body.name || !req.body.description)
        return res.status(422).json('Fill all the required fields');
    try {
        const userInfo = await users.findOne({ email: currentUser.email });
        if(userInfo.role === 'admin') {
            const newCategory = await categories.create({
                name: req.body.name,
                description: req.body.description
            });
            return res.status(201).json(newCategory);
        }else {
            return res.status(403).json('Not authorized by the user');
        }
        
    } catch (error) {
        res.json({ message: error.message });
    }
});

//Update categorie (admin only)
router.put('/:id',auth, async(req,res) => {
    
    const { id } = req.params;
    const currentUser = req.user;

    if(!req.body.name || !req.body.description)
        return res.json('fill all the required fields');

    try {
        const userInfo = await users.findOne({ email: currentUser.email });
        if(userInfo.role === 'admin') {
            const updateCategory = await categories.findByIdAndUpdate(id, {
                name: req.body.name,
                description: req.body.description
            });
            return res.status(201).json(updateCategory);
        }else {
            return res.status(403).json('Authorized by the user');
        }
    } catch (error) {
        res.json({ message: error.message });
    }

});

//Delete categorie (admin only)
router.delete('/:id',auth, async(req,res) => {

    const { id } = req.params;
    const currentUser = req.user;

    try {
        const userInfo = await users.findOne({ email: currentUser.email });
        if(userInfo.role === 'admin') {
            const deleteCategory = await categories.findByIdAndDelete(id);
            return res.status(200).json(deleteCategory);
        }else {
            return res.status(403).json('Not authorized by the user');
        }
    } catch (error) {
        res.json({ message: error.message });
    }

});

module.exports = router;