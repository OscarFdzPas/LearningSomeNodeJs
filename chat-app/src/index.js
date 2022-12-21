const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));


io.on('connection', (socket) => {
    console.log("New WebSocket connection");

    socket.on('join', (options, callback) => { // Cuando un usuario se une a la sala
        const {error, user} = addUser({id: socket.id, ...options});

        if(error) return callback(error); // decimos al client que hay un error

        socket.join(user.room);

        socket.emit('message', generateMessage(user.username,'Welcome!')); // Emite el evento a una sola conexion
        socket.broadcast.to(user.room).emit('message', generateMessage('System',`${user.username} has joined`)); //Emitir la conexion a todo el mundo menos al que se acaba de conectar en una misma sala
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        callback(); // decimos al client que todo ha ido bien
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();
        if(filter.isProfane(message)) return callback('Profanity is not allowed');

        if(user) {
            io.to(user.room).emit('message', generateMessage(user.username, message)); // Emite el evento a todas las conexiones abiertas
            callback('Delivered');
        }
    });

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);
        if(user) {
            io.emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`)); // Emite el evento a todas las conexiones abiertas
            callback();
        }
    });

    socket.on('disconnect', () => { // Cuando un usuario se desconecta
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', generateMessage('System', `${user.username} has left`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
