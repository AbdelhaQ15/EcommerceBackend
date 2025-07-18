const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String
        },
        stock: {
            type: Number,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
    },
    {
        timestamps: true
    }
)

const product = mongoose.model('Product', productSchema);

module.exports = product;