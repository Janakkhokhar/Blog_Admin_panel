let express = require('express');

let routes = express.Router();

let commentpanel = require('../models/commentpanel');

let commentcontroller = require('../controller/commentcontroller');

routes.get('/view_comment', commentcontroller.view_comment);


routes.get("/activedata/:id", commentcontroller.activedata);

routes.get("/deactivedata/:id", commentcontroller.deactivedata);



//multipal Delete

routes.post('/DeleteAllRecord', commentcontroller.DeleteAllRecord);

//end
module.exports =routes