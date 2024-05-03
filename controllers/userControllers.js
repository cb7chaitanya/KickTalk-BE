const { User } = require('../db/userDB')
const { JWT_SECRET } = require('../config')
const jwt = require('jsonwebtoken')
const {signinBody, signupBody } = require('../zod/userZod')

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
    
}

module.exports = {
    Signup,
    Signin,
    getUser,
    createProfile
}