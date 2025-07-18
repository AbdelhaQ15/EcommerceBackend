const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        products: [
            {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
                },
            quantity: {
                type: Number,
                required: true
                },
            price: {
                type: Number,
                required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: 'pending',
            enum: ['pending','proccessing','shipped','delivered','cancelled']
        },
        shippingAddress: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const order = mongoose.model('Order', orderSchema);

module.exports = order;