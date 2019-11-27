const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const app = express();
const port = process.env.PORT || 3000;


app.use((req, res, next)=>{
    console.log('secondMV')
    next()
})
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Connected on server ' + port);
});


// const Task = require('./models/tasks')
//
// async function test() {
//     const task = await Task.findById('5ddbf19c1fbfb65954cca768')
//     await task.populate('user').execPopulate()
//     console.log(task)
// }
//
// test()
