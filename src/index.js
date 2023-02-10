const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
const cookieParser = require('cookie-parser')

require('./db/mongoose.js')

const app = express()

const port = process.env.PORT || 3000


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.use(express.static('public')) // folder
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
