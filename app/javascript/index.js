import bassSubDub2 from './samples/wave-tables/Bass';

let attackControl;
let releaseControl;
let sustainControl;
let playButton;
let startToggle;

let attackTime = 0.2;
let releaseTime = 0.5;
let sustainTime = 2 + releaseTime;
let audioCtx;
let wave;

document.addEventListener('DOMContentLoaded', function () {
  attackControl = document.querySelector('#attack');
  releaseControl = document.querySelector('#release');
  sustainControl = document.querySelector('#sustain');
  playButton = document.querySelector('#play_btn');
  startToggle = document.querySelector('#start_toggle');
  console.log('Init: ', startToggle);
  startToggle.addEventListener('change', toggleNimbleat, false);
  playButton.addEventListener('click', playNimbleat, false);

  attackControl.addEventListener(
    'input',
    (ev) => {
      attackTime = parseFloat(ev.target.value);
      console.log('Attack: ', attackTime);
    },
    false
  );

  releaseControl.addEventListener(
    'input',
    (ev) => {
      releaseTime = 1 - parseFloat(ev.target.value);
      console.log('Release: ', releaseTime);
    },
    false
  );

  sustainControl.addEventListener(
    'input',
    (ev) => {
      sustainTime = parseFloat(ev.target.value) + releaseTime;
      console.log('Sustain: ', sustainTime);
    },
    false
  );
});

const toggleNimbleat = () => {
  console.log('Toggle Nimbleat!');
  startToggle.checked ? startNimbleat() : stopNimbleat();
};

const stopNimbleat = () => {
  playButton.disabled = true;
  attackControl.disabled = true;
  releaseControl.disabled = true;
  sustainControl.disabled = true;
};

const startNimbleat = () => {
  playButton.disabled = false;
  attackControl.disabled = false;
  releaseControl.disabled = false;
  sustainControl.disabled = false;
};

const playNimbleat = () => {
  audioCtx = new AudioContext();

  wave = new PeriodicWave(audioCtx, {
    real: bassSubDub2.real,
    imag: bassSubDub2.imag
  });

  console.log('START!', wave);

  const time = 0; // Delay before playing the sound
  const osc = new OscillatorNode(audioCtx, {
    frequency: 180,
    type: 'custom',
    periodicWave: wave
  });

  const sweepEnv = new GainNode(audioCtx);
  sweepEnv.gain.cancelScheduledValues(time);
  sweepEnv.gain.setValueAtTime(0, time);
  sweepEnv.gain.linearRampToValueAtTime(1, time + attackTime);
  sweepEnv.gain.linearRampToValueAtTime(0, time + sustainTime - releaseTime);

  osc.connect(sweepEnv).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + sustainTime);
};
