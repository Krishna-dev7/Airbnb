const Listing = require("../models/listing");

module.exports
    .index = async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
    };


module.exports
    .renderNewForm = (req, res) => {
        res.render("listings/new.ejs");
    };


module.exports
    .postListing = async (req, res) => {
        let listing = req.body.listing;
        listing.owner = req.user._id;
        listing.image = req.files.map(file => {
            return {url: file.path, filename: file.filename};
        });
        console.log(listing);
        const doc = new Listing(listing);
        await doc.save();
        req.flash("success", "listing added successfully");
        res.redirect("/listings");  
    }

module.exports
    .show = async (req, res) => {
        let {id} = req.params;
        const data = await Listing.findById(id)
            .populate("owner")
            .populate({
                path: "review",
                populate: {
                    path: "createdBy",
                    model: "User",
                },
             });
             
        if(data) {
            res.render("listings/show.ejs", {data}) ;
        } else {
            console.log("data not found");
        }
    }


module.exports
    .renderEditForm = async (req, res) => {
        let {id} = req.params;
        const data = await Listing.findById(id);
        res.render("listings/edit.ejs", {data});
    }


module.exports
    .edit = async (req, res) => {
        let {id} = req.params;
        let updateListing = req.body.listing;
        await Listing.findByIdAndUpdate(id, updateListing,
            {new: true, runValidators: true} );
        req.flash("success", "listing updated successfully");
        res.redirect(`/listings/${id}`);
    }


module.exports
    .destroy = async (req, res) => {
        let {id} = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("error", "listing deleted successfully");
        res.redirect("/listings");
    }