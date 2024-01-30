let mongoose = require('mongoose');
let multer = require('multer');
let path = require('path');
let recentImagePath  = "/upload/recentImage";

let recentSchema = mongoose.Schema({

    RecentImage : {
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
        cb(null, path.join(__dirname, "..", recentImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

recentSchema.statics.UploadrecentImg = multer({ storage: imageStorage }).single('RecentImage');
recentSchema.statics.recentModelPath = recentImagePath;

let recentpanel = mongoose.model('recentpanel', recentSchema);
module.exports = recentpanel;

