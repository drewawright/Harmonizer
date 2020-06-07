const Tone = require('tone');
const PitchFinder = require('pitchfinder').default;
const detectPitch = PitchFinder.AMDF();

const player = document.getElementById('player');

const synth = new Tone.Synth().toDestination();

const handleSuccess = function (stream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function (event) {
        const float32Array = event.inputBuffer.getChannelData(0);
        var pitch = detectPitch(float32Array);
        // let frequencies = PitchFinder.frequencies(detectPitch, float32Array, {
        //     tempo: 120, //bpm
        //     quantization: 4, //samples/beat 
        // });
        console.log(frequencies);
        synth.triggerAttackRelease(pitch, "1m");
    }

};

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess);

const playButton = document.querySelector('#start');
playButton.addEventListener('click', function () {

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


// navigator.permissions.query({ name: 'microphone' }).then(function (result) {
//     if (result.state == 'granted') {
//         console.log('allowed');
//         return;
//     } else if (result.state == 'prompt') {

//     } else if (result.state == 'denied') {
//         showEnableMicButton();
//     }
//     result.onchange = function () {

//     }
// });

// showEnableMicButton = () => {
//     navigator.permissions.query({ name: 'microphone' });
// }