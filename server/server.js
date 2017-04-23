const path = require("path");
const express = require("express");
const socketIO =require("socket.io");
const http = require("http");
const {generateMessage,generateLocationMessage} = require("./utils/message");

var app = express();
const publicPath = path.join(__dirname,'../public');
const PORT = process.env.PORT || 3000;

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection",(socket)=>{
  console.log("New user connected");

  socket.emit("newMessage",generateMessage('Admin','Welcome to the chat app'));

  socket.broadcast.emit("newMessage",generateMessage('Admin','New User joined'));

  socket.on('createMessage',(message,callback)=>{
    console.log('createMessage',message);

    io.emit("newMessage",generateMessage(message.from,message.text));
    callback("this is from server");
    // socket.broadcast.emit("newMessage",{
    //   from:message.from,
    //   text:message.text,
    //   createdAt: new Date().getTime()
    // })
  });

  socket.on("createLocationMessage",(coords)=>{
    io.emit("newLocationMessage",generateLocationMessage("Admin",coords.latitude,coords.longitude))
  });



  socket.on("disconnect",()=>{
    console.log("User was disconnected");
  });
});

server.listen(PORT,()=>{
  console.log(`start up server on PORT ${PORT}!`);
});
