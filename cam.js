let cams = new Vue({
  el: '.videos',
  data: {
    images: []
  }
})

let videoDefaultConstraintString = '{"frameRate": 30}';
let audioDefaultConstraintString = '{\n  "sampleSize": 16,\n  "channelCount": 2,\n  "echoCancellation": false\n}';
let videoConstraints = null;
let audioConstraints = null;

let audioTrack = null;
let videoTrack = null;
let videoElement = document.getElementById("video");

let supportedConstraintList = document.getElementById("supportedConstraints");

videoConstraints = JSON.parse(videoDefaultConstraintString);
audioConstraints = JSON.parse(audioDefaultConstraintString);

function startVideo() {
  navigator.mediaDevices.getUserMedia({
    video: videoConstraints,
    audio: audioConstraints
  }).then(function(stream) {
    let audioTracks = stream.getAudioTracks();
    let videoTracks = stream.getVideoTracks();
    
    videoElement.srcObject = stream;
    if (audioTracks.length) {
        audioTrack = audioTracks[0];
    }
    if (videoTracks.length) {
        videoTrack = videoTracks[0];
    }
  })
}



const ws = new WebSocket('ws://' + location.hostname + ':3001')
ws.onopen = function(){
  let name = prompt('Ваше имя?', 'Кто-то')
  ws.send(name)

  var video = document.getElementById('video');
  var errBack = function(e) {
    console.log('An error has occurred!', e);
  };
  setInterval(() => {
    var thecanvas = document.getElementById('thecanvas');
    var thecontext = thecanvas.getContext('2d');
    thecontext.drawImage(video, 0, 0, 640, 480);
    // get the image data from the canvas object
    var dataURL = thecanvas.toDataURL();
    ws.send(JSON.stringify(dataURL))
  }, 100)

  let l = false

  ws.onmessage = function (e) {
    if (!l){
      l = true;
      console.log(e.data);
    }
    cams.images = JSON.parse(e.data)
  }

  startVideo()
}
