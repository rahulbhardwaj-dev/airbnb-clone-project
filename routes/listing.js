const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingController =  require("../controllers/listings.js")
const multer = require("multer") // require for file upload in form

const {storage} = require("../cloudConfig.js")

const upload = multer({storage}) // initialize , dest means destionation/location, to yha direct bta skte h


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn , upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));
//upload process will be in our controllers

router.get("/new", isLoggedIn , listingController.renderNewForm) // upr likha otherwise router.route("/:id"); new ko search krega db m

router.route("/:id")
.get(wrapAsync(listingController.showlisting))
.put(isLoggedIn, isOwner, upload.single("listing[image]") , validateListing,  wrapAsync(listingController.updatelisting))
.delete(isLoggedIn ,isOwner,wrapAsync (listingController.deleteListing));


router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(listingController.renderEditForm))

module.exports = router;
