const socket = io('/');
const peer = newPeer(undefined, {
    host: '/',
    port: '3001'
})

peers = {}

videoGrid = document.getElementsByClassName('video-grid')[0]

const myVideo = document.createElement('video');

myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {

})

function addDevice(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}