const Listing = require("./models/listing")
const Review = require("./models/review.js")
const { listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/expressError.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){

      // redirect save for post-login
      req.session.redirectUrl = req.originalUrl; // originalUrl automatically aayega req m , then usko store krvana h

    req.flash("error","You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
}

// because we can't access redirectURL directly in user.js, because after logging in passport will delete req.session

module.exports.saveRedirectUrl = (req,res,next) =>{
  // agar req.session ke andar koi redirectUrl save hua hai  (upr wali req se)
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next) => { // authorization for listings
  let {id} = req.params;
  let listing = await Listing.findById(id);

  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the Owner of this Listing");
    return res.redirect(`/listings/${id}`);
  } // checked if the person trying to edit the post is the real owner of this listing

  next();
}

module.exports.validateListing = (req,res,next) => {
  let {error} = listingSchema.validate(req.body); // checks if the listing is valid with the help of Joi.dev
  
  if(error){
    let valmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, valmsg)
  }else {
    next();
  }
}

module.exports.validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body); // checks if the listing is valid with the help of Joi.dev
  
  if(error){
    let valmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, valmsg)
  }else {
    next();
  }
}

module.exports.isAuthor = async (req,res,next) => { // authorization for listings
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);

  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You did not create this review!");
    return res.redirect(`/listings/${id}`);
  } // checked if the person trying to edit the post is the real owner of this listing

  next();
}
