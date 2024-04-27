const express = require('express')
const userRouter = require('./user')
const postRouter = require('./post')

const router = express.Router()

router.use('/user', userRouter)
router.use('/post', postRouter)

module.exports = router