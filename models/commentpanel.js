let mongoose = require('mongoose');

let multer = require('multer');

let path = require('path');

let commentImagePath  = "/upload/comment";

let commentSchema = mongoose.Schema({

    commentImage: {
        type: String,
        required: true,
    },
    name : {
        type : String,
        required:true,
    },
    email: {
        type: String,
        required: true
    },
    description : {
        type : String,
        required : true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postpanel',
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
        cb(null, path.join(__dirname, "..", commentImagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

commentSchema.statics.UploadcommentImg = multer({ storage: imageStorage }).single('commentImage');
commentSchema.statics.commentModelPath = commentImagePath;

let commentpanel = mongoose.model('commentpanel', commentSchema);
module.exports = commentpanel;

