const cookieParser = require('cookie-parser');
const express = require('express');
const { verify,sign } = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/requireAuth');


router.post('/',auth, async(req, res) => {
    
    try {
        
        const user = req.user;
        const token = req.cookies.refreshtoken;

        if(!token) res.json('Token doesnt exist');

        const match = await verify(token, process.env.REFRESH_TOKEN_KEY);
        if(!match) res.json('wrong token');

        const accesstoken = sign(
            { email:  user.email},
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: '15m' }
        );
    res.status(200).json(accesstoken);

    } catch (error) {
        res.json({ message: error.message });
    }

});

module.exports = router;