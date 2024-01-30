let express = require("express");

let routes = express.Router();

let admincontroller = require("../controller/admincontroller");
const adminpanel = require("../models/adminpanel");
const passport = require("passport");

routes.get("/", async (req, res) => {
  if (req.user) {
    return res.redirect("/admin/dashborad");
  }
  return res.render("login");
});

routes.get(
  "/dashborad",
  passport.checkAuthenticated,
  admincontroller.dashborad
);

routes.get(
  "/add_admin",
  passport.checkAuthenticated,
  admincontroller.add_admin
);

routes.get(
  "/view_admin",
  passport.checkAuthenticated,
  admincontroller.view_admin
);

routes.post(
  "/AdminDetails",
  adminpanel.UploadAdminImg,
  admincontroller.AdminDetails
);

routes.get("/activedata/:id", admincontroller.activedata);

routes.get("/deactivedata/:id", admincontroller.deactivedata);

routes.get("/delelerecord/:id", admincontroller.delelerecord);

routes.get("/updatedata/:id", admincontroller.updatedata);

routes.post("/Editupdatedata", adminpanel.UploadAdminImg, admincontroller.Editupdatedata);

routes.post(
  "/checklogin",
  passport.authenticate("local", { failureRedirect: "/admin/" }),
  admincontroller.checklogin
);

routes.get("/logout", async (req, res) => {
  res.clearCookie("adminData");
  return res.redirect("/admin/");
});

routes.get("/changepassword", admincontroller.changepassword);

routes.post("/modifypassword", admincontroller.modifypassword);

routes.get("/profile", admincontroller.profile);

routes.get("/editprofile", adminpanel.UploadAdminImg, admincontroller.editprofile);

//multipal Delete

routes.post('/DeleteAllRecord', admincontroller.DeleteAllRecord);

//end






routes.use('/slider', passport.checkAuthenticated, require('./slider'));

routes.use('/offer', passport.checkAuthenticated, require('./offer'));

routes.use('/recent', passport.checkAuthenticated, require('./recent'));

routes.use('/post', passport.checkAuthenticated, require('./post'));

routes.use('/comment', passport.checkAuthenticated, require('./comment'));

routes.use('/review', passport.checkAuthenticated, require('./review'));

routes.use('/category', passport.checkAuthenticated, require('./category'));

routes.use('/subcategory', passport.checkAuthenticated, require('./subcategory'));


module.exports = routes;
