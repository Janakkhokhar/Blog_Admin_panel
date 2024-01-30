let express = require('express');

let routes = express.Router();

let reviewcontroller = require('../controller/reviewcontroller');

let reviewpanel= require('../models/reviewpanel');

routes.get('/add_review',reviewcontroller.add_review);

routes.post('/insertreviewData',reviewpanel.UploadreviewImg,reviewcontroller.insertreviewData);

routes.get('/view_review',reviewcontroller.view_review);

routes.get('/activedata/:id',reviewcontroller.activedata);

routes.get('/deactivedata/:id',reviewcontroller.deactivedata);

routes.get('/updatereview/:id',reviewcontroller.updatereview);

routes.post('/Editreview',reviewpanel.UploadreviewImg,reviewcontroller.Editreview);

routes.get('/deletereview/:id',reviewcontroller.deletereview);

routes.get('/DeleteAllRecord',reviewcontroller.DeleteAllRecord);

module.exports = routes;