const express = require('express')
const Task = require("../models/task.js")
const auth = require('../middleware/auth.js')
const router = new express.Router()

//  Create Task
router.post('/tasks', auth, async (req, res) => {
    //  const task = new Task(req.body)
    const task = new Task({
        ...req.body, // ... is spread
        owner: req.user._id // owner id is stored in owner
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(402).send(e)
    }
})

//  Get all Tasks options: (limit, skip, sortBy, completed)
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}


    if (req.query.completed) {
        match.completed = (req.query.completed == 'true')
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = (parts[1] == 'desc' ? -1 : 1)
    }
    try {
        await req.user.populate({
                path: 'tasks', match, options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }
        )
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            res.status(404).send()
        } else {
            res.send(task)
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: "invalid update"})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send("why doesnt this work")
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
