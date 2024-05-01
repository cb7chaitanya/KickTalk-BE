const mongoose = require('mongoose')
const {DB_URL} = require('../config')
const {Community} = require('./communityDB')

mongoose.connect(DB_URL)

const postSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    votes: {
        downvotes: {
            type: Number,
            default: 0
        },
        upvotes: {
            type: Number,
            default: 0
        }
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    tags: {
        type: [String],
        required: true
    },
    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String,
                required: true
            },
            votes: {
                downvotes: {
                    type: Number,
                    default: 0
                },
                upvotes: {
                    type: Number,
                    default: 0
                }
            }
        }
    ]
})

const Post = mongoose.model('Post', postSchema)

module.exports = {
    Post
}