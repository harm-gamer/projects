const socket = io("http://192.168.29.45:3000");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startBtn = document.getElementById("startBtn");

let localStream;
let peerConnection;
const roomId = "room1"; // you can make this dynamic later
const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

socket.emit("join", roomId);

startBtn.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  peerConnection = new RTCPeerConnection(servers);
  localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = (event) => (remoteVideo.srcObject = event.streams[0]);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) socket.emit("candidate", event.candidate, roomId);
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit("offer", offer, roomId);
};

socket.on("offer", async (offer) => {
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection(servers);
    peerConnection.ontrack = (event) => (remoteVideo.srcObject = event.streams[0]);
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) socket.emit("candidate", event.candidate, roomId);
    };
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
  }

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomId);
});

socket.on("answer", (answer) => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on("candidate", (candidate) => {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});
