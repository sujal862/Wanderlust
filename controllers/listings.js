const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    //populate the reviews and owner array with the actual review and owner objects //nested populate (populate the author field of the review object)
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();


    let url = req.file.path;
    let filename = req.file.filename;

    //let {title, description, price, image, country, location} = req.body; //no need to destructure like this already made object(listing) with keys in ejs
    const newListing = new Listing(req.body.listing); //req.body.listing -> return a object(listing) having name-value of form field in key value pair
    newListing.owner = req.user._id; //set the owner of the listing to the current logged in user
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry; // storing the location data in GeoJSON format coming from mapbox api
   await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) { //if listing does was deleted and the user tries to edit it by navigating throug url
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect('/listings');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload", "upload/w_250,h_250,c_fit"); // Resize the image
    res.render('listings/edit.ejs', { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });// deconstruct the object and spread it

    if (typeof req.file !== "undefined") { // if image was not updated then req.file will be undefined
        let url = req.file.path; 
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
};