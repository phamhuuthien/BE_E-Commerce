const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const crtls = require('../controller/chat')

function socket(res,req,next) {
    const {_id} = user
    const {message} = req.body
    console.log(message)
    io.on('connection', (socket) => {
      console.log('Người dùng đã kết nối với socket');
    
      socket.on('message', async (data) => {
        _id, message = data;
        io.emit('message', data);
        crtls.saveMessage(_id, message);
      });
    
      socket.on('disconnect', () => {
        console.log('Người dùng đã ngắt kết nối với socket');
      });
    });
}

module.exports = {
    socket
}
