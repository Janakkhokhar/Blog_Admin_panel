let offerpanel = require('../models/offerpanel');

let path = require('path');

let fs = require('fs');

module.exports.add_offer = (req, res) => {
    return res.render('add_offer');
}

module.exports.insertofferData = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = offerpanel.offerModelPath + "/" + req.file.filename;
        } else {
            console.log("Image Not Found");
            return res.redirect("back");
        }
        if (req.body) {
            req.body.offericon = imagePath;
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await offerpanel.create(req.body);
            return res.redirect('back');
        } else {
            console.log("Data NOt Found");
            return res.redirect("back");
        }
    } catch {
        console.log("Something Went Wrong");
        return res.redirect("back");
    }
};


module.exports.view_offer = async (req, res) => {
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


    let data = await offerpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    })

        .limit(perpage)
        .skip(perpage * page)


    let totalofferData = await offerpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();

    return res.render('view_offer', {
        OfData: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalofferData / perpage),
        currentpage: page,
    });
}

module.exports.activedata = async (req, res) => {
    if (req.params.id) {
        let data = await offerpanel.findByIdAndUpdate(req.params.id, {
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
        let data = await offerpanel.findByIdAndUpdate(req.params.id, {
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


module.exports.updateoffer = async (req, res) => {
    let record = await offerpanel.findById(req.params.id);
    let adminRecord = req.user;
    return res.render("updateoffer", {
        Updateoffer: record,
        admin: adminRecord,
    });
};


module.exports.Editoffer = async (req, res) => {
    let oldData = await offerpanel.findById(req.body.EditId);
    req.body.isActive = true;
    req.body.Updated_date = new Date().toLocaleString();
    // console.log(oldData);
    if (req.file) {
        if (oldData.offericon) {
            let fullpath = path.join(__dirname, ".." + oldData.offericon);
            await fs.unlinkSync(fullpath);
        }
        let imagePath = " ";
        imagePath = offerpanel.offerModelPath + "/" + req.file.filename;
        req.body.offericon = imagePath;
    } else {
        req.body.offericon = imagePath;
    }
    await offerpanel.findByIdAndUpdate(req.body.EditId, req.body);
    return res.redirect("/admin/offer/view_offer");
};


module.exports.deleteoffer = async (req, res) => {
    try {
        let olddata = await offerpanel.findById(req.params.id);
        if (olddata) {
            let oldImage = olddata.offericon;
            if (oldImage) {
                let fullpath = path.join(__dirname, ".." + olddata.offericon);
                let dImage = await fs.unlinkSync(fullpath);
                let deleteRecord = await offerpanel.findByIdAndDelete(req.params.id);
                if (deleteRecord) {
                    console.log("Record and image delets successfully");
                    return res.redirect("back");
                } else {
                    console.log("Record delete successfully");
                    return res.redirect("back");
                }
            }
            else {
                let deleteRecord = await offerpanel.findByIdAndDelete(req.params.id);
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



module.exports.DeleteAllRecord = async (req, res) => {
    await offerpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
}