const http=require("http");
const express=require("express");
const cors=require("cors");
const socketIO=require("socket.io");


const app=express();
app.use(cors());
const port=4500 || process.env.PORT;
let users=[];

app.get("/",(req,res)=>{
    res.send("Hi");
})
const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{
    
    console.log("New Connection")
    
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        //console.log("debugger",socket.id);
        console.log(`${user} has joined`);
        //console.log("deb",users[socket.id]);
        socket.broadcast.emit('userJoined',{user:"Admin",message: ` ${users[socket.id]} has joined ` });    
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat ${users[socket.id]}`});

    })
    
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    })
   
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`});
        console.log("user left");
    })

})

server.listen(port,()=>{
    console.log(`Server is working on port http://localhost:${port}`);
}) 