const express = require('express')
const userRouter = express.Router()
const { Signup, Signin, getUser, createProfile, followUser, unfollowUser } = require('../controllers/userControllers')
const {authMiddleware} = require('../middleware/auth')
const multer = require('multer')

const upload = multer({dest: 'uploads/'}).single('avatarImage')

userRouter.post('/signup', Signup) //Signup
userRouter.post('/signin', Signin) //Login
userRouter.get('/username', authMiddleware, getUser) //Get user by Username
userRouter.post('/profile', authMiddleware, upload, createProfile) //Create Profile
userRouter.post('/:followId', authMiddleware, followUser) //Follow someone
userRouter.delete('/:unfollowId', authMiddleware, unfollowUser) //Unfollow Someone

module.exports = userRouter