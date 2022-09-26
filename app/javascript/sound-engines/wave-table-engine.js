import * as waveTables from '../components/synthVoice/samples/wave-tables';

const AudioContext = window.AudioContext || window.webkitAudioContext;

const ATTACK = 0.1;
const DECAY = 0.5;
const RELEASE = 0.2;

const GAIN_OFF = 0;
const GAIN_ON = 1;

const NO_DELAY = 0;

class WaveTableEngine {
  constructor() {
    this.name = 'Wave Table';
    this.audioCtx = new AudioContext();

    this.instrumentIndex = 0;
    this._setInstrumentFromIndex();
  }

  onPadPressed(_padIndex, freq) {
    this._playNote(freq);
  }

  changeInstrument() {
    this.instrumentIndex++;
    if (Object.keys(waveTables).length <= this.instrumentIndex) {
      this.instrumentIndex = 0;
    }
    this._setInstrumentFromIndex();
  }

  // Private

  _bind() {
    this.changeInstrument = this.changeInstrument.bind(this);
    this.onPadPressed = this.onPadPressed.bind(this);
  }

  _setInstrumentFromIndex() {
    this.waveTableKey = Object.keys(waveTables)[this.instrumentIndex];
    this.instrument = this.waveTableKey;

    const real = waveTables[this.waveTableKey].real;
    const imag = waveTables[this.waveTableKey].imag;

    this.wave = new PeriodicWave(this.audioCtx, {
      real: real,
      imag: imag
    });
  }

  _playNote(freq) {
    const osc = new OscillatorNode(this.audioCtx, {
      frequency: freq,
      type: 'custom',
      periodicWave: this.wave
    });

    const time = this.audioCtx.currentTime;
    const sweepEnv = new GainNode(this.audioCtx);
    sweepEnv.gain.cancelScheduledValues(time);
    sweepEnv.gain.setValueAtTime(GAIN_OFF, time);
    sweepEnv.gain.linearRampToValueAtTime(GAIN_ON, time + ATTACK);
    sweepEnv.gain.linearRampToValueAtTime(GAIN_OFF, time + ATTACK + DECAY + RELEASE);

    osc.connect(sweepEnv).connect(this.audioCtx.destination);
    osc.start(time); // Starts now
    osc.stop(time + ATTACK + RELEASE);
  }
}

export default WaveTableEngine;
