const {JWT_SECRET} = require('../config')
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization
    if(!header){
        return res.status(403).json({msg: "Unauthorized"})
    }

    const parts = header.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(403).json({ msg: "Unauthorized" })
    }

    const token = parts[1]
    try{
        const verified = jwt.verify(token, JWT_SECRET)
        req.userId = verified.userId
        next()
    } catch (error){
        return res.status(403).json({msg: "Unauthorized"})
    }
}

module.exports = {
    authMiddleware
}