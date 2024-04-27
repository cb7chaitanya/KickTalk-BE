const zod = require('zod')

const createPostBody = zod.object({
    title: zod.string().min(1).max(25),
    content: zod.string().min(1).max(150),
    tags: zod.array(zod.string()).max(5)
})

module.exports = {
    createPostBody
}