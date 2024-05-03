// loads environmental variables only when it is in development phase 
if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("node:path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const port = 3000;
const CustomError = require("./utils/CustomError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");  
const userRouter = require("./routes/user");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const User = require("./models/user");

// creating mongo store
const store = MongoStore.create({
    mongoUrl: process.env.MONGODB_ATLAS_URL,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SESSION_SECRET_KEY
    }
})


// configuring the sessions with session options
const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge: (7 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
};
// validate Schema is our function thats validate 
// the data before inserting into mongodb

async function connectDB(){
    try {
        const connectionInstance = await mongoose
            .connect(process.env.MONGODB_ATLAS_URL);
        console.log("Mongodb connected at host : ", connectionInstance.connection.host);
        app.listen(port, () => {
            console.log("server is listening: " +  port);
        })

    } catch(err) {
        console.log("Mongodb Connection error 😔", err);
        process.exit(1);
    }
}

connectDB();



// console.log(typeof app);
// app is our function not an object

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// ejsMate is a function and passed as callback

// express session is the middleware that is used to create a session
// by modifiying the requset object
app.use(session(sessionOptions));
app.use(cookieParser(sessionOptions.secret));
app.use(flash());

// configuring passport 
app.use(passport.initialize());
app.use(passport.session());
// passport.use is used to configure strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// remember one point always use flash before routes


// locals property of response boject
app.use((req, res, next) => {
    res.locals.message = req.flash("success") 
    res.locals.error = req.flash("error");
    res.locals.isLoggedIn = req.user? true:false;
    res.locals.currUser = req.user;
    next();
})


// routing
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);



// handling route not exist issue
// and all is not a part of middleware function
app.all("*", (req, res, next) => {
    next(new CustomError(404, "page not found"));
})

// custom error handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    console.log(err.name);
})