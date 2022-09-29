import * as waveTables from '../components/synthVoice/samples/wave-tables';
import Scales from '../utilities/scales';

const AudioContext = window.AudioContext || window.webkitAudioContext;

const ATTACK = 0.1;
const DECAY = 0.3;
const RELEASE = 0.3;

const GAIN_OFF = 0;
const GAIN_ON = 0.5;

class WaveTableEngine {
  constructor() {
    this.name = 'Wave Table';
    this.audioCtx = new AudioContext();

    this.attack = ATTACK;
    this.decay = DECAY;
    this.release = RELEASE;
    this.scale = Scales['chromatic3'];

    this.instrumentIndex = 0;
    this._setInstrumentFromIndex();
  }

  onPadPressed(padIndex) {
    this._playNote(this.scale[padIndex]);
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
    this.instrument = this.waveTableKey; // Name to display

    const waveTable = waveTables[this.waveTableKey];
    this.attack = waveTable.a;
    this.decay = waveTable.d;
    this.release = waveTable.r;
    if (Scales[waveTable.scale_ref]) {
      this.scale = Scales[waveTable.scale_ref]
    }

    this.wave = new PeriodicWave(this.audioCtx, {
      real: waveTable.real,
      imag: waveTable.imag
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
    sweepEnv.gain.linearRampToValueAtTime(GAIN_ON, time + this.attack);
    sweepEnv.gain.linearRampToValueAtTime(GAIN_OFF, time + this.attack + this.decay + this.release);

    osc.connect(sweepEnv).connect(this.audioCtx.destination);
    osc.start(time); // Starts now
    osc.stop(time + this.attack + this.decay + this.release);
  }
}

export default WaveTableEngine;
