const videoGrid = document.getElementById("video-grid");
const video = document.createElement("video");
video.muted = true;

let streamVideo;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    streamVideo = stream;
    addVideoStream(video, stream);
  });

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
