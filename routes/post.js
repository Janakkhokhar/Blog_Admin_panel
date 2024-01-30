let express = require('express');

let routes = express.Router();

let postcontroller = require('../controller/postcontroller');

let postpanel = require('../models/postpanel');

routes.get('/add_post', postcontroller.add_post);

routes.post('/insertpostData', postpanel.UploadpostImg, postcontroller.insertpostData);

routes.get('/view_post',postcontroller.view_post);

routes.get('/activedata/:id',postcontroller.activedata);

routes.get('/deactivedata/:id',postcontroller.deactivedata);

routes.get('/updatepost/:id',postcontroller.updatepost);

routes.post('/Editpost',postpanel.UploadpostImg,postcontroller.Editpost);

routes.get('/deletepost/:id',postcontroller.deletepost);

routes.get('/DeleteAllRecord',postcontroller.DeleteAllRecord);

module.exports = routes;