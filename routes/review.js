const express = require('express');
const router = express.Router( {mergeParams : true}); //merge parent route params and child route params so that we can access id from parent route in child route (see router.post)
const Listing = require('../models/listing.js');
const Review = require('../models/review.js')
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require('../controllers/review.js');

// Create Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;