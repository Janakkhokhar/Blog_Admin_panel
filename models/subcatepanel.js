let mongoose = require('mongoose');

let multer = require('multer');

let path = require('path');

let subcateImagePath = "/upload/subcateImage";

let subcateSchema = mongoose.Schema({

    subcate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categorypanel",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subcateImage: {
        type: String,
        required: true,
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
        cb(null, path.join(__dirname, "..", subcateImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

subcateSchema.statics.UploadsubcateImg = multer({ storage: imageStorage }).single('subcateImage');
subcateSchema.statics.SubcateModelPath = subcateImagePath;

let subcatepanel = mongoose.model('subcatepanel', subcateSchema);
module.exports = subcatepanel;

