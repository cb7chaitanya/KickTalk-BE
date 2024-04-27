const zod = require('zod')

const signupBody = zod.object({
    username: zod.string().min(5).max(25),
    email: zod.string().email(),
    password: zod.string().min(6)
})

const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
})

module.exports = {
    signupBody,
    signinBody
}