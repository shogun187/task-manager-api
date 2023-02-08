const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
const multer = require('multer')
require('./db/mongoose.js')

const app = express()

const port = process.env.PORT || 3000

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('File not supported'))
        }
        cb(undefined, true)

        // cb(new Error('File not supported'))
        // cb(undefined, true)

    }
})


app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
