const express = require('express')
const userRouter = express.Router()
const { Signup, Signin, getUser, createProfile, followUser, unfollowUser, verify,
subscribedCommunities, subscribe, unsubscribe } = require('../controllers/userControllers')
const {authMiddleware} = require('../middleware/auth')
const multer = require('multer')

const upload = multer({dest: 'uploads/'}).single('avatarImage')

userRouter.post('/signup', Signup) //Signup
userRouter.get('/verify', verify) //Matching verification Token on SignUp
userRouter.post('/signin', Signin) //Login
userRouter.get('/username', authMiddleware, getUser) //Get user by Username
userRouter.post('/profile', authMiddleware, upload, createProfile) //Create Profile
userRouter.post('/:followId', authMiddleware, followUser) //Follow someone
userRouter.delete('/:unfollowId', authMiddleware, unfollowUser) //Unfollow Someone
userRouter.get('/subscribedCommunities', authMiddleware, subscribedCommunities) //Get Subscribed Communities
userRouter.post('/:communityId/subscribe', authMiddleware, subscribe) //Subscribe to a community
userRouter.delete('/:communityId/unsubscribe', authMiddleware, unsubscribe) //Unsubscribe from a community

module.exports = userRouter