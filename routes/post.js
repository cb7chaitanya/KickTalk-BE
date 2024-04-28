const express = require('express')
const postRouter = express.Router()
const { authMiddleware } = require('../middleware/auth')
const { createPost, getAllPost, getYourPosts, getPostByTag, upvotePost, downvotePost } = require('../controllers/postControllers')

postRouter.use(express.json())
postRouter.use(authMiddleware)

postRouter.post('/create', createPost) //Create Post
postRouter.get('/all', getAllPost) //Get All Posts
postRouter.get('/own', getYourPosts) //Get your own posts
postRouter.get('/tag', getPostByTag) //Get Posts By Tag
postRouter.post('/upvotes', upvotePost) //Post upvotes
postRouter.post('/downvotes', downvotePost) //Post Downvotes
postRouter.get('/comments') //Get Comments
postRouter.post('/comments') //Post Comments
postRouter.delete('/comments') //Delete comments

//Endpoints to create
//Decrement, Increment upvotes and Downvotes
//Upvote and Downvote comments
//Getting downvotes and upvotes can be handled by just getting all post Data by postId, just get the votes in it 

module.exports = postRouter