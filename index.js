const express = require('express')
const app = express()
const cors = require('cors')
const primaryRouter = require('./routes/index')

app.use(cors())
app.use(express.json())
app.use("/api/v1", primaryRouter)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})