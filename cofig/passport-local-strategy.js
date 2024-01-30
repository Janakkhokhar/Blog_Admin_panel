let passport = require("passport");

let passportlocal = require("passport-local").Strategy;

let adminpanel = require("../models/adminpanel");

passport.use(new passportlocal({
  usernameField: "email",
}, async function (email, password, done) {
  let adminData = await adminpanel.findOne({ email: email });
  //   console.log(email,password);
  if (adminData) {
    if (password == adminData.password) {
      return done(null, adminData);
    } else {
      return done(null, false);
    }
  } else {
    return done(null, false);
  }
}
)
);

passport.serializeUser(async (admin, done) => {
  return done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
  let adminRecord = await adminpanel.findById(id);
  if (adminRecord) {
    return done(null, adminRecord);
  } else {
    return done(null, false);
  }
});

// data set

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  return next();
};

//end

// check data

passport.checkAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/admin/");
  }
};

//end

module.exports = passport;
