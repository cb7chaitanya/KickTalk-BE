const { User } = require('../db/userDB')
const jwt = require('jsonwebtoken')
const {signinBody, signupBody } = require('../zod/userZod')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

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
            profile
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function follow(req, res) {
    const { followedId } = req.body;

    try{
        const follower = req.userId;
        const followed = await User.findById(followedId);
        if(!follower || !followed) {
            return res.status(404).json({ 
                msg: "User Not Found"
            })
        }
        if(follower.following.includes(followed._id)){
            return res.status(400).json({
                msg: "Already Following"
            })
        }

        await User.findByIdAndUpdate(followed._id, {
            $push: {
                followers: follower._id
            }
        })

        await User.findByIdAndUpdate(follower._id, {
            $push: {
                following: followed._id
            }
        })
        return res.status({
            msg: "Followed Successfully",
            follower,
            followed
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

module.exports = {
    Signup,
    Signin,
    getUser,
    createProfile,
    follow
}