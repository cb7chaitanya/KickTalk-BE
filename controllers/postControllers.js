const {Post, User} = require('../db/postDB')
const {createPostBody} = require('../zod/postZod')

async function createPost(req, res) {
    try{
        const {title, content, tags} = createPostBody.safeParse(req.body)
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
        //Have to work on this [TODO]
        const post = newPost({
            title,
            content,
            author: author._id,
            tags
        })

        return res.status(201).json({
            msg: "Post Created",
            post
        })
    }
    catch(error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}