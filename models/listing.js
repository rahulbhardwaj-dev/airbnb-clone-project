const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const Review = require("./review");
const User = require("./user")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
       url: String,
       filename: String
    },
    price: Number, 
    location: String,
    country: String
    ,
    review: [
        {
            type : Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
        },
        coordinates: {
        type: [Number],
        required: true
        }
  }
});

listingSchema.post("findOneAndDelete", async (listing) => { // jo delete req listing p ayegi, vo listing iss middleware m pass kri gyi h

    if(listing){
         await Review.deleteMany( { _id :  { $in: listing.review }  } ) // delete all reviews whose _id is in listing.review
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
