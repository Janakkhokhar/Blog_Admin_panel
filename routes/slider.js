
let express = require("express");

let routes = express.Router();

let slidercontroller = require("../controller/slidercontroller");

const sliderpanel = require("../models/sliderpanel");

routes.get('/add_slider',slidercontroller.add_slider);

routes.get('/view_slider',slidercontroller.view_slider);


routes.post('/insertSliderData', sliderpanel.UploadsliderImg, slidercontroller.insertSliderData);


routes.get("/activedata/:id", slidercontroller.activedata);

routes.get("/deactivedata/:id", slidercontroller.deactivedata);



routes.get('/updateslider/:id',slidercontroller.updateslider);

routes.get('/deleteslider/:id',slidercontroller.deleteslider);

routes.post('/Editslider',sliderpanel.UploadsliderImg,slidercontroller.Editslider);

routes.post('/DeleteAllRecord',slidercontroller.DeleteAllRecord);



module.exports = routes;