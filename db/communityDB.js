const {DB_URL} = require('../config')
const mongoose = require('mongoose')

mongoose.connect(DB_URL)

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    moderators: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post'
    },
    subscribers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    Count: {
        subscribers: {
            type: Number,
            default: 0
        },
        posts: {
            type: Number,
            default: 0
        }
    },
    Banner: {
        exists: {
            type: Boolean,
            default: false
        },
        url: {
            type: String,
            default: 'null'
        }
    }
})

const Community = mongoose.model('Community', communitySchema)

module.exports = { 
    Community
}