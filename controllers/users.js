const User = require("../models/user.js");

module.exports.renderSignupForm =  (req,res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res) => {
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username})

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => { // login after signup
            if(err) {
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }
    catch(error){
        req.flash("error",error.message);
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req,res) => {
    req.flash("success","Welcome Back To Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // agar listing undefined h
    res.redirect(redirectUrl);  // then saveRedirectUrl mei se, res.locals.redirectUrl, isko use kr payenge
    // it will take to the same page where we tried to perform action before logging in 
  }

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err) { // agar logout krte waqt koi error aa gya
           return next(err); // error handling middleware ko call kr denge
        }
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    }) // ye callback ko input leta h as a parameter
}
  