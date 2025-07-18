const express = require('express');
const users = require('../model/user');
const bcrypt = require('bcrypt');
const { valid, sign } = require('jsonwebtoken');
const router = express.Router();

//Login existing user with email and password
router.post('/', async(req,res) => {
    
    if(!req.body.email || !req.body.password)
        res.json('Fill all the required fields')

    try {
        const user = await users.findOne({ email: req.body.email });
        if(!user) res.json('Email doesnt exist');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(403).json('Password incorrect');

        const accesstoken = sign(
            { email: user.email },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: '15m' }
        );

        const refreshtoken = sign(
            { email: user.email },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: '1d' }
        );

        res.cookie(
            'refreshtoken',
            refreshtoken,
            {
                httpOnly: true, 
                path: '/refresh_token' 
            }
        );
        return res.status(200).json(accesstoken);

    } catch (error) {
        res.json(401).json('Something went wrong! please try again later');
    }

});

module.exports = router;