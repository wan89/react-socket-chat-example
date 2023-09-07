import React, { useRef, useEffect, useState } from 'react'
import * as io from 'socket.io-client';
import queryString from 'query-string';
import { styled, keyframes } from 'styled-components';
import _ from 'lodash';

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

const ChatList = styled.div`
  flex-direction:column; margin-top: 100px;

  & > div { 
    width:100%; background-color:#eee; margin:5px 0; display:flex; cursor: pointer; padding: 20px; align-items: center;
    box-sizing:border-box;
  }
  & > div> a { font-size:11px; color:#333; margin-left:10px;}
  & > div:hover { background-color:#aaa}
`;

function App() {
  const socket = io.connect(ENDPOINT);
  const [msgRecive, setMsgRecive] = useState([]);
  const [size, setSize] = useState("");
  const [isInit, setIsInit] = useState(false);
  const joinRoom = (room)=> {
    window.location.href = `/chat?name=master&room=${room}`;
  }

  useEffect(()=>{
    if(socket){
      socket.on("make_room",(data)=>{
        // console.log(data.list);
        // // console.log(data, msgRecive);
        setMsgRecive(data.list);
        // console.log(_.unionBy(msgRecive, [data],"room"))
      });
    } 
  }, [socket]);
  if(!isInit){
    socket.emit("check_room",(listData)=>{
      setMsgRecive(listData.list);
    });
    setIsInit(true);
  }

  return (
    <ChatList>
      <span>현재 방갯수: {msgRecive.length}</span>
      {/* {msgRecive} */}
      {msgRecive.map((item,idx)=>{
          return <div onClick={(e)=>joinRoom(item[0])} key={idx}>
            {item[0]} <a>{item[1]}</a>
          </div>
        })}
    </ChatList>
  );
}

export default App;