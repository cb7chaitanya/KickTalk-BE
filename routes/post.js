const express = require('express')
const postRouter = express.Router()
const { authMiddleware } = require('../middleware/auth')

postRouter.use(authMiddleware)
postRouter.post('/create' ) //Create Post
postRouter.get('/all') //Get All Posts
postRouter.get('/id') //Get Post By userId
postRouter.get('/tag') //Get Posts By Tag
postRouter.post('/votes') //Post downvotes/upvotes
postRouter.get('/votes') //Get votes
postRouter.get('/comments') //Get Comments
postRouter.post('/comments') //Post Comments
postRouter.delete('/comments') //Delete comments

module.exports = postRouter