const express = require('express')
const userRouter = express.Router()
const { Signup, Signin, getUser } = require('../controllers/userControllers')

userRouter.post('/signup', Signup) //Signup
userRouter.post('/signin', Signin) //Login
userRouter.get('/username', getUser) //Get user by Username
userRouter.post('/bio') //Add a bio to your profile
userRouter.post('/avatar') //Add avatar
userRouter.post('/follow') //Follow someone
userRouter.delete('/unfollow') //Unfollow Someone
userRouter.get('/profile') //Get follower/following count, Get bio, get Avatar 

module.exports = userRouter