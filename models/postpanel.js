let mongoose = require('mongoose');

let multer = require('multer');

let path = require('path');

let postImagePath  = "/upload/postImage";

let postSchema = mongoose.Schema({

    postImage: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    name : {
        type : String,
        required:true,
    },
    category: {
        type: Array,
        required: true
    },
    description : {
        type : String,
        required : true
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
        cb(null, path.join(__dirname, "..", postImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

postSchema.statics.UploadpostImg = multer({ storage: imageStorage }).single('postImage');
postSchema.statics.postModelPath = postImagePath;

let postpanel = mongoose.model('postpanel', postSchema);
module.exports = postpanel;

