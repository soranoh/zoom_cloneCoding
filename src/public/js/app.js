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
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("enterRoom", input.value, showRoom);
    roomName = input.value;
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