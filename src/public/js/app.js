const socket = new WebSocket(`ws://${window.location.host}`);

const messageForm = document.querySelector("#message")
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");

socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from the Server");
});

function makeMessage(type, payload) {
    const msg = {type, payload};

    return JSON.stringify(msg);
}

function handleSubmit(event) {
    event.preventDefault();
    
    const input = messageForm.querySelector("input");
    const inputValue = input.value;
    socket.send(makeMessage("new_message", inputValue));

    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    
    const input = nickForm.querySelector("input");
    const inputValue = input.value;
    socket.send(makeMessage("nickname", inputValue));

    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);