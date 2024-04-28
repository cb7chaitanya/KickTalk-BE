const mongoose = require('mongoose')
const {DB_URL} = require('../config')

mongoose.connect(DB_URL)

const voteSchema = new mongoose.Schema({
    downvotes: {
        type: Number,
        default: 0
    },
    upvotes: {
        type: Number,
        default: 0
    }
})  

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
    votes: voteSchema,
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
            votes: voteSchema
        }
    ]
})

const Post = mongoose.model('Post', postSchema)

module.exports = {
    Post
}