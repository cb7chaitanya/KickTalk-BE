const express = require('express')
const postRouter = express.Router()
const { authMiddleware } = require('../middleware/auth')
const { createPost, getAllPost, getYourPosts, getPostByTag, postVoteHandling, commentVoteHandling, createComment, getComments, deletePost, deleteComment, editPost, editComment } = require('../controllers/postControllers')

postRouter.use(express.json())
postRouter.use(authMiddleware)

postRouter.post('/create', createPost) //Create Post
postRouter.get('/all', getAllPost) //Get All Posts
postRouter.get('/own', getYourPosts) //Get your own posts
postRouter.get('/tag', getPostByTag) //Get Posts By Tag
postRouter.post('/:postId/votes', postVoteHandling) // Handling upvote, downvote and unvote in a single post API for posts
postRouter.post('/:postId/:commentId/votes', commentVoteHandling) //Handling upvote, downvote and unvote in a single post API for comments
postRouter.delete('/:postId', deletePost) // Delete Post if you are the original author
postRouter.get('/:postId/comments', getComments) //Get Comments
postRouter.post('/:postId/comments', createComment) //Post Comments
postRouter.delete('/:postId/:commentId', deleteComment) //Delete single comment
postRouter.put('/:postId', editPost) //Edit posts
postRouter.put('/:postId/:commentId', editComment) //Edit comments

//Endpoints to create
//Decrement, Increment upvotes and Downvotes 
//Upvote and Downvote comments
//Getting downvotes and upvotes can be handled by just getting all post Data by postId, just get the votes in it 

module.exports = postRouter