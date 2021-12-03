const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const callDiv = document.getElementById("call");

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

callDiv.hidden = true;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const curCamera = myStream.getVideoTracks()[0];
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(curCamera.label === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);

            muteBtn.innerText = "Mute";
            muted = false;

            cameraBtn.innerText = "Turn Camera Off";
            cameraOff = false;
        });
    } catch(error) {
        console.log(error);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio: true,
        video: {
            facingMode: "user"
        }
    };
    const cameraConstraints = {
        audio: true,
        video: {
            deviceId: {
                exact: deviceId
            }
        }
    };

    try {
        myStream = await navigator.mediaDevices.getUserMedia(deviceId?cameraConstraints:initialConstrains);
        myFace.srcObject = myStream;
        if(!deviceId) {
            await getCameras();
        }
    } catch(error) {
        console.log(error);
    }
}

function handleMuteClick() {
    myStream
        .getAudioTracks()
        .forEach((track) => (
        track.enabled = !track.enabled));

    if(!muted) {
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick() {
    myStream
        .getVideoTracks()
        .forEach((track) => (
            track.enabled = !track.enabled));
    if(cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);


// ###################################
// ######## Welcome Form Area ########
// ###################################

const welcomeDiv = document.getElementById("welcome");
const welcomeForm = welcomeDiv.querySelector("form");

async function initCall() {
    welcomeDiv.hidden = true;
    callDiv.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    roomName = input.value;
    await initCall();
    socket.emit("joinRoom", roomName);
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);


// ###################################
// ######## Socket Code Area #########
// ###################################

socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("Send the Offer");
    socket.emit("offer", roomName, offer);
});

socket.on("offer", async (offer) => {
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    console.log("Send the Answer");
    socket.emit("answer", roomName, answer);
    
});

socket.on("answer", (answer) => {
    myPeerConnection.setRemoteDescription(answer);
});


// ###################################
// ######### RTC Code Area ###########
// ###################################

function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myStream
        .getTracks()
        .forEach((track) => 
        myPeerConnection.addTrack(track, myStream));

}