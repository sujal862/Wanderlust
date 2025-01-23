const express = require('express');
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");;
const router = express.Router();
const flash = require('connect-flash');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage }); // save the image in cloudinary "storage"

// router.route = is a shortcut to define multiple http req for a single router path
router.route("/")
    //Index Route
    .get(wrapAsync(listingController.index))
    //Create Route
    .post(isLoggedIn,  upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));


//New Route 
router.get('/new', isLoggedIn, listingController.renderNewForm) 


router.route('/:id')
    //Update Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    //Show Route
    .get(wrapAsync(listingController.showListing))
    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;