const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req,res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  newReview.author = req.user._id; // author of owner

  listing.review.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success","Review Added!")

  res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req,res) => {

  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull : {review: reviewId}}); // $pull is used to remove the review from listing in database
  //passed (id in upper query) for listing, then used pull , to search in review and delete the reviewId things
  await Review.findByIdAndDelete(reviewId)
  req.flash("success","Review Deleted!")
  res.redirect(`/listings/${id}`);
}
