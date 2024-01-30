let reviewpanel = require('../models/reviewpanel');

let path = require('path');

let fs = require('fs');

module.exports.add_review = async (req, res) => {
    return res.render('add_review');
}

module.exports.insertreviewData = async (req, res) => {
    try {
        let imagePath = "";
        if (req.file) {
            imagePath = reviewpanel.reviewModelPath + "/" + req.file.filename;
        }
        else {
            console.log("Image Not Found");
        }
        if (req.body) {
            req.body.reviewicon = imagePath;
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleString();
            req.body.Updated_date = new Date().toLocaleString();
            await reviewpanel.create(req.body);
        }
        else {
            console.log("Data not found");
        }
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back');
};


module.exports.view_review = async (req, res) => {
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


    let data = await reviewpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    })

        .limit(perpage)
        .skip(perpage * page)


    let totalreviewData = await reviewpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();

    return res.render('view_review', {
        redData: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalreviewData / perpage),
        currentpage: page,
    });
}


module.exports.activedata = async (req, res) => {
    if (req.params.id) {
        let data = await reviewpanel.findByIdAndUpdate(req.params.id, {
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
        let data = await reviewpanel.findByIdAndUpdate(req.params.id, {
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


module.exports.updatereview = async (req, res) => {
    let record = await reviewpanel.findById(req.params.id);
    let adminRecord = req.user;
    return res.render("updatereview", {
        Updatereview: record,
        admin: adminRecord,
    });
};


module.exports.Editreview = async (req, res) => {
    let oldData = await reviewpanel.findById(req.body.EditId);
    req.body.isActive = true;
    req.body.Updated_date = new Date().toLocaleString();
    // console.log(oldData);
    if (req.file) {
        if (oldData.reviewicon) {
            let fullpath = path.join(__dirname, ".." + oldData.reviewicon);
            await fs.unlinkSync(fullpath);
        }
        let imagePath = " ";
        imagePath = reviewpanel.reviewModelPath + "/" + req.file.filename;
        req.body.reviewicon = imagePath;
    } else {
        req.body.reviewicon = imagePath;
    }
    await reviewpanel.findByIdAndUpdate(req.body.EditId, req.body);
    return res.redirect("/admin/review/view_review");
};


module.exports.deletereview = async (req, res) => {
    try {
        let olddata = await reviewpanel.findById(req.params.id);
        if (olddata) {
            let oldImage = olddata.reviewicon;
            if (oldImage) {
                let fullpath = path.join(__dirname, ".." + olddata.reviewicon);
                let dImage = await fs.unlinkSync(fullpath);
                let deleteRecord = await reviewpanel.findByIdAndDelete(req.params.id);
                if (deleteRecord) {
                    console.log("Record and image delets successfully");
                    return res.redirect("back");
                } else {
                    console.log("Record delete successfully");
                    return res.redirect("back");
                }
            }
            else {
                let deleteRecord = await reviewpanel.findByIdAndDelete(req.params.id);
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
    await reviewpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
}
// End

