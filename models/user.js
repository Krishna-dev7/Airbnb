const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true
    }

}, {timestamps: true})

// username and password are by default injected
// or added by the passport local mongoose plugin

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;