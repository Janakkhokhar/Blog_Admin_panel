let mongoose = require('mongoose');

let multer = require('multer');

let reviewImagePath = "/upload/reviewImage";

let path = require('path');

let reviewSchema = mongoose.Schema({

    reviewicon: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    country: {
        type: Array,
        required: true
    },
    city: {
        type: Array,
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

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", reviewImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

reviewSchema.statics.UploadreviewImg = multer({ storage: imageStorage }).single('reviewicon');
reviewSchema.statics.reviewModelPath     = reviewImagePath;

let reviewpanel = mongoose.model('reviewpanel', reviewSchema);
module.exports = reviewpanel;
