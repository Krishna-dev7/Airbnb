const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const validateListing = require("../utils/schemaValidation");
const { isAuthenticated, isOwner } = require("../middleware");
const listingController = require("../controllers/listing");
const multer = require("multer");
const {storage, cloudinary} = require("../utils/cloudConfig");
const upload = multer({
    storage,
    limits: {fileSize: 10 * 1024 * 1024}
});


// for index route
router.route("/")
    .get(
        wrapAsync(listingController.index))
    .post(
        isAuthenticated,
        upload.array("listing[image]") ,
        validateListing, 
        listingController.postListing
        // wrapAsync(listingController.postListing)
    );


// New listing route                    
router.get("/new",
    isAuthenticated,
    listingController.renderNewForm
);

        
router.route("/:id")
    .get(
        wrapAsync(listingController.show))
    .put(
        isOwner,
        isAuthenticated,
        validateListing,
        wrapAsync(listingController.edit))
    .delete(
        isOwner,
        isAuthenticated,
        wrapAsync(listingController.destroy)
    );
                    

// edit and update route
// this code has type error issue 
router.get("/:id/edit",
    isAuthenticated,
    isOwner,
     wrapAsync(listingController.renderEditForm)
);


module.exports = router;