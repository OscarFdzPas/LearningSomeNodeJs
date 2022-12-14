const express = require('express');
require('./db/mongoose');
const User = require('./models/user-model');
const Task = require('./models/task-model');

const app = express();
const port = 3000;

app.post('/users', (req, res) => {
    const user = new User(req.body);
    
    user.save().then(() => {
        res.status(201).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.post('/tasks', (req, res) => {
    const user = new Task(req.body);
    
    user.save().then(() => {
        res.status(201).send(task);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));