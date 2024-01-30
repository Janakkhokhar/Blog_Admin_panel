let express = require('express');

let routes = express.Router();

let subcatecontroller = require('../controller/subcatecontroller');

let subcatepanel = require('../models/subcatepanel');

routes.get('/add_subcategory',subcatecontroller.add_subcategory);

routes.get('/view_subcate',subcatecontroller.view_subcate);

routes.post('/insertsubcateData',subcatepanel.UploadsubcateImg,subcatecontroller.insertsubcateData);

routes.get("/activedata/:id", subcatecontroller.activedata);

routes.get("/deactivedata/:id", subcatecontroller.deactivedata);

routes.get('/delelerecord/:id',subcatecontroller.delelerecord);

routes.get("/updatesubcate/:id",subcatecontroller.updatesubcate);

routes.post("/SubCateEdit",subcatepanel.UploadsubcateImg,subcatecontroller.SubCateEdit);


routes.post("/DeleteAllRecord",subcatecontroller.DeleteAllRecord);




module.exports = routes;