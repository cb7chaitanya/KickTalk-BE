const express = require('express')
const { Community } = require('../db/communityDB')

async function createCommunity(req, res) {
    const { name, description, bannerUrl } = req.body
    const userId = req.userId
    try{
        const newCommunity = await Community.create({
            name,
            description,
            admin: [userId],
        })
        if(bannerUrl) {
            newCommunity.Banner.exists = true
            newCommunity.Banner.url = bannerUrl
        }

        await newCommunity.save()

        return res.status(201).json({
            msg: "Community created successfully",
            newCommunity
        })
    } catch(error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function findCommunity(req, res) {
    const communityId = req.params.communityId
    try{
        const community = await Community.findById(communityId)
        if(!community) {
            return res.status(404).json({
                msg: "Community not found"
            })
        }
        return res.status(200).json({
            community
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

module.exports = {
    createCommunity,
    findCommunity
}