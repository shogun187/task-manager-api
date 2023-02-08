const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // {_id : userid}
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if (!user) {
            throw new Error()
        }
        req.user = user // this is added as a property to req
        req.token = token
        next()

    } catch (e) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth