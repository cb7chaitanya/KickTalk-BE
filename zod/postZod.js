const zod = require('zod')

const postBody = zod.object({
    title: zod.string().min(1).max(25),
    content: zod.string().min(1).max(150),
    tags: zod.array(zod.string()).max(5)
})

module.exports = {
    postBody
}