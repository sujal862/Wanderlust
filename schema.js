//Server side error handling = This file contains the schema for the listing object. It is used to validate the listing object before it is added to the database.
const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing : joi.object({ // indicates that listing should be an object and is required
        title : joi.string().required(),  // tells that title ek string hona chahiye and required honi chiya
        description : joi.string().required(),
        location : joi.string().required(),
        country: joi.string().required(),
        price : joi.number().required().min(0), //min 0 price honi chahiye
        image : joi.string().allow("", null), //image can be empty or null
    }).required(),
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating : joi.number().required().min(1).max(5),
        comment : joi.string().required(),
    }).required(),
});