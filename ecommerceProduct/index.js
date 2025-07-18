const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

//require all routes
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const profileRoute = require('./routes/profile');
const productsRoute = require('./routes/products');
const tokenRoute = require('./routes/token');
const categoriesRoute = require('./routes/categories');
const usersRoute = require('./routes/users');
const cartRoute = require('./routes/cart');
const logoutRoute = require('./routes/logout');
const ordersRoute = require('./routes/order');



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database successfully connected');
    })
    .catch(err => {
        console.log({ message: err.message });
    });




app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/profile', profileRoute);
app.use('/products', productsRoute);
app.use('/refresh_token', tokenRoute);
app.use('/category', categoriesRoute);
app.use('/users', usersRoute);
app.use('/cart', cartRoute);
app.use('/logout', logoutRoute);
app.use('/orders', ordersRoute);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
});