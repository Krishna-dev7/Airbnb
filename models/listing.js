const mongoose = require("mongoose");
const Review = require("./review");

const imageSchema = mongoose.Schema({
    url: {
        type: String,
        default: "https://i.pinimg.com/564x/45/ce/3b/45ce3b42da8733ad8ff8e5aa4f941913.jpg",
        set: (v) => v==="" ? 
            "https://i.pinimg.com/564x/45/ce/3b/45ce3b42da8733ad8ff8e5aa4f941913.jpg" : v,  
        trim: true,     
    },
    filename: String
});


const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    description: String,
    image: [
        imageSchema
    ], 
    price: {
        type: Number, 
        default: 0,
        min: [0, "You cannot set your price below 0"],
        required: true
    },
    location: String,
    country: String,
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});


listingSchema.post("findOneAndDelete", async (listing) => {
    await Review.deleteMany({_id: {$in: listing.review}});
    console.log("review of a listing has been deleted");
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;