let sliderpanel = require('../models/sliderpanel');
let offerpanel = require('../models/offerpanel');
let recentpanel = require('../models/recentpanel');
let postpanel = require('../models/postpanel');
let commentpanel = require('../models/commentpanel');
let categorypanel = require('../models/categorypanel');
let subcatepanel = require('../models/subcatepanel');
let reviewpanel = require('../models/reviewpanel');
let contactpanel = require('../models/contact');

let nodemailer = require('nodemailer');


module.exports.home = async (req, res) => {
    try {
        let sliderdata = await sliderpanel.find({});
        let offerdata = await offerpanel.find({});
        let recentdata = await recentpanel.find({});
        let postdata = await postpanel.find({ isActive: true });

        return res.render("userpanel/home", {
            sliderview: sliderdata,
            offerview: offerdata,
            recentview: recentdata,
            postview: postdata,

        });
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};



module.exports.blog_single = async (req, res) => {
    let blogId = req.params.id;
    let data = await postpanel.findById({ _id: blogId });
    let cdata = await commentpanel.find({ postId: blogId, isActive: true });
    let cc = cdata.length;

    let allpostdata = await postpanel.find({});
    var ids = [];
    allpostdata.map((v, i) => {
        ids.push(v.id)
    })
    var next;
    for (var i = 0; i < ids.length; i++) {
        if (ids[i] === req.params.id) {
            next = i;
            break;
        }
    }

    let recentpost = await postpanel.find({}).sort({ "_id": -1 }).limit(3);

    return res.render('userpanel/blog_single', {
        PostId: data,
        comm: cdata,
        cc: cc,
        allids: ids,
        cp: next,
        recentpost: recentpost
    });
}


module.exports.addComment = async (req, res) => {
    try {
        let imagePath = ' ';
        if (req.file) {
            imagePath = commentpanel.commentModelPath + '/' + req.file.filename;
        }
        else {
            console.log("Image Not Found");
        }
        if (req.body) {
            req.body.commentImage = imagePath;
            req.body.isActive = false;
            req.body.Created_date = new Date().toLocaleString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await commentpanel.create(req.body);
        }
        else {
            console.log("Data Not Found");
        }
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back');
}


module.exports.work_three = async (req, res) => {
    let catData = await categorypanel.find({});
    let subcat = await subcatepanel.find({});
    // console.log(subcat);
    return res.render('userpanel/work_three', {
        'catData': catData,
        'subcat': subcat,
    });
};

module.exports.contact = async (req, res) => {
    return res.render('userpanel/contact');
}


module.exports.InsertContactData = async (req, res) => {
    // console.log(req.body);
    try {

        if (req.body) {
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleDateString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await contactpanel.create(req.body);
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "janakkhokhar28@gmail.com",
                    pass: "cidolattvfmllyds",
                },
            });
            const info = await transporter.sendMail({
                from: "janakkhokhar28@gmail.com",
                to: req.body.email,
                subject: "Connect with YOM",
                html: `description=${description}`,

            });
            console.log("Message Sent");
            return res.redirect("back");
        } else {
            console.log("Data not found");
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};