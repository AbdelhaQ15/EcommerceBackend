const express = require('express');
const router = express.Router();
const auth = require('../middleware/requireAuth');
const cookieParser = require('cookie-parser');


router.post('/',auth, (req,res) => {

    try {
        res.clearCookie(
        'refreshtoken',
        { path: '/refresh_token' }
        );
        res.status(200).json({ success: true, message: 'You logged out successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

});


module.exports = router;
