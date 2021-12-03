import http from "http";
import SocketIO from "socket.io";
import express from "express";

/*
 * [WebRTC]
 * - peer to peer 연결
 * - 서버를 지나가지 않고 비디오, 텍스트, 오디오 등 데이터를 직접 전달

 * 1) 브라우저가 서버에 본인의 configuration, setting, location 등 정보를 먼저 전달.
 * 2) 서버는 받은 정보를 다른 브라우저에 전달.
 * 3) 위의 signalling 이 끝나면 peer to peer 연결 가능.
 */

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("joinRoom", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (roomName, offer) => {
        socket.to(roomName).emit("offer", offer);
    });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);