let mongoose = require('mongoose');

let multer = require('multer');


let categorySchema = mongoose.Schema({

    category: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    Created_date: {
        type: String,
        required: true
    },
    Updated_date: {
        type: String,
        required: true
    },
});

let categorypanel = mongoose.model('categorypanel', categorySchema);
module.exports = categorypanel;