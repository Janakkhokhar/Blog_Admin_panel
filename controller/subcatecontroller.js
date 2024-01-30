let subcatepanel = require('../models/subcatepanel');
let categorypanel = require('../models/categorypanel');

let fs = require('fs');
let path = require('path');


module.exports.add_subcategory = async (req, res) => {
    let catData = await categorypanel.find({});
    return res.render('add_subcategory', {
        catRecord: catData,
    });
}
    
module.exports.insertsubcateData = async (req, res) => {
    try {
        let imagePath = " "
        if (req.file) {
            imagePath = subcatepanel.SubcateModelPath + '/' + req.file.filename;
        }
        else {
            console.log("Image Not Found");
        }
        if (req.body) {
            req.body.subcateImage = imagePath;
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await subcatepanel.create(req.body);
        }
        else {
            console.log("Data Not Found");
        }
    }
    catch (error) {
        console.log(error);
    }
    return res.redirect('back');
};


module.exports.view_subcate = async (req, res) => {

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


    let data = await subcatepanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    })

        .limit(perpage)
        .skip(perpage * page).populate('subcate').exec()


    let totalsubcateData = await subcatepanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();


    return res.render("view_subcate", {
        subcateData: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalsubcateData / perpage),
        currentpage: page,
    });
};

// Active and DeActive

module.exports.activedata = async (req, res) => {
    if (req.params.id) {
        let data = await subcatepanel.findByIdAndUpdate(req.params.id, {
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
        let data = await subcatepanel.findByIdAndUpdate(req.params.id, {
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
//end

//multipal Delete

module.exports.DeleteAllRecord = async (req, res) => {
    // console.log(req.body);
    await subcatepanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
};

//end

module.exports.updatesubcate = async (req, res) => {
    let catData = await categorypanel.find({});
    let record = await subcatepanel.findById(req.params.id).populate('subcate').exec();
    let adminRecord = req.user;
    return res.render("updatesubcate", {
        Updatesubcate: record,
        admin: adminRecord,
        catData: catData
    });
}

module.exports.SubCateEdit = async (req, res) => {
    let oldData = await subcatepanel.findById(req.body.EditId);
    req.body.isActive = true;
    req.body.Updated_date = new Date().toLocaleString();
    // console.log(oldData);
    if (req.file) {
        if (oldData.subcateImage) {
            let fullpath = path.join(__dirname, ".." + oldData.subcateImage);
            await fs.unlinkSync(fullpath);
        }
        let imagePath = " ";
        imagePath = subcatepanel.SubcateModelPath + "/" + req.fil.filename;
        req.body.subcateImage = imagePath;
    } else {
        req.body.subcateImage = imagePath;
    }
    await subcatepanel.findByIdAndUpdate(req.body.EditId, req.body);
    return res.redirect("/admin/view_subcate");
}


module.exports.delelerecord = async (req, res) => {
    try {
        let olddata = await subcatepanel.findById(req.params.id);
        if (olddata) {
            let oldImage = olddata.subcateImage;
            if (oldImage) {
                let fullpath = path.join(__dirname, ".." + olddata.subcateImage);
                let dImage = await fs.unlinkSync(fullpath);
                let deleteRecord = await subcatepanel.findByIdAndDelete(req.params.id);
                if (deleteRecord) {
                    console.log("Record and image delets successfully");
                    return res.redirect("back");
                } else {
                    console.log("Record delete successfully");
                    return res.redirect("back");
                }
            } else {
                let deleteRecord = await subcatepanel.findByIdAndDelete(req.params.id);
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