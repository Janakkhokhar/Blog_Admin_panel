let mongoose = require('mongoose');
let multer = require('multer');
let path = require('path');
let sliderImagePath  = "/upload/sliderImage";

let sliderSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    sliderImage: {
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
        cb(null, path.join(__dirname, "..", sliderImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

sliderSchema.statics.UploadsliderImg = multer({ storage: imageStorage }).single('sliderImage');
sliderSchema.statics.sliderModelPath = sliderImagePath;

let sliderpanel = mongoose.model('sliderpanel', sliderSchema);
module.exports = sliderpanel;

