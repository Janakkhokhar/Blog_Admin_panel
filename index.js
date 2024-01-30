let express = require("express");
let port = 8003;
let app = express();
let path = require("path");
let fs = require("fs");

let session = require('express-session');
let passport = require('passport');
let passportlocal = require('./cofig/passport-local-strategy');


  

let db = require("./cofig/mongoose");
let adminpanel = require("./models/adminpanel");
let sliderpanel = require("./models/sliderpanel");

app.use(session({
  name : "Rnw",
  secret : "Rnw",
  resave : false,
  saveUninitialized : false,
  cookie :{
    maxAge : 1000*60*100
  }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "user_assets")));

app.use("/admin", require("./routes/admin"));

app.use("/", require("./routes/user"));

app.listen(port, function (err) {
  if(err) {
  console.log("smething worng") }
  else{
    console.log("success runing code");
  }
});
