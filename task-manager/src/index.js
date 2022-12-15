const express = require('express');
require('./db/mongoose');
const User = require('./models/user-model');
const Task = require('./models/task-model');

const app = express();
const port = 3000;

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const bcrypt = require('bcryptjs')

const myFunction = async () => {
    const password = 'Red12345!'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare('red12345!', hashedPassword)
    console.log(isMatch)
}

myFunction()