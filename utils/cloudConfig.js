const {v2: cloudinary} = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// use ot access our account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// it will loads the file extracted using multer on the cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
        allowedFormats: ["jpeg", "png", "jpg", "jfif"]
    }
})

module.exports = {
    cloudinary, 
    storage
}   