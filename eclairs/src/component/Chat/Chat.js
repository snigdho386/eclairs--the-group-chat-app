import React, { useEffect } from 'react'
import socketIo from "socket.io-client"
import {user} from "../Join/Join"
import "./Chat.css"
import sendLogo from "../../images/sendLogo.svg"
import { useState } from 'react'
import Message from "../Message/Message"
import ReactScrollToBottom from 'react-scroll-to-bottom'
import closeIcon from "../../images/closeIcon.svg"

const ENDPOINT="http://localhost:4500";

let socket;
const Chat = () => {
    
  const [id, setid] = useState("")
  const [messages, setMessages]=useState([]);
  const send=()=>{
    const message=document.getElementById('chatInput').value;
    socket.emit('message',{message,id});
    document.getElementById('chatInput').value="";
  }
    
    useEffect(() => {
     socket=socketIo(ENDPOINT,{transports:['websocket']});
      
      socket.on('connect',()=>{
      alert("connected");
      setid(socket.id);
      })
      
      socket.emit('joined',{user});
      socket.on('welcome',(data)=>{
        setMessages([...messages,data]);
        console.log(`${data.user} ${data.message}`);
      socket.on('userJoined',(data)=>{
        setMessages([...messages,data]);
        console.log(data.user,data.message)
      })
    });
     
    socket.on('leave',(data)=>{
      setMessages([...messages,data]);
      console.log(data.user,data.message);
    })
    socket.on('disconnect', function(){
      socket.disconnect();
    });
      return () => {
        socket.off();
      }
    }, [])
    useEffect(() => {
        
      socket.on('sendMessage',(data)=>{
        setMessages([...messages,data]);
        console.log(data.user,data.message,data.id);
      })
    
      return () => {
        socket.off()
      }
    }, [messages])
    
    
  return (
    <div className="chatPage">
        <div className="chatContainer">
            <div className="header">
              <h2>eclairs</h2>
              <a className="closeContainer" href="/"><img src={closeIcon} alt="closeIcon" className='closeIcon'/></a>  
            </div>
            <ReactScrollToBottom className="chatBox">
              {
                messages.map((item,i)=><Message user={item.id===id?'':item.user} message={item.message} classs={item.id===id?'right':'left'} />)
              }
            </ReactScrollToBottom>
            <div className="inputBox">
              <input type="text" id="chatInput" />
              <button onClick={send} className="sendBtn"><img src={sendLogo} alt="sendlogo"/></button>
            </div>
        </div>
    </div>
  )
}

export default Chat
