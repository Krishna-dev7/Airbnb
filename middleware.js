const Listing = require("./models/listing");
const Review = require("./models/review");
const wrapAsync = require("./utils/wrapAsync");

module.exports
    .isAuthenticated = (req, res, next) => {
        if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "please login access other features");
            return res.redirect("/login");
        }
        next();
    }

    
module.exports
    .saveUrl = (req, res, next) => {
        res.locals.redirectUrl = req.session.redirectUrl;
        next();
    }


module.exports
    .isOwner = wrapAsync( async (req, res, next) => {
        let {id} = req.params;
        let listing = await Listing.findById(id).populate("owner");
        console.log(req.user, listing.owner);
        if(req.user && (!req.user._id.equals(listing.owner._id ))) {
            req.flash("error", `you don't have priviliges to ${req.method}`);
            return res.redirect(`/listings/${id}`);
        }   
        next();
    })


module.exports
    .isCreatedBy = wrapAsync( async (req, res, next) => {
        let {reviewid: reviewId } = req.params;
        let review = await Review.findById(reviewId).populate("createdBy");
        if(res.locals.currUser && (review.createdBy._id.equals(res.locals.currUser._id))){
            next();
        }
        req.flash("error", "you can not delete this review");
        return res.redirect("/listings/")
    })