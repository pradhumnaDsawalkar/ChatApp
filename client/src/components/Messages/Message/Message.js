import React from "react";
import ReactEmoji from 'react-emoji';
import './Message.css';

const Message=({message:{text,user},name})=>{
   let isSentByCurrentUser=false;

   const trimmedName=name.trim().toLowerCase();

   if(user===trimmedName){
    isSentByCurrentUser=true;
   }
   console.log(isSentByCurrentUser);
   return (
    isSentByCurrentUser
    ?(
      <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
      </div>
    )
    //here
    :(
        <div className="messageContainer justifyStart">
        <div className="messageBox backgroundLight">
          <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
        </div>
        <p className="sentText pl-10">{user}</p>
        </div>
    )
    //her
   );
}

export default Message;