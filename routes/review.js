const express = require("express");
const router = express.Router({mergeParams:true}); // we pass option mergeparams to preserve req.params from parent route
// to jaise dynamic route h, basically an id exists in this case, to hme merge krna pdega, ta ki vo id yha bhi access ho jaye, aur req shi jgah jaye
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isOwner, isAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js")

router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview))

router.delete("/:reviewId",isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;

