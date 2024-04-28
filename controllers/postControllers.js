const {Post} = require('../db/postDB')
const {postBody} = require('../zod/postZod')

async function createPost(req, res) {
    try{
        const {title, content, tags} = postBody.safeParse(req.body)
        const userId = req.userId
        if(!title || !content || !tags) {
            return res.status(400).json({
                msg: "Invalid User Input"
            })
        }
        const author = await User.findOne({
           _id:  userId
        })
        if(!author) {
            return res.status(404).json({
                msg: "Author not found"
            })
        }
        const newPost = await Post.create({
            title,
            content,
            author: userId,
            tags
        })
        return res.status(201).json({
            msg: "Post Created",
            newPost
        })
    } catch(error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

module.exports = {
    createPost
}