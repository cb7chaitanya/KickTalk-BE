const express = require('express')
const userRouter = express.Router()
const { Signup, Signin, getUser } = require('../controllers/userControllers')

userRouter.post('/signup', Signup) //Signup
userRouter.post('/signin', Signin) //Login
userRouter.get('/username', getUser) //Get user by Username
userRouter.post('/bio/id') //Add a bio to your profile
userRouter.post('/avatar/id') //Add avatar
userRouter.post('/follow/id') //Follow someone
userRouter.delete('/unfollow/id') //Unfollow Someone
userRouter.get('/profile/id') //Get follower/following count, Get bio, get Avatar 

module.exports = userRouter