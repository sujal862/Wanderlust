const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/user.js")


router.route('/signup')
    .get(userController.renderSignUpForm)
    .post(userController.signUp);

router.route('/login')
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), // Checks if a user is properly logged in or has entered the right credentials before granting them access to certain parts of the application.
        userController.login);


router.get("/logout", userController.logout);

module.exports = router;