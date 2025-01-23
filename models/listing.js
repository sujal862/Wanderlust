const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image: {  // image is an object
        url: String,
        filename: String,
    },
    price : Number,
    location: String,
    country:String,
    reviews : [ // stores the id of all the review doc for a particular listing (1 * n relationship Approch 2) ex = [1,2,3]
        {
            type: Schema.Types.ObjectId, //stores id
            ref : "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry:  { // GeoJSON format for storing location data
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


//Mongoose middleware to delete listing reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing.reviews.length){
        await Review.deleteMany({ _id: { $in : listing.reviews } })
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; // model exported