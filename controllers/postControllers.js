const {Post} = require('../db/postDB')
const {User} = require('../db/userDB')
const {Community} = require('../db/communityDB')
async function createPost(req, res) {
    try{
        const { title, content, tags, communityName } = req.body
        console.log(req.body)
        if(!title || !content || !tags || !communityName ) {
            return res.status(400).json({
                msg: "Missing Title/Content/Tags/Community"
            })
        }

        const community = await Community.find({
            name: communityName
        })
        const communityId = community._id

        if(!community){
            return res.status(404).json({
                msg: "Community not found"
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
            title,
            community: communityId
        })
        return res.status(201).json({
            msg: "Post Created",
            newPost
        })
    } catch(error) {
        console.log(error)
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

async function getPostById(req, res){
    const postId = req.params.postId
    try{
        const post = await Post.findById(postId)
        return res.status(200).json({
            post
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function postVoteHandling(req, res){
    const postId = req.params.postId;
    const action = req.body.action;

    try{
        let post =  await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                msg: "Post not found"
            })
        }

        if(action === 'upvote'){
            post.votes.upvotes++;
        }
        else if(action === 'downvote'){
            post.votes.downvotes++;
        }
        else if(action === 'unvote'){
            if(req.body.voteType === 'upvote' && post.votes.upvotes > 0){
                post.votes.upvotes--;
            }
            else if(req.body.voteType === 'downvote' && post.votes.downvotes > 0){
                post.votes.downvotes--;
            }
            else{
                return res.status(400).json({
                    msg:"User has not voted for the post"
                })
            }   
        } else{
            return res.status(400).json({
                msg: "Invalid Action"
            })
        } 

        await post.save()

        res.json({
            msg: "Vote updated successfully",
            post
        })
        
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error",
        })
    }
}

async function commentVoteHandling(req, res){
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const action = req.body.action;

    try{
        let post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                msg: "Post not found"
            })
        }
        let commentToVote = post.comments.find(comment => comment._id == commentId);
        if(!commentToVote){
            return res.status(404).json({
                msg: "Comment not found"
            })
        }

        if(action === 'upvote'){
            commentToVote.votes.upvotes++;
        }
        else if(action === 'downvote'){
            commentToVote.votes.downvotes++;
        }
        else if(action === 'unvote'){
            if(req.body.voteType === 'upvote' && commentToVote.votes.upvotes > 0){
                commentToVote.votes.upvotes--;
            }
            else if(req.body.voteType === 'downvote' && commentToVote.votes.downvotes > 0){
                commentToVote.votes.downvotes--;
            }
            else{
                return res.status(400).json({
                    msg:"User has not voted for the comment"
                })
            }   
        } else{
            return res.status(400).json({
                msg: "Invalid Action"
            })
        }
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error",
        })
    }
}

async function createComment(req, res){
    const postId = req.params.postId
    const {content} = req.body
    const userId = req.userId
    try{
        let post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                msg: "Post not found"
            })
        }
        if(!content){
            return res.status(400).json({
                msg: "Comment cannot be empty"
            })
        }

        post.comments.push({
            author: userId,
            content,
            votes: {
                downvotes: 0, 
                upvotes: 0
            }
        })
        await post.save()
        return res.status(200).json({
            msg: "Comment created successfully",
            post
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function getComments(req, res){
    const postId = req.params.postId
    try{
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                msg: "Post not found"
            })
        }

        return res.status(200).json({
            comments: post.comments
        })
    } catch(error){
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function deletePost(req, res){
    const postId = req.params.postId
    const user = req.userId
    try{
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                msg: "Post not found"
            })
        }
        if(post.author != user){
            return res.status(401).json({
                msg: "Unauthorized"
            })
        }
        await Post.findByIdAndDelete(postId)
        return res.status(200).json({
            msg: "Post deleted successfully"
        })          
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function deleteComment(req, res){
    const postId = req.params.postId
    const commentId = req.params.commentId
    const user = req.userId

    try{
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                msg: "Post not found"
            })
        }
        let commentToDelete = post.comments.find(comment => comment._id == commentId)
        
        if(!commentToDelete){
            return res.status(404).json({
                msg: "Comment not found"
            })
        }

        if(commentToDelete.author && commentToDelete.author.toString() != user){
            return res.status(401).json({
                msg: "Unauthorized"
            })
        }   
        post.comments = post.comments.filter(comment => comment._id.toString() != commentId)
        await post.save()
        return res.status(200).json({
            msg: "Comment deleted successfully",
            post
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function editPost(req, res){
    const postId = req.params.postId
    const {title, content, tags} = req.body
    const user = req.userId
    try{
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                msg: "Post not found"
            })
        }
        if(post.author != user){
            return res.status(401).json({
                msg: "Unauthorized"
            })
        }
        if (title) {
            post.title = title;
        }

        if (content) {
            post.content = content;
        }

        if(tags) {
            post.tags = tags;
        }
        await post.save()
        return res.status(200).json({
            msg: "Post updated successfully",
            post
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

async function editComment(req, res){
    const postId = req.params.postId
    const commentId = req.params.commentId
    const {content} = req.body
    const user = req.userId

    try{
        const post = await Post.find(postId)
        if(!post){
            return res.status(404).json({
                msg: "Post not found"
            })
        }
        let commentToEdit = post.comments.find(comment => comment._id == commentId)
        
        if(!commentToEdit){
            return res.status(404).json({
                msg: "Comment not found"
            })
        }

        if(commentToEdit.author && commentToEdit.author.toString() != user){
            return res.status(401).json({
                msg: "Unauthorized"
            })
        }

        if (content) {
            commentToEdit.content = content;
        }
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
    getPostById,
    postVoteHandling,
    commentVoteHandling,
    createComment,
    getComments,
    deletePost,
    editPost,
    deleteComment,
    editComment
}