const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

module.exports.createReview = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);                                 
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id; //store the id of author who posted the review
    listing.reviews.push(newReview); //push the review object in the reviews array of the listing
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //pull(delete) the reviewId from the reviews array of the listing i.e delete the element(id) from the reviews array which matches with reviewId
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};