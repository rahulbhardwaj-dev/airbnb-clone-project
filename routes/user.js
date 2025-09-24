const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/expressError.js");
const User = require("../models/user.js");
const ExpressError = require("../utils/expressError.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/users.js")

router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl , 
    passport.authenticate("local",{ failureRedirect: "/login",failureFlash: true }), //verifying using passport.authenticate
    userController.login
); //saveRedirectUrl , isko pass krna h so that it can save the value of old path to res.locals


router.get("/logout", userController.logout)

module.exports = router;
