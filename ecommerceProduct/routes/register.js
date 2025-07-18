const express = require('express');
const router = express.Router();
const users = require('../model/user');
const bcrypt = require('bcrypt');


//Register a new user with name, email, and password
router.post('/', async(req,res) =>{

    if(!req.body.name || !req.body.email || !req.body.password)
        res.json('Fill all the required fields');

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await users.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.status(201).json(user);
    } catch (error) {
        res.json({success: false, message: error.message });
    }
});

module.exports = router;

