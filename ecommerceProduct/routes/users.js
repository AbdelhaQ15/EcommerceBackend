const express = require('express');
const users = require('../model/user');
const auth = require('../middleware/requireAuth');
const router = express.Router();


router.get('/',auth, async(req,res) => {

    const currentUser = req.user;
    if(!currentUser) return res.status(401).json({ message: 'Unauthenticated' });
    try {
        const userInfo = await users.findOne({ email: currentUser.email });
        if(userInfo.role === 'admin') {
            const user = await users.find();
            if(!user) return res.status(404).json('User not found');
            res.status(200).json({ users: user });
        }else {
            return res.status(403).json('Not authorized user');
        }
    } catch (error) {
        res.json({ message: error.message });
    }

});

router.delete('/:id',auth, async(req,res) => {

    const { id } = req.params;
    const currentUser = req.user;

    try {
        const userInfo = await users.findOne({ email: currentUser.email });
        if(userInfo.role === 'admin') {
            const user = await users.findByIdAndDelete(id);
            if(!user) return res.status(404).json('cant find user');
            res.status(200).json({ user });
        }else {
            return res.status(403).json('Not authorized user');
        }
    } catch (error) {
        res.json({ message: error.message });
    }

});

module.exports = router;