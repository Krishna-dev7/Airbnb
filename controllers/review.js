const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports
    .postReview = async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.createdBy = req.user._id;
        listing.review.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "review added")
        res.redirect(`/listings/${req.params.id}`);
    }

module.exports
    .destroyReview = async (req, res) => {
        let {id, reviewid} = req.params;
        await Listing.findByIdAndUpdate(id, {$pull: {review: reviewid}});
        await Review.findByIdAndDelete(reviewid);
        // console.log("review deleted successfully");
        req.flash("error", "review removed");
        res.redirect(`/listings/${id}`);
    }