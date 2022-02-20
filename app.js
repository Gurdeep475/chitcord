const path = require('path')
const express = require('express');
const app = express();


const http = require('http')
const server = http.createServer(app);

const socketServer = require('socket.io');

const io = socketServer(server)

io.on('connection',socket => {
    // Welcome current user
    socket.emit('message','Welcome to ChatCord!');

    // Broadcast when a Client connects
    socket.broadcast.emit('message','A user has joined the chat') // it will send the event to everyone except the origin
    
    // Broadcast when a client disconnects
    socket.on('disconnect',() => {
        io.emit('message','A User has left the chat');
    })

    // Listen for chatMessage
    socket.on('chatMessage',(msg) => {
        io.emit('message',msg )
    })
})
// set the static foldres such as html and css
app.use(express.static(path.join(__dirname,'public')))
server.listen(3000,() => console.log('listening to port 3000'));