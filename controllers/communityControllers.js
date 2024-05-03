const { Community } = require('../db/communityDB')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

async function createCommunity(req, res) {
    const { name, description } = req.body
    const admin = req.userId
    let bannerImageUrl;
    try{

        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path)

            bannerImageUrl = result.secure_url
        }
        const newCommunity = await Community.create({
            name,
            description,
            admin: admin,
            Banner: {
                exists: bannerImageUrl ? true : false,
                url: bannerImageUrl
            }
        })
        return res.status(201).json({
            msg: "Community created successfully",
            newCommunity
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function getCommunityById(req, res) {
    const communityId = req.params.communityId
    try{
        const community = await Community.findById(communityId)
        console.log(community)
        if(!community) {
            return res.status(404).json({
                msg: "Community not found"
            })
        }
        return res.status(200).json({
            community: community
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function updateCommunity(req, res) {
    const communityId = req.params.communityId
    console.log(communityId)
    const { name, description } = req.body
    const possibleAdmin = req.userId
    try{
        const community = await Community.findById(communityId)
        if(!community) {
            return res.status(404).json({
                msg: "Community not found"
            })
        }
        const admin = community.admin.toString()
        if(admin != possibleAdmin) {
            return res.status(401).json({
                msg: "Unauthorized"
            })
        }
        if(name){
            community.name = name
        }
        if(description){
            community.description = description
        }
        await community.save()
        return res.status(200).json({
            msg: "Community updated successfully",
            community
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function deleteCommunity(req, res){
    const communityId = req.params.communityId
    const possibleAdmin = req.userId
    try{
        const community = await Community.findById(communityId)
        if(!community) {
            return res.status(404).json({
                msg: "Community not found"
            })
        }
        const admin = community.admin
        if(admin != possibleAdmin) {
            return res.status(401).json({
                msg: "Unauthorized"
            })
        }
        await Community.findByIdAndDelete(communityId)
        return res.status(200).json({
            msg: "Community deleted successfully"
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

module.exports = {
    createCommunity,
    getCommunityById,
    updateCommunity,
    deleteCommunity
}