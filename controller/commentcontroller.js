let commentpanel = require('../models/commentpanel');


module.exports.view_comment = async (req, res) => {
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


    let data = await commentpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    })

        .limit(perpage)
        .skip(perpage * page).populate('subcate').exec()


    let totalcommentData = await commentpanel.find({
        $or: [
            { "title": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();


    let comDetails = await commentpanel.find({})
    return res.render('view_comment', {
        commentData: comDetails,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalcommentData / perpage),
        currentpage: page,
    })
}

// Active and DeActive

module.exports.activedata = async (req, res) => {
    if (req.params.id) {
        let data = await commentpanel.findByIdAndUpdate(req.params.id, {
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
        let data = await commentpanel.findByIdAndUpdate(req.params.id, {
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
    await commentpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
};