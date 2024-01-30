let mongoose = require('mongoose');

let multer = require('multer');

let imagepath = "/upload/AdminImage";

let path = require('path');

let AdminSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    }, 
    password : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    hobby : {
        type : Array,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    AdminImg : {
        type : String,
        required : true
    },
    isActive : {
        type : Boolean,
        required : true
    },
    Created_date : {
        type : String,
        required : true
    },
    Updated_date : {
        type : String,
        required : true
    },
    
});

let imgstorage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,"..",imagepath));
    },
    filename :function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now());
    }
});

AdminSchema.statics.UploadAdminImg = multer({storage : imgstorage}).single('AdminImg');
AdminSchema.statics.AdminModelPath = imagepath ; 

let adminpanel = mongoose.model('adminpanel',AdminSchema);
module.exports = adminpanel;

