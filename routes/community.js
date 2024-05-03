const express = require('express')
const communityRouter = express.Router()
const multer = require('multer')
const {authMiddleware} = require('../middleware/auth')
const { createCommunity, getCommunityById, updateCommunity, deleteCommunity, getCommunityByName, getAllCommunities } = require('../controllers/communityControllers')


const upload = multer({dest: 'uploads/'}).single('bannerImage')
communityRouter.use(authMiddleware)

communityRouter.post('/create', upload, createCommunity) //Create Community
communityRouter.get('/:communityId', getCommunityById) //Find Community by Id
communityRouter.get('/name', getCommunityByName) //Find community by Name 
communityRouter.get('/all', getAllCommunities) //Get All Communities
communityRouter.put('/:communityId', updateCommunity) //Update Community if admin
communityRouter.delete('/:communityId', deleteCommunity) //Delete Community

module.exports = communityRouter