const User = require('../models/users')
const jwt = require('jsonwebtoken')
const secretKey = "santoshtoken"
const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const tokenPayload = jwt.verify(token, secretKey)
        const user = await User.findOne({_id:tokenPayload._id, 'tokens.token':token})
        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: 'Please Authorize'})
    }
}

module.exports = auth