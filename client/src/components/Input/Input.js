import React from "react";
import './Input.css';

const Input=({message,setMessage,sendMessage,handleKeyDown})=>(
    <form className="form">
    <input 
    className="input"
    type="text"
    placeholder="Type a message..."
    value={message} 
    onChange={(event)=>{setMessage(event.target.value)} }
    onKeyDown={handleKeyDown} />
    
    <button className="sendButton" onClick={e=>sendMessage(e)}>Send</button>
   
     </form>
)

export default Input;