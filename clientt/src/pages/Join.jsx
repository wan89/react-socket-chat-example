import React, {useState} from 'react';
import {Link} from "react-router-dom";
import { styled } from 'styled-components';
import Swal from 'sweetalert2';

const JoinOutter = styled.div`
  width: 100%; height: 100%; background-color: #eee; margin: 0; padding: 0;
`;
const JoinSelectBox = styled.div`
  width: 100%; height: 50%; display: flex; justify-content:center; align-items: center; flex-direction: column;
  border-bottom: 2px solid #888;
`;

const Input = styled.input`
  padding: 10px; margin-bottom: 5px; width: 200px; box-sizing: border-box;
`;
const Button = styled.button`
  padding: 10px; width: 200px; background-color: white; border: 1px solid #888; border-radius: 5px; box-shadow: -2px -2px 5px 0 rgba(0,0,0,.1) inset;
`

function Join() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const onMasterRoomListHandler = (e) => {
    window.location.href = `/chat-master`;
  }
  const onClickHandler = (e) => {
    if(!name || !room){
      const text = (!room)? "방을 입력해주세요" : "이름을 입력해주세요";
      Swal.fire({
        icon: 'error',        
        text: text,
      })
      return;
    }
    window.location.href = `/chat?name=${name}&room=${room}`;
  }

  return (
    <JoinOutter>
      <JoinSelectBox>
        <h1 className='heading'></h1>
        <div>
          <Input
            placeholder='이름'
            className='joinInput'
            type='text'
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder='채팅방'
            className='joinInput mt-20'
            type='text'
            value={room}
            onChange={(event) => setRoom(event.target.value)}
          />
        </div>
          <Button className={'button mt-20'} onClick={onClickHandler} type='submit'>
            클라이언트로 참여 
          </Button>
      </JoinSelectBox>
      <JoinSelectBox>
        <Button className={'button mt-20'} onClick={onMasterRoomListHandler} type='submit'>
          마스터로 참여 
        </Button>
      </JoinSelectBox>
    </JoinOutter>
  );
}

export default Join;