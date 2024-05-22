const express = require('express')
const communityRouter = express.Router()
const multer = require('multer')
const {authMiddleware} = require('../middleware/auth')
const { createCommunity, getCommunityById, updateCommunity, deleteCommunity, specificPosts, getAllCommunities } = require('../controllers/communityControllers')

const upload = multer({dest: 'uploads/'}).single('bannerImage')
communityRouter.use(authMiddleware)

communityRouter.get('/all', getAllCommunities) //Get all communities
communityRouter.post('/create', upload, createCommunity) //Create Community
communityRouter.get('/:communityId', getCommunityById) //Find Community by Id
communityRouter.put('/:communityId', updateCommunity) //Update Community if admin
communityRouter.delete('/:communityId', deleteCommunity) //Delete Community
communityRouter.get('/:communityId/posts', specificPosts) //Get community Specific posts

module.exports = communityRouter