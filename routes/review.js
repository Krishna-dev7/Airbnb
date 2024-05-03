const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const validateReview = require("../utils/reviewValidation");
const Review = require("../models/review");
const { isAuthenticated, isOwner, isCreatedBy } = require("../middleware");
const reviewController = require("../controllers/review")


// Review route
router.post("/",
    isAuthenticated,
     validateReview,
     wrapAsync(reviewController.postReview)
);

// deleting reviews
router.delete("/:reviewid",
    isCreatedBy,
    isAuthenticated,
     wrapAsync(reviewController.destroyReview )
) 

module.exports = router;