let express = require('express');

let routes = express.Router();

let recentcontroller = require('../controller/recentcontroller');

let recentpanel = require('../models/recentpanel');


routes.get  ('/add_recent',recentcontroller.add_recent);

routes.post('/insertrecentData',recentpanel.UploadrecentImg,recentcontroller.insertrecentData);

routes.get  ('/view_recent',recentcontroller.view_recent);

routes.get('/activedata/:id',recentcontroller.activedata);

routes.get('/deactivedata/:id',recentcontroller.deactivedata);

routes.get('/updaterecent/:id',recentcontroller.updaterecent);

routes.post('/Editrecent',recentpanel.UploadrecentImg,recentcontroller.Editrecent);

routes.get('/deleterecent/:id',recentcontroller.deleterecent);

routes.get('/DeleteAllRecord',recentcontroller.DeleteAllRecord);

module.exports = routes;