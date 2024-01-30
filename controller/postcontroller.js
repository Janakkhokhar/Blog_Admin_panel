const postpanel = require("../models/postpanel");

let path = require('path');

let fs = require('fs');

module.exports.add_post = async (req, res) => {
    return res.render('add_post');
}

module.exports.insertpostData = async (req, res) => {
    try {
        let imagePath = " "
        if (req.file) {
            imagePath = postpanel.postModelPath + '/' + req.file.filename;
        }
        else {
            console.log("Image Not Found");
        }
        if (req.body) {
            req.body.postImage = imagePath;
            req.body.name = req.user.name;
            req.body.isActive = true;       
            req.body.Created_date = new Date().toLocaleString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await postpanel.create(req.body);
        }
        else {
            console.log("Data Not Found");
        }
    }
    catch {
        console.log("something worng");

    }
    return res.redirect('back');
}


module.exports.view_post = async (req, res) => {
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


    let data = await postpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    })

        .limit(perpage)
        .skip(perpage * page)


    let totalpostData = await postpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();

    return res.render('view_post', {
        postData: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalpostData / perpage),
        currentpage: page,
    });
}


module.exports.activedata = async (req, res) => {
    if (req.params.id) {
        let data = await postpanel.findByIdAndUpdate(req.params.id, {
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
        let data = await postpanel.findByIdAndUpdate(req.params.id, {
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

module.exports.updatepost = async (req, res) => {
    let record = await postpanel.findById(req.params.id);
    let adminRecord = req.user;
    return res.render("updatepost", {
        Updatepost: record,
        admin: adminRecord,
    });
};


module.exports.Editpost = async (req, res) => {
    let oldData = await postpanel.findById(req.body.EditId);
    req.body.isActive = true;
    req.body.Updated_date = new Date().toLocaleString();
    // console.log(oldData);
    if (req.file) {
        if (oldData.postImage) {
            let fullpath = path.join(__dirname, ".." + oldData.postImage);
            await fs.unlinkSync(fullpath);
        }
        let imagePath = " ";
        imagePath = postpanel.postModelPath + "/" + req.file.filename;
        req.body.postImage = imagePath;
    } else {
        req.body.postImage = imagePath;
    }
    await postpanel.findByIdAndUpdate(req.body.EditId, req.body);
    return res.redirect("/admin/post/view_post");
};


module.exports.deletepost = async (req, res) => {
    try {
        let olddata = await postpanel.findById(req.params.id);
        if (olddata) {
            let oldImage = olddata.postImage;
            if (oldImage) {
                let fullpath = path.join(__dirname, ".." + olddata.postImage);
                let dImage = await fs.unlinkSync(fullpath);
                let deleteRecord = await postpanel.findByIdAndDelete(req.params.id);
                if (deleteRecord) {
                    console.log("Record and image delets successfully");
                    return res.redirect("back");
                } else {
                    console.log("Record delete successfully");
                    return res.redirect("back");
                }
            }
            else {
                let deleteRecord = await postpanel.findByIdAndDelete(req.params.id);
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
    await postpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
}
// End
