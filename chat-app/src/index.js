const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));


io.on('connection', (socket) => {
    console.log("New WebSocket connection");
    socket.emit('message', 'Welcome to my chap app!'); // Emite el evento a una sola conexion

    socket.broadcast.emit('message', 'A new user has joined!'); //Emitir la conexion a todo el mundo menos al que se acaba de conectar

    socket.on('sendMessage', (message) => {
        io.emit('message', message); // Emite el evento a todas las conexiones abiertas
    });

    socket.on('sendLocation', (location) => {
        io.emit('message', `https://google.com/maps?q= ${location.latitude},${location.longitude}`); // Emite el evento a todas las conexiones abiertas
    });

    socket.on('disconnect', () => { // Cuando un usuario se desconecta
        io.emit('message', 'A user has left!'); 
    });
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
