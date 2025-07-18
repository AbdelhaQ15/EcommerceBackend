const express = require('express');
const { verify } = require('jsonwebtoken');


async function auth(req,res,next) {
    
    try {
        const authorization = req.headers['authorization'];
        if (!authorization) return res.status(401).json({ message: 'No token provided' });

        const token = authorization.split(' ')[1];
        if(!token) return res.status(401).json({ message: 'No token found' });

        const match = verify(token, process.env.ACCESS_TOKEN_KEY);
        if(!match) return res.status(401).json({ message: 'Invalid token' });

        req.user = match;

        next();

    } catch (error) {
        res.status(401).json({ message: 'token verification failed' });
    }
    
}

module.exports = auth;