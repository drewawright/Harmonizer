//for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

//connect audio element to context
const audioElement = document.querySelector('audio');

const track = audioContext.createMediaElementSource(audioElement);

//gain node handles volume
const gainNode = audioContext.createGain();

//stereo panning
const pannerOptions = { pan: 0 };
const panner = new StereoPannerNode(audioContext, pannerOptions);

track.connect(gainNode).connect(panner).connect(audioContext.destination);

//volume button handling
const volumeControl = document.querySelector('#volume');
volumeControl.addEventListener('input', function() {
    gainNode.gain.value = this.value;
}, false);

//panner button handling 
const pannerControl = document.querySelector('#panner');
pannerControl.addEventListener('input', function() {
    panner.pan.value = this.value;
}, false);

//play button handling
const playButton = document.querySelector('button');
playButton.addEventListener('click', function() {

    //check if context is in a suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    //play/pause depending on state 
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
    }
}, false);

audioElement.addEventListener('ended', () => {
    playButton.dataset.playing = 'false';
}, false);