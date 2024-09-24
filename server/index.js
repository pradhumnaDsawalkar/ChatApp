const express=require('express');
const socketio=require('socket.io');
const http=require('http');
const router=require('./router');
const {addUser,removeUser,getUser,getUsersInRoom}=require('./users');
const { clearLine } = require('readline');
const cors=require('cors');

const PORT=process.env.PORT || 5000;

const app=express();
const server=http.createServer(app);

app.use(cors({
origin: ['http://localhost:3000', 'https://chat-app-frontend-two-black.vercel.app'], // Allow these two origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

const io=socketio(server,{
    cors: {
     origin: ['http://localhost:3000', 'https://chat-app-frontend-two-black.vercel.app'], // Frontend origin
      methods: ["GET", "POST"]
    }
  });
app.use(router);

//Socket Connection
io.on('connection',(socket)=>{
  console.log("We have a new connection!!!");
  socket.on('join',({name,room},callback)=>{   //This is an event listener of emitted event from client side 
   
    
    const {error,user}=addUser({id:socket.id,name,room});

    if(error) return callback(error);
    
    
    socket.emit('message',{user:'admin',text:`${user.name},welcome to the room ${user.name}`});//When user has been joined this message will come up
    socket.broadcast.to(user.room).emit('message',{user:'admin' , text:`${user.name},has joined!`});//Letting everybody knows that user joined

    //If not an error
   
    socket.join(user.room);//Now user is inside the room

    callback();//If there are no errors
  });

  //Events for user generated messages
  socket.on('sendMessage' , (message,callback)=>{

    const user=getUser(socket.id);
    
    if (!user) {
      console.error(`User not found for socket ID: ${socket.id}`);
      return callback({ error: 'User not found' });
  }

      io.to(user.room).emit('message',{user:user.name , text:message});
    
    
    callback();
  });

  socket.on('disconnect',()=>{
    
    const user=removeUser(socket.id);
    console.log(user);
    if(user){
      io.to(user.room).emit('message',{user:"admin",text:`${user.name} has left!!`});
    }
    console.log("User has left");
  })
});


server.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`);
})
