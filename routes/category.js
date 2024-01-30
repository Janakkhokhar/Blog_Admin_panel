let express = require('express');

let routes = express.Router();

let categorycontroller = require('../controller/categorycontroller');

let categorypanel = require('../models/categorypanel');

routes.get('/add_category', categorycontroller.add_category);

routes.post('/insertcategoryData',categorycontroller.insertcategoryData);

routes.get('/view_category',categorycontroller.view_category);



routes.get("/activedata/:id", categorycontroller.activedata);

routes.get("/deactivedata/:id", categorycontroller.deactivedata);

routes.get('/deleterecord/:id',categorycontroller.deleterecord);

routes.get("/updatacategory/:id", categorycontroller.updatacategory);

routes.post("/CategoryEdit", categorycontroller.CategoryEdit);




//multipal Delete

routes.post('/DeleteAllRecord',categorycontroller.DeleteAllRecord);

//end
module.exports = routes;