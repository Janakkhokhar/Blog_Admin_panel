let recentpanel = require('../models/recentpanel');

let path =require('path');

let fs = require('fs');

module.exports.add_recent = (req, res) => {
    return res.render('add_recent');
}

module.exports.insertrecentData = async (req,res)=>{
    try {       
        let imagePath = "";
        if (req.file) {
            imagePath = recentpanel.recentModelPath + "/" + req.file.filename;
        } else {
            console.log("Image Not Found");
            return res.redirect("back");
        }
        if (req.body) {
            req.body.RecentImage = imagePath;
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await recentpanel.create(req.body);
            return res.redirect('back');
        } else {
            console.log("Data NOt Found");
            return res.redirect("back");
        }
    } catch{
        console.log("Something Went Wrong");
        return res.redirect("back");
    }
};



module.exports.view_recent = async (req, res) => {
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


    let data = await recentpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    })

        .limit(perpage)
        .skip(perpage * page)


    let totalrecentData = await recentpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();

    return res.render('view_recent', {
        RData: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalrecentData / perpage),
        currentpage: page,
    });
}


module.exports.activedata = async (req, res) => {
    if (req.params.id) {
        let data = await recentpanel.findByIdAndUpdate(req.params.id, {
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
        let data = await recentpanel.findByIdAndUpdate(req.params.id, {
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


module.exports.updaterecent = async (req, res) => {
    let record = await recentpanel.findById(req.params.id);
    let adminRecord = req.user;
    return res.render("updaterecent", {
        Updaterecent: record,
        admin: adminRecord,
    });
};


module.exports.Editrecent = async (req, res) => {
    let oldData = await recentpanel.findById(req.body.EditId);
    req.body.isActive = true;
    req.body.Updated_date = new Date().toLocaleString();
    // console.log(oldData);
    if (req.file) {
        if (oldData.RecentImage) {
            let fullpath = path.join(__dirname, ".." + oldData.RecentImage);
            await fs.unlinkSync(fullpath);
        }
        let imagePath = " ";
        imagePath = recentpanel.recentModelPath + "/" + req.file.filename;
        req.body.RecentImage = imagePath;
    } else {
        req.body.RecentImage = imagePath;
    }
    await recentpanel.findByIdAndUpdate(req.body.EditId, req.body);
    return res.redirect("/admin/recent/view_recent");
};


module.exports.deleterecent = async (req, res) => {
    try {
        let olddata = await recentpanel.findById(req.params.id);
        if (olddata) {
            let oldImage = olddata.RecentImage;
            if (oldImage) {
                let fullpath = path.join(__dirname, ".." + olddata.RecentImage);
                let dImage = await fs.unlinkSync(fullpath);
                let deleteRecord = await recentpanel.findByIdAndDelete(req.params.id);
                if (deleteRecord) {
                    console.log("Record and image delets successfully");
                    return res.redirect("back");
                } else {
                    console.log("Record delete successfully");
                    return res.redirect("back");
                }
            }
            else {
                let deleteRecord = await recentpanel.findByIdAndDelete(req.params.id);
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
    await recentpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
}
