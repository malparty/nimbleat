import bassSubDub2 from './samples/wave-tables/Bass';

export const DEFAULT_SELECTOR = '.synth-voice';

const CLASS_NAMES = {
  attack: '.synth-voice__attack',
  sustain: '.synth-voice__sustain',
  release: '.synth-voice__release',
  freq: '.synth-voice__freq',
  playBtn: '.synth-voice__play-btn'
};

const DEFAULTS = {
  attackTime: 0.1,
  sustainTime: 0.4,
  releaseTime: 0.2,
  freqValue: 180
};

const template = document.createElement('template');
template.innerHTML = `
  <div class="m-4">
    <label for="attack">Attack</label>
    <input name="attack" disabled class="synth-voice__attack" type="range" min="0" max="1" value="${DEFAULTS.attackTime}" step="0.05" />

    <label for="sustain">Sustain</label>
    <input name="sustain" disabled class="synth-voice__sustain" type="range" min="0" max="10" value="${DEFAULTS.sustainTime}" step="0.5" />

    <label for="release">Release</label>
    <input name="release" disabled class="synth-voice__release" type="range" min="0" max="1" value="${DEFAULTS.releaseTime}" step="0.05" />

    <label for="freq">Frequency</label>
    <input name="freq" disabled class="synth-voice__freq" type="range" min="20" max="360" value="${DEFAULTS.freqValue}" step="2" />
  </div>
  <div class="m-4">
    <button name="play_btn" disabled class="synth-voice__play-btn btn btn-primary" type="button">Play!</button>
  </div>
`;

class SynthVoice {
  constructor(elementRef) {
    this.synthVoice = elementRef;

    // Insert HTML content from template
    this.synthVoice.appendChild(template.content.cloneNode(true));

    this.attack = this.synthVoice.querySelector(CLASS_NAMES.attack) ?? new Element();
    this.sustain = this.synthVoice.querySelector(CLASS_NAMES.sustain) ?? new Element();
    this.release = this.synthVoice.querySelector(CLASS_NAMES.release) ?? new Element();
    this.playBtn = this.synthVoice.querySelector(CLASS_NAMES.playBtn) ?? new Element();
    this.freq = this.synthVoice.querySelector(CLASS_NAMES.freq) ?? new Element();

    this._bind();
    this._setup();
    this._addEventListeners();
  }

  // Event Handlers

  onAttackChanged(ev) {
    this.attackTime = parseFloat(ev.target.value);
    console.log('Attack: ', this.attackTime);
  }

  onSustainChanged(ev) {
    this.sustainTime = parseFloat(ev.target.value);
    console.log('Sustain: ', this.sustainTime);
  }

  onReleaseChanged(ev) {
    this.releaseTime = parseFloat(ev.target.value);
    console.log('Release: ', this.releaseTime);
  }

  onFreqChanged(ev) {
    this.freqValue = parseFloat(ev.target.value);
    console.log('Freq: ', this.releaseTime);
  }

  onPlayBtnClicked() {
    this._playNimbleat();
  }

  // Object interface for external usage

  /**
   * @param {*} start: true is a start is needed, false if a stop is needed
   */
  toggleNimbleat(start) {
    start ? this._startNimbleat() : this._stopNimbleat();
  }

  /**
   * Trigger a Play button action
   * @param {*} freq: optionally set the frequency of the note to be played
   */
  play(freq = -1) {
    if (freq > 0) {
      this._setFreq(freq);
    }
    this._playNimbleat();
  }

  // Private

  _bind() {
    this.onPlayBtnClicked = this.onPlayBtnClicked.bind(this);
    this.onAttackChanged = this.onAttackChanged.bind(this);
    this.onSustainChanged = this.onSustainChanged.bind(this);
    this.onReleaseChanged = this.onReleaseChanged.bind(this);
    this.onFreqChanged = this.onFreqChanged.bind(this);

    this.toggleNimbleat = this.toggleNimbleat.bind(this);
  }

  _setup() {
    this.attackTime = DEFAULTS.attackTime;
    this.sustainTime = DEFAULTS.sustainTime;
    this.releaseTime = DEFAULTS.releaseTime;
    this.freqValue = DEFAULTS.FreqValue;
  }

  _addEventListeners() {
    this.playBtn.addEventListener('click', this.onPlayBtnClicked);

    this.attack.addEventListener('change', this.onAttackChanged);
    this.sustain.addEventListener('change', this.onSustainChanged);
    this.release.addEventListener('change', this.onReleaseChanged);
    this.freq.addEventListener('change', this.onFreqChanged);
  }

  _stopNimbleat() {
    this.playBtn.disabled = true;

    this.attack.disabled = true;
    this.release.disabled = true;
    this.sustain.disabled = true;
    this.freq.disabled = true;
  }

  _startNimbleat() {
    this.playBtn.disabled = false;

    this.attack.disabled = false;
    this.release.disabled = false;
    this.sustain.disabled = false;
    this.freq.disabled = false;
  }

  _setFreq(freq) {
    this.freqValue = freq;
    this.freq.value = freq;
  }

  _playNimbleat() {
    const audioCtx = new AudioContext();

    const wave = new PeriodicWave(audioCtx, {
      real: bassSubDub2.real,
      imag: bassSubDub2.imag
    });

    const time = 0; // Delay before playing the sound
    const osc = new OscillatorNode(audioCtx, {
      frequency: this.freqValue,
      type: 'custom',
      periodicWave: wave
    });

    const sweepEnv = new GainNode(audioCtx);
    sweepEnv.gain.cancelScheduledValues(time);
    sweepEnv.gain.setValueAtTime(0, time);
    sweepEnv.gain.linearRampToValueAtTime(1, time + (this.attackTime ?? 0));
    sweepEnv.gain.linearRampToValueAtTime(0, time + (this.sustainTime ?? 0) - (this.releaseTime ?? 0));

    osc.connect(sweepEnv).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + (this.sustainTime ?? 0));
  }
}

export default SynthVoice;
