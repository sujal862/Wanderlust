const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors');
const morgan = require('morgan');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const dotenv = require('dotenv')

if( process.env.NODE_ENV != 'production'){
    dotenv.config();
}

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

let port = 8080;
let dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() => console.log('MongoDB Connected. . .'.green.bgMagenta))
.catch(err => console.log(err.red));


app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log("Mongo Session Store Error", err);
})

const sessionOptions = {
    store: store,  //store the session data in the mongoDB
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //expires in 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, //max age of the cookie
        httpOnly: true, 
    }
}


app.use(session(sessionOptions));
app.use(flash());

//Passport Configuration
app.use(passport.initialize()); //A middleware to initialize passport for every request
app.use(passport.session()); // A web application needs the ability to identify users as they browse from page to anotherpage. This series of requests and responses, each associated with the same user, is known as a session. (so basically ak user ko bs ak hi bar login krna pada while navigating to diff pages in single session)
passport.use(new LocalStrategy(User.authenticate())); //LocalStrategy is used to authenticate the User(model) using the username and password (there 500+ strategies available in passport)

passport.serializeUser(User.serializeUser()); //serializeUser is used to store the user id(signifying user info) in the session
passport.deserializeUser(User.deserializeUser()); //deserializeUser is used to get the user id from the session and than get the user object ->passport.deserializeUser: This function is used by Passport to convert the user ID stored in the session back into a user object. It is called whenever a request is made after a user has logged in. & User.deserializeUser(): This is a method defined in the User model that specifies how to find a user in the database using the user ID. It typically involves querying the database to retrieve the user's details.

//middleware to store the flash messages in the res.locals so that they can be accessed in the ejs files
app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // value(message) stored in the key(success) will be stored in success variable
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //req.user is set to user data in form of object by passport if the user is logged in
    next();
})


app.get('/',(req,res)=>{
    res.redirect('/listings');
})

//Express Router
app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);


app.all("*", (req, res, next) => { // if no above route matches with the route requested by the user then this middleware will run
    next(new ExpressError(404, "Page Not Found"));
});

//Error Handling Middleware
app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "Something went Wrong"} = err; //decosntructing the error object
    console.log(err);
    res.status(statusCode).render('error.ejs', {err});
})

app.listen(port,()=>{
    console.log(`Server is running on` ,`http://localhost:${ port}`.blue);
})