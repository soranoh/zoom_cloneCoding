const socket = io();

const welcomeDiv = document.getElementById("welcome");
const welcomeForm = welcomeDiv.querySelector("form");
const roomDiv = document.getElementById("room");

let roomName;

roomDiv.hidden = true;


function showRoom() {
    welcomeDiv.hidden = true;
    roomDiv.hidden = false;
    const h3 = roomDiv.querySelector("h3");
    h3.innerText = `Room [${roomName}]`;

    const roomForm = roomDiv.querySelector("form");
    roomForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("enterRoom", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = roomDiv.querySelector("input");
    const inputValue = input.value;
    socket.emit("new_message", roomName, inputValue, () => {
        addMessage(`Me : ${inputValue}`);
    });
    input.value = "";
}

function addMessage(message) {
    const ul = roomDiv.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

welcomeForm.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", () => {
    addMessage("Someone joined!");
});

socket.on("bye", () => {
    addMessage("Someone left");
});

socket.on("new_message", addMessage);