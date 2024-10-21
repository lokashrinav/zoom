const socket = io('/');
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

peers = {}


const videoGrid = document.getElementsByClassName('video-grid')[0]

const myVideo = document.createElement('video');

myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    addDevice(myVideo, stream)
    myPeer.on('call', call => {
        call.answer(stream);
        const vid = document.createElement('video');
        call.on('stream', userVideoStream => {  
            addDevice(vid, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})
  
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const vid = document.createElement('video');
    call.on('stream', userVideoStream => {  
        addDevice(vid, userVideoStream)
    })
    call.on('close', () => {
        vid.remove()
    })
    peers[userId] = call
}

function addDevice(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}