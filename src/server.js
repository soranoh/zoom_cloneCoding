import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocketServer({server});

const sockets = [];

wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    sockets.push(socket);
    socket["nickname"] = "Anon";
    socket.on("close", () => {
        console.log("Disconnected from the Browser");
    });
    socket.on("message", (msg) => {
        const message = JSON.parse(msg.toString());

        switch(message.type) {
            case "new_message":
                sockets.forEach((aSocket) => {
                    aSocket.send(`${socket.nickname} : ${message.payload}`);
                });
            case "nickname":
                socket["nickname"] = message.payload;
        }
    }); 
});

server.listen(3000, handleListen);