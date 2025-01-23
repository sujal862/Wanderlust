const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema, reviewSchema} = require('./schema.js')

module.exports.isLoggedIn = (req, res, next) => {
    req.session.redirectUrl = req.originalUrl; //redirectUrl(key) : req.originalUrl(value) i.e req object has multiple methods in which req.originalUrl is one which gives the original url(path) of the request ( signup ka bad isi url pe redirect kradega jha pa bnda tha )
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to create a new listing!");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if( req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the Owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//server side validation of the listing data - joi
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body); //validate the data using joi
    if(error){
        let errorMsg = error.details.map((e) => e.message).join(","); //extract the error message and join from the error object
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
}

//server side validation of the review data - joi
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body); //validate the data using joi
    if(error){
        let errorMsg = error.details.map((e) => e.message).join(","); //extract the error message and join from the error object
        throw new ExpressError(400, errorMsg);
    } else {    
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
