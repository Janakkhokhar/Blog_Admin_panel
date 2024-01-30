let express = require('express')

let routes = express.Router();

let offercontroller = require('../controller/offercontroller');

const offerpanel = require('../models/offerpanel');

routes.get('/add_offer', offercontroller.add_offer);

routes.post('/insertofferData', offerpanel.UploadofferImg, offercontroller.insertofferData);

routes.get('/view_offer', offercontroller.view_offer);

routes.get('/activedata/:id', offercontroller.activedata);

routes.get('/deactivedata/:id', offercontroller.deactivedata);

routes.get('/updateoffer/:id', offercontroller.updateoffer);

routes.post('/Editoffer', offerpanel.UploadofferImg, offercontroller.Editoffer);

routes.get('/deleteoffer/:id', offercontroller.deleteoffer);

routes.get('/DeleteAllRecord', offercontroller.DeleteAllRecord);

module.exports = routes;