const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
var msgpack = require('msgpack5')();


const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(cors());

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('sendMessage', (data) => {
        console.log('Message received:', data);
        io.emit('receiveMessage', data);
    });

    socket.on("message", (data) => {
        console.log(msgpack.decode(data));
        io.emit("message", data);
    })
});

server.listen(3000, () => {
    console.log('Socket.IO server running at http://127.0.0.1:3000/');
});
