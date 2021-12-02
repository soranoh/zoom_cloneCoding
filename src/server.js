import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms() {
    const {
        sockets: {
            adapter: {sids, rooms}
        }
    } = wsServer;
    /*
     * 위와 같음
    const sids = wsServer.sockets.adapter.sids;
    const rooms = wsServer.sockets.adapter.roosm;
    */
   const publicRooms = [];
   rooms.forEach((_, key) => {
    if(sids.get(key) === undefined) {
        publicRooms.push(key);
    }
   });
   return publicRooms;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", socket.nickname);
        });
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("roomChange", publicRooms());
    });
    socket.on("enterRoom", (roomName, done) => {
        socket.join(roomName);
        done();
        //socket.to(A).emit => A라는 하나의 socket에게만 메세지 전달
        //server.sockets.emit() => 서버에 연결된 모든 socket에게 메세지 전달
        socket.to(roomName).emit("welcome", socket.nickname);
        wsServer.sockets.emit("roomChange", publicRooms());
    });
    socket.on("newMessage", (roomName, message, done) => {
        socket.to(roomName).emit("newMessage", `${socket.nickname} : ${message}`);
        done();
    });
    socket.on("nickname", (nickname) => {
        socket["nickname"] = nickname;
    });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);