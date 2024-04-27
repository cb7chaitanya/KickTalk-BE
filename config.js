require('dotenv').config()

module.exports = {
    DB_URL : process.env.MONGO_URL,
    JWT_SECRET : process.env.JWT_SECRET
}