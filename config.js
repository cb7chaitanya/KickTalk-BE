require('dotenv').config()

module.exports = {
    DB_URL : process.env.MONGO_URL,
    JWT_SECRET : process.env.JWT_SECRET,
    CLOUD__NAME : process.env.CLOUD_NAME,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET
}