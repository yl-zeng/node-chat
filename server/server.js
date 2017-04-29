const path = require("path");
const express = require("express");
const socketIO =require("socket.io");
const http = require("http");
const {generateMessage,generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation.js");

const {Users} = require("./utils/users");


const config = require("./config/config.js");

const mongoose = require("./db/mongoose.js").mongoose;
const UserModel = require("./models/user.js").User;
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");
const _ = require("lodash");


var app = express();
const publicPath = path.join(__dirname,'../public');
const PORT = process.env.PORT || 3000;

var server = http.createServer(app);
var io = socketIO(server);


var users = new Users();


app.use(express.static(publicPath));

app.use(bodyParser.json());

app.get("/test",(req,res)=>{
  res.sendFile(path.resolve(__dirname + "/../public/index.html"));
});


app.post("/signup",(req,res)=>{
  console.log("receive signup");
  console.log(req.body);
  var body = _.pick(req.body,["name","password"]);
  var user = new UserModel(body);
  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header("x-auth",token).send(user);
  }).catch((err)=>{
    res.status(400).send(err);
  });
});

app.post("/login",(req,res)=>{
  var body = _.pick(req.body,["name","password"]);

  UserModel.findByCredentials(body.name,body.password).then((user)=>{
    //res.send(user);
    return user.generateAuthToken().then((token)=>{
      res.header("x-auth",token).send(user);
    });

  }).catch((err)=>{
    res.status(400).send("something terrible");
  });
});

//socket begin

io.use(function(socket, next) {
  var token = socket.request._query.token;
  UserModel.findByToken(token).then((user)=>{
    if(!user){
      return next(new Error("not authenticated"));
    }
    next();
  }).catch((err)=>{
    next(new Error("not authenticated"));
  });
});


io.on("connection",(socket)=>{
  console.log(`New user connected ${socket.id}`);

  console.log(socket.request._query.name);

  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and Romm name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));


    socket.emit("newMessage",generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.to(params.room).emit("newMessage",generateMessage('Admin',`${params.name} joined`));
    callback();
  });


  socket.on('createMessage',(message,callback)=>{
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      io.to(user.room).emit("newMessage",generateMessage(user.name,message.text));
    }

    callback();
  });

  socket.on("createLocationMessage",(coords)=>{
    var user = users.getUser(socket.id);

    if(user){
      io.to(user.room).emit("newLocationMessage",generateLocationMessage(user.name,coords.latitude,coords.longitude))
    }

  });

  socket.on("disconnect",()=>{
    var user = users.removeUser(socket.id);
    // if user was removed
    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
    }

    var token = socket.request._query.token;
    UserModel.findByToken(token).then((user)=>{
      return user.removeToken(token);
    });
  });
});

//socket ending




server.listen(PORT,()=>{
  console.log(`start up server on PORT ${PORT}!`);
});
