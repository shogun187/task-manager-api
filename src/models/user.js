const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task.js')


const userSchema = new mongoose.Schema({
        name: {
            type: String, required: true
        },
        age: {
            type: Number,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be positive')
                }
            },
            default: 0
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is not valid')
                }
            },
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minLength: 7,
            validate(value) {
                if (validator.contains(value, 'password')) {
                    throw new Error('Password cannot contain password')
                }

            },
            trim: true
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ],
        avatar: {
            type: Buffer
        }
    }, {timestamps: true}
)

//  virtual field
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // referring to owner._id
    foreignField: 'owner' // referring to Task.owner
})

// Instance method, this refers to document
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user.id}, 'thisismynewcourse') // token is generated from id and secret key
    user.tokens = user.tokens.concat({token}) // tokens is an array
    await user.save()
    return token
}

//  Instance method, to get public profile
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

//  Static method to login user
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('Unable to log in')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to log in')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()

})

//  Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User