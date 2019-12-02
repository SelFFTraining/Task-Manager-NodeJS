const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const app = express();
const port = process.env.PORT;


app.use((req, res, next)=>{
    console.log('secondMV')
    next()
})

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const multer = require('multer')
const upload = multer({
    dest:'images'
})

app.post('/upload', upload.single('upload'),(req, res)=>{
    res.send()
})


app.listen(port, () => {
    console.log('Connected on server ' + port);
});



