const moduleScript =
class IntervalProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        input.foreach(inp => console.log(`input: ${inp}`));
        output.foreach(out => console.log(`output: ${out}`));
    }
}

registerProcessor('interval-processor', IntervalProcessor);

const scriptUrl = URL.createObjectURL(new Blob([moduleScript], {type: "text/javascript"}));

const Tone = require('tone');
// const PitchFinder = require('pitchfinder').default;
// const detectPitch = PitchFinder.AMDF();

const player = document.getElementById('player');

const synth = new Tone.Synth().toDestination();
const context = new AudioContext();
const analyzerNode = new AnalyserNode(context, { fftSize: 1024 });
context.audioWorklet.addModule(scriptUrl).then(() => {
    const input = getAudioInput();
    if(context.state === 'suspended') {
        context.resume();
    }
    const intervalNode = new AudioWorkletNode(context, 'interval-processor');
    const source = context.createMediaStreamSource(input);

    source
        .connect(analyzerNode)
        .connect(intervalNode)
        .connect(context.destination);
});
function getAudioInput() {
    navigator.mediaDevices.getUserMedia({ 
        audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
            latency: 0
        }
    });
}

function playInterval() {
    const dataArray = new Float32Array(context.fftSize);
    analyzerNode.getFloatTimeDomainData(dataArray);
}

const playButton = document.querySelector('#start');
playButton.addEventListener('click', function () {

    //check if context is in a suspended state (autoplay policy)
    if (context.state === 'suspended') {
        context.resume();
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