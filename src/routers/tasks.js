const express = require('express');
const Task = require('../models/tasks');
const auth = require('../middleware/auth');
const User = require('../models/users')

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    try {
        let task = await new Task({...req.body, user: req.user._id}).save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }

})

// GET /tasks?completed=true
// GET /tasks?limit=2skip=2
// GET /tasks?sortBy=completed:asc or completed:desc
router.get('/tasks', auth, async (req, res) => {
    try {
      const match = {}
      const sort = {}
      if(req.query.completed) {
          match['completed'] = req.query.completed === 'true'
      }
      if(req.query.sortBy) {
          const parts=req.query.sortBy.split(':')
          sort[parts[0]] = parts[1] === 'asc'? 1:-1
      }

      await req.user.populate({
            path:'tasks',
            match,
            options :{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
      }).execPopulate()
      res.send(req.user.tasks)


        // let task = await Task.find({user: req.user._id})
        // res.send(task)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }

})

router.get('/tasks/:id',  auth, async (req, res) => {
    try {
        let task = await Task.findOne({user:req.user._id, _id: req.params.id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


router.patch('/tasks/:id', auth, async (req, res) =>{
    try {
        let task = await Task.findOne({_id: req.params.id, user: req.user._id})

        if(!task) {
            res.status(404).send()
        }

        Object.keys(req.body).forEach(key=>task[key] = req.body[key])
        await task.save()
        res.send(task);

    }catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        let task = await Task.findOneAndDelete({_id: req.params.id, user: req.user._id})
        if(!task) {
            res.status(404).send();
        }
        res.send(task)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports =router;