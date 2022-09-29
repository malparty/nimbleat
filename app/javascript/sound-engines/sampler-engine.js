import pad from "../components/pad";

const AudioContext = window.AudioContext || window.webkitAudioContext;

class SamplerEngine {
  currentInstrumentIndex = -1;
  instruments = [
    {
      name: 'Piano',
      path: 'assets/samples/piano.wav',
      notes: [
          0.5,
          0.5297315471796477,
          0.5612310241546865,
          0.5946035575013605,
          0.6299605249474366,
          0.6674199270850172,
          0.7071067811865475,
          0.7491535384383408,
          0.7937005259840998,
          0.8408964152537145,
          0.8908987181403393,
          0.9438743126816935,
          1,
          1.0594630943592953,
          1.122462048309373,
          1.189207115002721
      ]
    },
    {
      name: 'Drum',
      path: 'assets/samples/drum.wav',
      notes: [
          0.648753483378567,
          0.8872391281938086,
          0.8377706277861718,
          0.20058747066497518,
          0.7595364714691509,
          0.41292765331393355,
          0.16368335704705816,
          0.2866675241475969,
          0.5827108226448647,
          0.8296798932132193,
          0.7262658923996318,
          0.22449944845737235,
          0.36759952120400285,
          0.2701218862085173,
          0.6156971702742619,
          0.46179558706986545
      ]
    },
    {
      name: 'Goat Scream',
      path: 'assets/samples/goat-scream.mp3',
      notes: [
          0.5,
          0.5297315471796477,
          0.5612310241546865,
          0.5946035575013605,
          0.6299605249474366,
          0.6674199270850172,
          0.7071067811865475,
          0.7491535384383408,
          0.7937005259840998,
          0.8408964152537145,
          0.8908987181403393,
          0.9438743126816935,
          1,
          1.0594630943592953,
          1.122462048309373,
          1.189207115002721
      ]
    },
  ];

  get currentInstrument() {
    return this.instruments[this.currentInstrumentIndex];
  }

  constructor() {
    this.name = 'Sampler';
    this.audioCtx = new AudioContext();
    this.changeInstrument();
  }

  onPadPressed(padIndex) {
    if (!this.currentInstrument.notes.hasOwnProperty(padIndex)) return;
    this._play(this.currentInstrument.notes[padIndex]);
  }

  changeInstrument() {
    this.currentInstrumentIndex++;
    if (this.currentInstrumentIndex > this.instruments.length - 1) {
      this.currentInstrumentIndex = 0;
    }
    this._loadSample(this.currentInstrument.path).then(
      (sample) => (this.sample = sample)
    );
    this.instrument = this.currentInstrument.name;
  }

  _play(rate) {
    if (this.sample == null) return;

    const context = this.audioCtx;
    const source = context.createBufferSource();
    const time = context.currentTime;
    source.buffer = this.sample;
    source.playbackRate.value = rate;
    source.connect(context.destination);
    source.start(time);
  }

  async _loadSample(url) {
    const context = this.audioCtx;
    if (context.decodeAudioData.length !== 1) {
      const originalDecodeAudioData = context.decodeAudioData.bind(context);
      context.decodeAudioData = (buffer) =>
        new Promise((resolve, reject) =>
          originalDecodeAudioData(buffer, resolve, reject)
        );
    }

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    return await context.decodeAudioData(buffer);
  }
}

export default SamplerEngine;
