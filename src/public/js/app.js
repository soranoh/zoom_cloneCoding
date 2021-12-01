const socket = io();

const welcomeDiv = document.getElementById("welcome");
const welcomeForm = welcomeDiv.querySelector("form");

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("enterRoom", input.value, (msg) => {
        console.log(`The Backend's Message : `, msg);
    });

    input.value = "";
}

welcomeForm.addEventListener("submit", handleRoomSubmit);