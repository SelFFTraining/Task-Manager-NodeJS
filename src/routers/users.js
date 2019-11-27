const express = require('express');
const Users = require('../models/users');
const mongoose = require ('mongoose');
const auth = require('../middleware/auth')
const router = new express.Router();


router.post('/users', async (req, res) => {
    try {
        let user = await new Users(req.body).save();
        let token = await user.generateAuthToken()
        res.status(201).send({user,token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) =>{
    try {
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({user, token})
    }catch (e) {
        res.status(400).send(e)
    }
})
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    }catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    let _id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        res.status(404).send({error: 'Not a valid id ' + _id});
    }
    try {
        let user = await Users.findById(_id);
        if (!user) {
            res.status(404).send({error: 'No user found with id ' + _id});
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(tokenObj=>tokenObj.token!==req.token);
        await req.user.save();
        res.send();
    }catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch (e) {
        res.status(500).send();
    }
})

router.patch('/users/me', auth, async (req, res) => {
    let updateKeys = Object.keys(req.body)
    try {
        updateKeys.forEach(key=>req.user[key] = req.body[key])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req, res)=>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch (e) {
        res.status(500).send()
    }
})

// router.patch('/users/:id', async (req, res) => {
//
//     try {
//         let user = await Users.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
//         if(!user) {
//             res.status(404).send(e)
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })
//
// router.delete('/users/:id', async (req, res)=>{
//     try{
//         let user = await Users.findByIdAndDelete(req.params.id)
//         if(!user) {
//             res.status(404).send(e);
//         }
//         res.send(user)
//     }catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router