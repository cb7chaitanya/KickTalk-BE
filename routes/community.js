const express = require('express')
const communityRouter = express.Router()
const {authMiddleware} = require('../middleware/auth')
const { createCommunity, findCommunity } = require('../controllers/communityControllers')

communityRouter.use(authMiddleware)

communityRouter.post('/create', createCommunity) //Create Community
communityRouter.get('/:commmunityId', findCommunity)
communityRouter.put('/:commmunityId')
communityRouter.delete('/:commmunityId')

module.exports = communityRouter