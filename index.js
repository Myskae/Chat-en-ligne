const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = {};



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/new.html');
});

server.listen(3000, () => {
    setTimeout(() => { console.log('Server is loading ...'); }, 1000)
    setTimeout(() => { console.log('Server is operationnal !'); }, 2000)
});

io.on('connection', (socket) => {
    console.log('a user joined the server');
    socket.on('disconnect', () => {
        console.log('user left the server');
    });
});



io.on('connection', (socket) => {

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('new-user', (name) => {
        
        let valid = true;
        for (u in users) {
            if ((users[u]==name)){
                valid=false;
                break;
            }
        }

        if(valid) {
            socket.emit('username is valid');
            users[socket.id] = name;
            io.emit('user-connected', users);
        }
    })

    socket.on('disconnect', () => {
        io.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    })
    
});



io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });


io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', (msg));
    });
});

