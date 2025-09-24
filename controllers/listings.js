const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => { //Show all listings
  let alllistings = await Listing.find({});
  res.render("listings/index.ejs", {alllistings});
}

module.exports.renderNewForm = (req,res) => { //Adding New Post
  res.render("listings/new.ejs");
}

module.exports.showlisting = async (req,res) => { // Checking of post by ID
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({path : "review", populate : {path: "author"}})// nested populate in review
  .populate("owner"); 


  if(!listing){
    req.flash("error","Listing you requested for doesn't exist!");
    res.redirect("/listings")
  }
  res.render("listings/show.ejs", {listing})
}

module.exports.createListing = async (req,res) => { //new listing add route

  //Getting Coordinates from location entered by website user
  let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
  })
  .send();


  let url = req.file.path;
  let filename = req.file.filename;

  const  newlisting =  new Listing(req.body.listing); // another way of getting data from req.body, we have to add name as varname[name of input or values],then can access with req.body.varname
  newlisting.owner = req.user._id; //current user ki id
  newlisting.image = {url,filename}; // image ka link and file name, cloudinary ki space se 

  newlisting.geometry = response.body.features[0].geometry;//Storing Coordinates
  
  await newlisting.save();

  req.flash("success","New listing created!")
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res) => { // form for editing post
  let {id} = req.params;
  const listing = await Listing.findById(id);

  if(!listing){
    req.flash("error","Listing you are trying to edit doesn't exist!");
    res.redirect("/listings")
  }

  // image preview in edit form
  let originalImageUrl = listing.image.url; // Our original image
  originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updatelisting = async (req,res) => { // updated by finding id and updating
  
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); // deconstructing req.body


  if(typeof req.file !== "undefined"){ // if uploaded then save
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = {url,filename};
    await listing.save();
  }

  req.flash("success","Listing Details Updated!")
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!")
  res.redirect("/listings");
}
