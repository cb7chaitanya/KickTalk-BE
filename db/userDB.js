const mongoose = require('mongoose')
const {DB_URL} = require('../config')


mongoose.connect(DB_URL)

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        unique: true,
        required: true,
        minLength: 5,
        maxLength: 25
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,   
        required: true,
        minLength: 6
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    profile: {
        bio : {
            type: String,
            maxLength: 150
        },
        socialLinks : {
            Twitter: String,
            Instagram:  String
        },
        avatar: {
            exists: {
                type: Boolean,
                default: 'false'
            },
            url: {
                type: String,
                default: 'null'
            }
        }
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}