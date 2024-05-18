const { User } = require('../db/userDB')
const { Community } = require('../db/communityDB')
const jwt = require('jsonwebtoken')
const {signinBody, signupBody } = require('../zod/userZod')
const cloudinary = require('cloudinary').v2
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

async function verify(req,res){
    try{
        const user = await User.findOne({
            verificationToken: req.query.verificationToken
        })
        if(!user) {
            return res.status(404).json({
                msg: "User Not Found"
            })
        }
        user.verified = true
        user.verificationToken = null;
        await user.save()
        return res.status(200).json({
            msg: "Email Verified"
        })
    } catch(error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function Signup(req, res) {
    const {success} = signupBody.safeParse(req.body)
    if(!success) {
        return res.status(400).json({
            msg: "Invalid User Input"
        })
    }
    const userExists = await User.findOne({
        username: req.body.username
    })
    if(userExists) {
       return res.status(400).json({
        msg: "User Already Exists"
       })
    }
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    const verificationToken = uuidv4()
    user.verificationToken = verificationToken
    await user.save()

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify Your Email",
        html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email</p>
        <a href="https://kicktalk-be.onrender.com/api/v1/user/verify/${verificationToken}">Verify Email</a>
        `
    }
    await transporter.sendMail(mailOptions)
    const userId = user._id
    const token = jwt.sign({
        userId
    }, JWT_SECRET)
    return res.status(201).json({
        msg: "User Created",
        token
    })
}

async function Signin(req, res) {
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            msg: "Invalid User Input"
        })
    }
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        res.json({
            msg: "User Logged In",
            token
        })
        return;
    }
    res.status(400).json({ 
        msg: "Invalid Credentials"
    })
}

async function getUser(req, res) { 
    try{
        const username = req.query.username;
        const users = await User.find({
            username: {
                $regex: username,
                $options: 'i'
            }
        })
        if(users.length > 0) {
            return res.status(200).json({
                users
            })
        }
        else {
            return res.status(404).json({
                msg: "User Not Found"
            })
        }
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function getUserById(req, res){
    const userId = req.userId;

    try{
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                msg: "User Not Found"
            })
        }
        return res.status(200).json({
            user
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function createProfile(req, res) {
    const { bio } = req.body
    let avatarImageUrl;
    const userId = req.userId;
    try{
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                msg: "User Not Found"
            })
        }
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path)

            avatarImageUrl = result.secure_url
        }
        const profile = user.profile = {
            bio,
            avatar: {
                exists: avatarImageUrl ? true : false,
                url: avatarImageUrl
            }
        }
        await user.save()
        return res.status(200).json({
            msg: "Profile Created",
            user
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function followUser(req, res) {
    const {followId} = req.params
    const userId = req.userId

    try{
        const userToFollow = await User.findById(followId)
        const user = await User.findById(userId)
        if(!userToFollow) {
            return res.status(404).json({
                msg: "User Not Found"
            })
        }
        if(userToFollow.followers.includes(userId)){
            return res.status(400).json({
                msg: "You are already following the user"
            })
        }
        userToFollow.followers.push(userId)
        user.following.push(followId)
        await userToFollow.save()
        await user.save()
        return res.status(200).json({
            msg: "User Followed",
            user
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function unfollowUser(req, res){
    const {unfollowId} = req.params
    const userId = req.userId

    try{
        const userToUnfollow = await User.findById(unfollowId)
        const user = await User.findById(userId)
        if(!userToUnfollow) {
            return res.status(404).json({
                msg: "User Not Found"
            })
        }
        if(!user.following.includes(unfollowId)){
            return res.status(400).json({
                msg: "You are not following the user"
            })
        }
        userToUnfollow.followers.pull(userId)
        user.following.pull(unfollowId)
        await userToUnfollow.save()
        await user.save()
        return res.status(200).json({
            msg: "User Unfollowed",
            user
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function subscribedCommunities(req, res) {
    const userId = req.userId;
    try{    
        const communities = await Community.find({subscribers: userId})
        if(!communities){
            return res.status(404).json({
                msg: "Communities not found"
            })
        }       
        return res.status(200).json({
            communities
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function subscribe(req,res){
    const communityId = req.params.communityId
    const userId = req.userId
    const community = await Community.findById(communityId)
    if(!community){
        return res.status(404).json({
            msg: "Community Not Found"
        })
    }
    if(community.subscribers.includes(userId)){
        return res.status(400).json({
            msg: "You are already subscribed to the community"
        })
    }
    community.subscribers.push(userId)
    community.Count.subscribers = community.Count.subscribers + 1;
    community.save()    
    return res.status(200).json({
        msg: "Community Subscribed",
        community
    })
}

async function unsubscribe(req, res){
    const communityId = req.params.communityId
    const userId = req.userId
    const community = await Community.findById(communityId)
    if(!community){
        return res.status(404).json({
            msg: "Community Not Found"
        })
    }
    if(!community.subscribers.includes(userId)){
        return res.status(400).json({
            msg: "You are not subscribed to the community"
        })
    }
    community.subscribers.pull(userId)
    community.Count.subscribers = community.Count.subscribers - 1;
    community.save()
    return res.status(200).json({
        msg: "Community Unsubscribed",
        community
    })
}

module.exports = {
    Signup,
    Signin,
    getUser,
    getUserById,
    createProfile,
    followUser,
    unfollowUser,
    verify,
    subscribe, 
    unsubscribe,
    subscribedCommunities
}