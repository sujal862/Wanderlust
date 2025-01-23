const User = require('../models/user');

module.exports.renderSignUpForm = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signUp = async (req, res) => {
    try{
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => { //req.login is a passport method which logs in the user, it takes the user object as an argument and a callback function
        if (err){
            return next(err);
        }
        req.flash("success", "Welcome to wonderlust!");
        res.redirect("/listings");
    })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings"); //req.local will get reset after the response is send
};

module.exports.logout = (req, res) => {
    req.logout((err)=>{ // if logout is unsuccessful then err will be passed to next middleware
        if(err){
            return next(err);
        }
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
    });
};