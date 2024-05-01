const express = require('express')
const userRouter = require('./user')
const postRouter = require('./post')
const communityRouter = require('./community')

const router = express.Router()

router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/community', communityRouter)

module.exports = router