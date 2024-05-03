const User = require("../models/user");

module.exports  
    .renderSignupForm = (req, res) => {
        res.render("users/form.ejs");
    };


module.exports
    .signup = async (req, res) => {
        try {
    
            let {username, email, password} = req.body;
            let newUser = new User({
                username, email
            });
            let data = await User.register(newUser, password);
            console.log(data);
            req.login(data, (err) => {
                if(err) {
                    return next(err);
                }
                req.flash("success", "registered successfully");
                res.redirect("/listings");
            })     // if any error occured the it will handles in catch block
    
        } catch(err) {
            req.flash("error", err.message);
            res.redirect("/signup");
        }
        
    };


module.exports 
    .renderLoginForm =  (req, res) => {
        res.render("users/login.ejs");
    };


module.exports
    .login = async (req, res) => {
        req.flash("success", "welcome back to wanderlust");
        res.redirect(res.locals.redirectUrl || "/listings");
    };


module.exports 
    .logout = (req, res, next) => {
        req.logOut((err) => {
            if(err) {
               return next(err);
            }
            req.flash("success", "you logged out the session");
            res.redirect("/listings");
        })
    };