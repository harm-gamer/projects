const {Server} = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin : "*"
    }
})

io.on('connection',(socket) =>{
    console.log(`user connexted : ${socket.id}`);

    socket.on("send message",(data) =>{
        console.log(`message received : ${data}`);
        io.emit("receive_message",data);
    })


    socket.on('disconnect',() =>{

        console.log(`user disconnected : ${socket.id}`);
    })
})

server.listen(3000,() => {
    console.log(`Express server running on port 3000`);
})


