import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
import Join from "./pages/Join";

import './App.css';
import { styled } from 'styled-components';

const NaviBar = styled.div`
  width:100%; height:50px; background-color: black; display: flex; padding: 10px; box-sizing: border-box;
  position: fixed; top:0; z-index: 10;
`;

const Container = styled.div`
  width:100%; display: flex; height: 100%; flex-direction: column;
`
function App() {
  const backHandler = (e) => {
    window.location.href = '/';
  };
  return (
    <BrowserRouter>
      <Container>
        <NaviBar>
          <button onClick={backHandler}>뒤로가기</button>
        </NaviBar>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat-master" element={<ChatList />} />
          <Route path="/" element={<Join />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;