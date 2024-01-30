let express = require("express");

let routes = express.Router();

let usercontroller = require("../controller/usercontroller");

let commentpanel = require("../models/commentpanel");




routes.get('/', usercontroller.home);


routes.get('/blog_single/:id',usercontroller.blog_single);

routes.post('/addComment',commentpanel.UploadcommentImg,usercontroller.addComment);

routes.get('/work_three',usercontroller.work_three);

routes.get('/contact',usercontroller.contact);

routes.post('/InsertContactData',usercontroller.InsertContactData);


module.exports = routes;