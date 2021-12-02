const socket = io();

const welcomeDiv = document.getElementById("welcome");
const welcomeForm = welcomeDiv.querySelector("#enterRoom");
const roomDiv = document.getElementById("room");
const nameForm = welcomeDiv.querySelector("#nick");

let roomName;

roomDiv.hidden = true;


function showRoom(cnt) {
    welcomeDiv.hidden = true;
    roomDiv.hidden = false;
    const h3 = roomDiv.querySelector("h3");
    h3.innerText = `Room [${roomName}] (${cnt})`;

    const messageForm = roomDiv.querySelector("#msg");
    messageForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();

    if(nameForm.querySelector("input").value == "") {
        alert("Please Write the NickName");
        return;
    }

    const input = welcomeForm.querySelector("input");
    socket.emit("enterRoom", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = roomDiv.querySelector("#msg input");
    const inputValue = input.value;
    socket.emit("newMessage", roomName, inputValue, () => {
        addMessage(`Me : ${inputValue}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = welcomeDiv.querySelector("#nick input");
    const inputValue = input.value;

    socket.emit("nickname", inputValue);
}

function addMessage(message) {
    const ul = roomDiv.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

welcomeForm.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);


socket.on("welcome", (user, count) => {
    const h3 = roomDiv.querySelector("h3");
    h3.innerText = `Room [${roomName}] (${count})`;
    addMessage(`${user} joined!`);
});

socket.on("bye", (user, count) => {
    const h3 = roomDiv.querySelector("h3");
    h3.innerText = `Room [${roomName}] (${count})`;
    addMessage(`${user} left`);
});

socket.on("newMessage", addMessage);

socket.on("roomChange", (rooms) => {
    const roomList = welcomeDiv.querySelector("ul");
    roomList.innerHTML = "";

    if(rooms.length === 0) {
        return;
    }

    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
})