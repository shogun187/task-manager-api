const express = require('express')
const User = require("../models/user")
const router = new express.Router()
const auth = require('../middleware/auth.js')
const multer = require('multer')
const sharp = require('sharp')


//  Sign up
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send({error: 'Email already exists'})
    }
})

//  Login, place email and password in body
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token}) // toJSON is used
    } catch (e) {
        res.status(400).send({error: 'Log in credentials do not exist. Please try again'})
    }
})


//Upload Avatar
const upload = multer({
    limits: {fileSize: 1000000},
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload a jpg, jpeg or a png file'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {


        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    }, (error, req, res, next) => {
        res.status(400).send({error: error.message})
    }
)

// Delete Avatar
router.delete('/users/me/avatar', auth, async (req, res) => {

        req.user.avatar = undefined
        await req.user.save()
        res.send()
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

//  Logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currToken) => { // currToken is a document of a token
            return currToken.token != req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//  Logout All
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user) // from auth
})

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body) // returns an array of all keys in an object

    const allowed_updates = ['name', 'email', 'password', 'age']

    //  Test if the updates are valid
    const isValidOperation = updates.every((update) => {
        return allowed_updates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }

})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router