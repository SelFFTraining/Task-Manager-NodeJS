const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const secretKey = "santoshtoken"
const Task = require('../models/tasks')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length > 10) {
                throw "Name length should not be more than 10"
            }
        }

    },
    age: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw "Email is invalid"
            }
        }

    },
    password: {
        type: String,
        minlength: 8,
        required: true,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref:'Task',
    localField: '_id',
    foreignField: 'user'
})
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id}, secretKey)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to login')
    }
    if (!await bcrypt.compare(password, user.password)) {
        throw new Error('Unable to login, invalid email or password')
    }
    return user
}

userSchema.pre('save', async function (next) {
    let user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})

userSchema.pre('findOneAndUpdate', async function (next) {
    let user = this;
    user.setUpdate({$set: {password: await bcrypt.hash(user.getUpdate().password, 8)}});
    next()
})

userSchema.pre('remove', async function (next) {
    let user = this
    // await user.populate('tasks').execPopulate()
    // user.tasks.forEach(task=>task.remove())

    await Task.deleteMany({user:user._id})
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;