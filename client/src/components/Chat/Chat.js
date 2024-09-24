import React, {useState,useEffect} from "react";
import { useLocation } from "react-router-dom";//To take the location of url
import queryString from 'query-string';//Used to retriving the data from the url 
import io from 'socket.io-client';
import './Chat.css';
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

let socket;

const Chat=()=>{
 
    const location=useLocation(); //calling the useLocation
    const [name,setName]=useState('');
    const [room,setRoom]=useState('');
    const [message,setMessage]=useState('');
    const [messages,setMessages]=useState([]);

    const ENDPOINT='chat-app-khaki-nu.vercel.app';

    useEffect(()=>{
        const {name,room}=queryString.parse(location.search); //Converting the url into object format

        setName(name);
        setRoom(room);

        socket=io(ENDPOINT); //Connecting with the backend
    
        socket.emit('join',{name,room},()=>{    //This is for emiting the event when user has joined
           
        });

       return ()=>{
        socket.emit('disconnect');//Emiting the disconnection

        socket.off();
       }
    },[ENDPOINT,location.search]/*This second parameter is for executing the above function only if ENDPOINT and location.search has been changed*/);
   
    //For Handling messages
    useEffect(()=>{
      socket.on('message',(message)=>{
        setMessages([...messages,message]);
      })
    },[messages])

    //Function for sending the message
    const sendMessage=(event)=>{

        event.preventDefault();

       if(message){
        socket.emit('sendMessage',message,()=>setMessage(''));
       }
    }

    const handleKeyDown = (event) => {

        if (event.key === 'Enter') {
          sendMessage(event);
        }
      };

  console.log(message,messages);

    return (
        <div className="outerContainer">
            <div className="container">
            <InfoBar room={room}/>
            <Messages messages={messages} name={name}/>
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} handleKeyDown={handleKeyDown}/>
            </div>
        </div>
    )
}

export default Chat;
