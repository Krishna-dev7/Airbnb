const express = require("express");
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isAuthenticated, saveUrl } = require("../middleware");
const userController = require("../controllers/user");


router.get("/signup", 
    userController.renderSignupForm
)

router.post("/signup", 
    wrapAsync(userController.signup )
)


// get login form
router.get("/login",
    userController.renderLoginForm    
)


// autheticate login credentials
router.post(
    "/login", 
    saveUrl,
    passport.authenticate(
        "local", 
        {failureRedirect: "/login", failureFlash: true}),
    wrapAsync(userController.login )
)


// logout route
router.get("/logout",
    isAuthenticated,
    userController.logout
)

module.exports = router;