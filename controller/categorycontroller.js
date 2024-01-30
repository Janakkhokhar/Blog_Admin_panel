let categorypanel = require('../models/categorypanel');


module.exports.add_category = (req, res) => {
    return res.render('add_category');
}

module.exports.insertcategoryData = async (req, res) => {
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await categorypanel.create(req.body);
        }
        else {
            console.log("Data Not Found");
        }
    } catch (error) {   
        console.log(error);
    }
    return res.redirect('back');
}


module.exports.view_category = async (req, res) => {
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


    let data = await categorypanel.find({
        $or: [
            { "category": { $regex: ".*" + search + ".*" } },
        ]
    })
        .limit(perpage)
        .skip(perpage * page);

    let totalcategoryData = await categorypanel.find({
        $or: [
            { "category": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();


    return res.render("view_category", {
        cateData: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalcategoryData / perpage),
        currentpage: page,
    });
};

// Active and DeActive

module.exports.activedata = async (req, res) => {
    if (req.params.id) {
        let data = await categorypanel.findByIdAndUpdate(req.params.id, {
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
        let data = await categorypanel.findByIdAndUpdate(req.params.id, {
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


module.exports.updatacategory = async (req, res) => {
    let record = await categorypanel.findById(req.params.id);
    let adminRecord = req.user;
    return res.render("updatacategory", {
        Updatecategory: record,
        admin: adminRecord,
    });
};

module.exports.CategoryEdit = async (req, res) => {
    let oldData = await categorypanel.findById(req.body.EditId);
    req.body.isActive = true;
    req.body.Updated_date = new Date().toLocaleString();
    await categorypanel.findByIdAndUpdate(req.body.EditId, req.body);
    return res.redirect("/admin/view_category");
};


module.exports.deleterecord = async (req, res) => {
    try {
        let deleteRecord = await categorypanel.findByIdAndDelete(req.params.id);
        if (deleteRecord) {
            console.log("Record and image delets successfully");
            return res.redirect("back");
        } else {
            console.log("Record delete successfully");
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
    await categorypanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
};


