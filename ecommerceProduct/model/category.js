const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        }
    }
)

const category = mongoose.model('Category', categorySchema);

module.exports = category;