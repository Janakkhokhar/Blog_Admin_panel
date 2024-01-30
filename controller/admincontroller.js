let adminpanel = require("../models/adminpanel");
let path = require("path");
let fs = require("fs");
const nodemailer = require("nodemailer");

const { Model } = require("mongoose");
const { Module } = require("module");

module.exports.dashborad = async (req, res) => {
  return res.render("dashborad");
};

module.exports.add_admin = async (req, res) => {
  if (req.user == undefined) {
    return res.redirect("/admin/");
  }
  return res.render("add_admin", {
    admin: req.user,
  });
};

module.exports.view_admin = async (req, res) => {
  // searching
  let search = '';
  if (req.query.search) {
    search = req.query.search;
  }
  //end

  // pageingtion
  if (req.query.page) {
    page = req.query.page;
  }
  else {
    page = 0;
  }
  let perpage = 3;
  //end


  let data = await adminpanel.find({
    $or: [
      { "name": { $regex: ".*" + search + ".*" } },
      { "email": { $regex: ".*" + search + ".*" } },
      { "gender": { $regex: ".*" + search + ".*" } }
    ]
  })
    .limit(perpage)
    .skip(perpage * page);

  let totalAdminData = await adminpanel.find({
    $or: [
      { "name": { $regex: ".*" + search + ".*" } },
      { "email": { $regex: ".*" + search + ".*" } },
      { "gender": { $regex: ".*" + search + ".*" } }
    ]
  }).countDocuments();


  return res.render("view_admin", {
    AData: data,
    admin: req.user,
    search: search,
    totalDocument: Math.ceil(totalAdminData / perpage),
    currentpage: page,
  });
};

module.exports.AdminDetails = async (req, res) => {
  try {
    let ImagePath = "";
    if (req.file) {
      ImagePath = adminpanel.AdminModelPath + "/" + req.file.filename;
    } else {
      console.log("Image not found");
      return res.redirect("back");
    }
    if (req.body) {
      req.body.name = req.body.fname + " " + req.body.lname;
      req.body.AdminImg = ImagePath;
      req.body.isActive = true;
      req.body.Created_date = new Date().toLocaleDateString();
      req.body.Updated_date = new Date().toLocaleString();
      let data = await adminpanel.create(req.body);
      return res.redirect("/admin/view_admin");
      // console.log(req.body);
      // console.log(req.file);
    } else {
      console.log("data not found");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("something worng", err);
    return res.redirect("back");
  }
};

module.exports.activedata = async (req, res) => {
  if (req.params.id) {
    let data = await adminpanel.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });
    if (data) {
      return res.redirect("back");
    } else {
      console.log("Admin not Deactive");
      return res.redirect("back");
    }
  } else {
    console.log("Admin not found");
    return res.redirect("back");
  }
};

module.exports.deactivedata = async (req, res) => {
  if (req.params.id) {
    let data = await adminpanel.findByIdAndUpdate(req.params.id, {
      isActive: true,
    });
    if (data) {
      return res.redirect("back");
    } else {
      console.log("Admin not active");
      return res.redirect("back");
    }
  } else {
    console.log("Admin not found");
    return res.redirect("back");
  }
};

module.exports.delelerecord = async (req, res) => {

  try {
    let olddata = await adminpanel.findById(req.params.id);
    if (olddata) {
      let oldImage = olddata.AdminImg;
      if (oldImage) {
        let fullpath = path.join(__dirname, ".." + olddata.AdminImg);
        let dImage = await fs.unlinkSync(fullpath);
        let deleteRecord = await adminpanel.findByIdAndDelete(req.params.id);
        if (deleteRecord) {
          console.log("Record and image delets successfully");
          return res.redirect("/admin/view_admin");
        } else {
          console.log("Record delete successfully");
          return res.redirect("back");
        }
      } else {
        let deleteRecord = await adminpanel.findByIdAndDelete(req.params.id);
        if (deleteRecord) {
          console.log("Record and image delets successfully");
          return res.redirect("back");
        } else {
          console.log("Record delete successfully");
          return res.redirect("back");
        }
      }
    } else {
      console.log("Record not found");
      return res.redirect("back");
    }
  } catch {
    console.log("something worng");
    return res.redirect("back");
  }
};

module.exports.updatedata = async (req, res) => {
  let record = await adminpanel.findById(req.params.id);
  let adminRecord = req.user;
  return res.render("updatedata", {
    Update: record,
    admin: adminRecord,
  });
};

module.exports.Editupdatedata = async (req, res) => {
  try {
      let oldData = await adminpanel.findById(req.body.oldId);
      if (req.file) {
          if (oldData.AdminImg) {
              let fullPath = path.join(__dirname, ".." + oldData.AdminImg);
              await fs.unlinkSync(fullPath);
          }
          let imagePath = "";
          imagePath = adminpanel.AdminModelPath + "/" + req.file.filename;
          req.body.AdminImg = imagePath;
          res.locals.user.AdminImg = imagePath;
      } else {
          req.body.AdminImg = oldData.AdminImg;
      }

      await adminpanel.findByIdAndUpdate(req.body.oldId, req.body);
      let adminData = await adminpanel.findById(req.body.oldId);
      res.locals.user = adminData;
      return res.redirect("/admin/view_admin");
  } catch (err) {
      console.log(err);
      return res.redirect("back");
  }
};

// Admin Login

module.exports.checklogin = async (req, res) => {
  return res.redirect("/admin/dashborad");
};

// end

// Admin chanage  password

module.exports.changepassword = async (req, res) => {
  try {
    if (req.user == undefined) {
      return res.redirect("/admin/");
    }

    let adminRecord = req.user;
    return res.render("modifypassword", {
      admin: adminRecord,
    });
  } catch {
    console.log("something worng");
    return res.redirect("back");
  }
};
//end

//Modify Password

module.exports.modifypassword = async (req, res) => {
  // console.log(req.body);
  let adminRecord = req.user;
  if (adminRecord.password == req.body.cpass) {
    if (req.body.cpass != req.body.npass) {
      if (req.body.npass == req.body.copass) {
        let allAdmin = await adminpanel.findById(adminRecord._id);
        if (allAdmin) {
          let editpass = await adminpanel.findByIdAndUpdate(allAdmin.id, {
            password: req.body.npass,
          });
          if (editpass) {
            return res.redirect("/admin/logout");
          } else {
            console.log("password not upload");
          }
        } else {
          console.log("record not found");
        }
      } else {
        console.log("confirm password not match");
      }
    } else {
      console.log("confirm and new password  not match");
    }
  } else {
    console.log("Current password not found");
  }
  return res.redirect("back");
};

// End

// Admin Profile

module.exports.profile = async (req, res) => {
  let adminRecord = req.user;
  return res.render("profile", {
    admin: adminRecord,
  });
};

// End

// Edit ProFile

module.exports.editprofile = async (req, res) => {
  let adminRecord = req.user;
  // console.log(adminRecord);
  return res.render("EditProFile", {
    admin: adminRecord,
  });
};

//end



//multipal Delete

module.exports.DeleteAllRecord = async (req, res) => {
  // console.log(req.body);
  await adminpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
  return res.redirect('back');
}
// End