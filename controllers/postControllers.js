const {Post} = require('../db/postDB')
const {User} = require('../db/userDB')

async function createPost(req, res) {
    try{
        const { title, content, tags } = req.body
        if(!title || !content || !tags) {
            return res.status(400).json({
                msg: "Missing Title/Content/Tags"
            })
        }
        const userId = req.userId
        const author = await User.findOne({
           _id:  userId
        })
        if(!author) {
            return res.status(404).json({
                msg: "Author not found"
            })
        }
    
        const newPost = await Post.create({
            author: userId,
            content,
            tags,
            title
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

async function getAllPost(req, res) {
    try {
        const posts = await Post.find()
        return res.status(200).json({
            posts
        })
    } catch(error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function getYourPosts(req, res) {  
    try{
        const userId = req.userId
        const posts = await Post.find({
            author: userId  
        })
        return res.status(200).json({
            posts
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function getPostByTag(req, res){
    const {tag} = req.body
    try{
        const posts = await Post.find({
            tags: tag
        })
        return res.status(200).json({
            posts
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function upvotePost(req,res){
    const {postId} = req.params

    try{
        const post = await Post.findById({
            _id: postId
        })
        if(!post){
            return res.status(404).json({
                error: 'Post not found'
            })
        }

        post.votes.upvotes++
        await post.save()
        return res.status(200).json({
            msg: 'Post upvoted'
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function downvotePost(req,res){
    const {postId} = req.query

    try {
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                error: 'Post not found'
            })
        }

        post.votes.downvotes++
        await post.save()
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}



module.exports = {
    createPost, 
    getAllPost, 
    getYourPosts,
    getPostByTag,
    upvotePost,
    downvotePost
}