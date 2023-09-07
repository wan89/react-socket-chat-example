import React, { useRef, useEffect, useState } from 'react'
import * as io from 'socket.io-client';
import queryString from 'query-string';
import { styled, keyframes } from 'styled-components';

const ENDPOINT = "http://localhost:3002";
const boxFade = keyframes`
  0% {
    opacity: 0;
    transform:scale(0.5);
  }
  100% {
    opacity: 1;
    transform:scale(1);
  }
`

const ChatBox = styled.div`
  flex-direction:column;

  & > div {height: 100%;}
`;

const JoinMsg = styled.div`
  text-align: center; background-color: inherit; color: red; padding: 0; border: 0 !important; width: 100% !important;
`;

const ViewContainer = styled.div `
  padding: 60px 10px;

  & > div { padding:10px; border:1px solid #eee; margin: 10px 0; animation: ${boxFade} 0.5s ; transform:scale(1); width: 50%;}
  & > div > b { display:block; font-size:12px; color:#666; margin-bottom:5px;}
`;

const MyBobbleBox = styled.div `
  background-color: #d3ff6d;
   position: relative; left: 47%;
`;


const InputContainer = styled.div `
  width:100%; height: 60px !important;
  background-color: #eee; display: flex; position: fixed; bottom: 0;

  & > input { width:80%; padding:20px; box-sizing:border-box;}
  & > button { width:20%;}
`;

function Chat() {
  const socket = io.connect(ENDPOINT);
  const [msgRecive, setMsgRecive] = useState([]);
  const [msg, setMsg] = useState("");

  const [cname, setName] = useState("");
  const [croom, setRoom] = useState("");
  const [isInit, setIsInit] = useState(false);
  

  useEffect(()=>{
    const {name, room} = queryString.parse(window.location.search);
    console.log(name, room);
    setName(name);
    setRoom(room);

    if(!isInit){
      socket.emit("join", { name:name, room:room }, (error)=>{
        alert(error)
        socket.off();
        window.location.href="/";
      });
      setIsInit(true);
    }

    return () => {
      // alert(croom, name)
      // socket.emit('disconnect', {room:croom, name:name});
      // socket.off();
    }
  }, [window.location.search]);

  const sendMsg = ()=>{
    console.log(msg,"!");
    if(msg !== ""){
      socket.emit("send_message", { message: msg, room:croom, name:cname });
      setMsg("");
    }
  };
  const keyDownHandler = (e)=>{
    if(e.key === "Enter") sendMsg();
  }

  useEffect(()=>{
    if(socket){
      socket.on("receive_message",(data)=>{
        console.log(data);
        setMsgRecive(msgRecive => [...msgRecive, {name:data.name, message:data.message, type:data.type}]);
      });
      
      socket.on("join_msg",(data)=>{
        console.log(data);
        setMsgRecive(msgRecive => [...msgRecive, {name:data.name, message:data.message, type:data.type}]);
      });

      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    } 
  }, [socket]);

  return (
    <ChatBox>
      <ViewContainer>
        {cname}님
        {msgRecive.map((item,idx)=>{
          return (
            item.name === cname)? 
            <MyBobbleBox key={idx}><b>{item.name}</b>{item.message}</MyBobbleBox> 
            :(item.type !== "join")? <div key={idx}><b>{item.name}</b>{item.message}</div> : <JoinMsg>{item.message}</JoinMsg>
        })}
      </ViewContainer>
      <InputContainer>
        <input type='text' value={msg} onChange={e=>setMsg(e.target.value)} onKeyUp={keyDownHandler}/>
        <button onClick={sendMsg}>send</button>
      </InputContainer>
    </ChatBox>
  );
}

export default Chat;