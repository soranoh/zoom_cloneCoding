const socket = new WebSocket(`ws://${window.location.host}`);

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
    console.log(message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from the Server");
});

function handleSubmit(event) {
    event.preventDefault();
    
    const input = messageForm.querySelector("input");
    const inputValue = input.value;
    socket.send(inputValue);

    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);