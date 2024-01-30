const sliderpanel = require("../models/sliderpanel");
const path = require('path');
let fs = require('fs');

module.exports.add_slider = (req, res) => {
    return res.render('add_slider');
}


module.exports.insertSliderData = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = sliderpanel.sliderModelPath + "/" + req.file.filename;
        } else {
            console.log("Image Not Found");
            return res.redirect("back");
        }
        if (req.body) {
            req.body.sliderImage = imagePath;
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await sliderpanel.create(req.body);
            return res.redirect('back');
        } else {
            console.log("Data NOt Found");
            return res.redirect("back");
        }
    } catch {
        console.log("Something Went Wrong");
        return res.redirect("back");
    }
}


module.exports.view_slider = async (req, res) => {
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


    let data = await sliderpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
            { "email": { $regex: ".*" + search + ".*" } },
        ]
    })

        .limit(perpage)
        .skip(perpage * page)


    let totalsliderData = await sliderpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
            { "email": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();

    return res.render('view_slider', {
        SData: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalsliderData / perpage),
        currentpage: page,
    });
}


module.exports.updateslider = async (req, res) => {
    let record = await sliderpanel.findById(req.params.id);
    let adminRecord = req.user;
    return res.render("updateslider", {
        Updateslider: record,
        admin: adminRecord,
    });
};


module.exports.activedata = async (req, res) => {
    if (req.params.id) {
      let data = await sliderpanel.findByIdAndUpdate(req.params.id, {
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
      let data = await sliderpanel.findByIdAndUpdate(req.params.id, {
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


module.exports.Editslider = async (req, res) => {
    let oldData = await sliderpanel.findById(req.body.EditId);
    req.body.isActive = true;
    req.body.Updated_date = new Date().toLocaleString();
    // console.log(oldData);
    if (req.file) {
        if (oldData.sliderImage) {
            let fullpath = path.join(__dirname, ".." + oldData.sliderImage);
            await fs.unlinkSync(fullpath);
        }
        let imagePath = " ";
        imagePath = sliderpanel.sliderModelPath + "/" + req.file.filename;
        req.body.sliderImage = imagePath;
    } else {
        req.body.sliderImage = imagePath;
    }
    await sliderpanel.findByIdAndUpdate(req.body.EditId, req.body);
    return res.redirect("/admin/slider/view_slider");
};



module.exports.deleteslider = async (req, res) => {
    try {
        let olddata = await sliderpanel.findById(req.params.id);
        if (olddata) {
            let oldImage = olddata.sliderImage;
            if (oldImage) {
                let fullpath = path.join(__dirname, ".." + olddata.sliderImage);
                let dImage = await fs.unlinkSync(fullpath);
                let deleteRecord = await sliderpanel.findByIdAndDelete(req.params.id);
                if (deleteRecord) {
                    console.log("Record and image delets successfully");
                    return res.redirect("back");
                } else {
                    console.log("Record delete successfully");
                    return res.redirect("back");
                }
            }
            else {
                let deleteRecord = await sliderpanel.findByIdAndDelete(req.params.id);
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


//multipal Delete

module.exports.DeleteAllRecord = async (req, res) => {
    // console.log(req.body);
    await sliderpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
}
// End



