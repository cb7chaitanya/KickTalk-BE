const express = require('express')
const userRouter = express.Router()
const { Signup, Signin, getUser, createProfile, follow } = require('../controllers/userControllers')
const {authMiddleware} = require('../middleware/auth')
const multer = require('multer')

const upload = multer({dest: 'uploads/'}).single('avatarImage')

userRouter.post('/signup', Signup) //Signup
userRouter.post('/signin', Signin) //Login
userRouter.get('/username', authMiddleware, getUser) //Get user by Username
userRouter.post('/profile', authMiddleware, upload, createProfile) //Create Profile
userRouter.post('/follow', authMiddleware, follow) //Follow someone
userRouter.delete('/unfollow', authMiddleware) //Unfollow Someone

module.exports = userRouter