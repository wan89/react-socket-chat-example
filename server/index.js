const express = require('express')
const app = express();
const http = require('http');
const {Server} = require('socket.io')
const server = http.createServer(app);

const cors = require('cors')
const router = require('./router')

const PORT = process.env.PORT || 3002

app.use(cors());
app.use(router);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    }
});

const MAX_ROOM_PERSON = 2;

const publicRooms = () => {
    const {
        sockets: {
            adapter: {
                sids, rooms
            }
        }
    } = io;
    const publicRooms = [];

    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            let _a = 0;
            if(io.sockets.adapter.rooms){
                _a = io.sockets.adapter.rooms.get(key).size
            }
            publicRooms.push([key,`(${_a}/${MAX_ROOM_PERSON})`]);
        }
    });

    return publicRooms;
}

io.on('connection', (socket) => {
    let c_name = "알수없음";
    let c_room = '';
    
    socket.on('join', ({name, room}, callback) => {
        const personRoom = io.sockets.adapter.rooms.get(room);
        if(personRoom && (personRoom.size > 1)){
            console.log("!");
            callback("풀방입니다!")
        } else {
            socket.join(room);
            c_name = name;
            c_room = room;

            console.log('================ join ====================');
            console.log('================ ------------- ====================');

            socket.to(room).emit("join_msg", {type:"join", name:'admin', message:`~ ${name}님이 ${room}에 입장하셨습니다 ~`});
            socket.broadcast.emit("make_room", {list:publicRooms()});
        }
    });

    socket.on('check_room', (callback) => {
        callback({list:publicRooms()});
    });

    socket.on('send_message', (data)=>{
        console.log(data);
        data.type = "msg"

        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnecting", ({room}) => {
        const personRoom = io.sockets.adapter.rooms.get(room);
        socket.to(c_room).emit("join_msg", {type:"join", name:'admin', message:`~ ${c_name}님이 퇴장하셨습니다 ~`});
        console.log('================ disconnecting ====================');
        socket.broadcast.emit("make_room", {list:publicRooms()});
    });

});

server.listen(PORT,()=>console.log(`server start port:${PORT}`))