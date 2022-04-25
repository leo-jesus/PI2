const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const video = document.createElement("video");
video.muted = true;

const peer = new Peer(undefined, {
  path: "/peerjs",
  port: "443",
  host: "/",
});

let streamVideo;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    streamVideo = stream;
    addVideoStream(video, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userID) => {
      connectToNewUser(userID, stream);
    });

    let text = $("input");

    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val());
        socket.emit("message", text.val());
        text.val("");
      }
    });

    socket.on("createMessage", (message) => {
      $(".messages").append(
        `<li class="message"><b>user</b><br/>${message}</li>`,
        scrollToBottom(),
      );
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userID, stream) => {
  const call = peer.call(userID, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const scrollToBottom = () => {
  let d = $(".main__chat_widow");
  d.scrollTop(d.prop("scrollHeight"));
};

//muta o vídeo
const muteUnmute = () => {
  const enabled = streamVideo.getAudioTracks()[0].enabled;
  if (enabled) {
    streamVideo.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    streamVideo.getAudioTracks()[0].enabled = true;
  }
};

const playStop = () => {
  console.log("object");
  let enabled = streamVideo.getVideoTracks()[0].enabled;
  if (enabled) {
    streamVideo.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    streamVideo.getVideoTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mudo</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Ligar</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Parar Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Ligar Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};
