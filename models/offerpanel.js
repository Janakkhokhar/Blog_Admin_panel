let mongoose = require('mongoose');
let multer = require('multer');
let path = require('path');
let offerImagePath  = "/upload/offerImage";

let offerSchema = mongoose.Schema({

    offericon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
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

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", offerImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

offerSchema.statics.UploadofferImg = multer({ storage: imageStorage }).single('offericon');
offerSchema.statics.offerModelPath = offerImagePath;

let offerpanel = mongoose.model('offerpanel', offerSchema);
module.exports = offerpanel;

