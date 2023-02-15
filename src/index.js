const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

require('./db/mongoose.js')

const app = express()

const port = process.env.PORT

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "*")
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    next()
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
