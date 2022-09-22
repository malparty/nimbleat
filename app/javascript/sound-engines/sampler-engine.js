class SamplerEngine {
  currentInstrumentIndex = -1;
  instruments = [
    {
      name: 'Piano',
      path: 'assets/sample.wav',
    },
  ];

  constructor() {
    this.name = 'Sampler';
    this.changeInstrument();
    this.audioCtx = new AudioContext();
  }

  onPadPressed(padIndex) {
    console.log(`Pad ${padIndex} pushed from the Sampler engine`);

    // TODO: Play in correct notes
    this._play(padIndex / 15);
  }

  changeInstrument() {
    this.currentInstrumentIndex++;
    if (this.currentInstrumentIndex > this.instruments.length - 1) {
      this.currentInstrumentIndex = 0;
    }
    const instrumentData = this.instruments[this.currentInstrumentIndex];
    this._loadSample(instrumentData.path).then(
      (sample) => (this.sample = sample)
    );
    this.instrument = instrumentData.name;
  }

  _play(rate) {
    if (this.sample == null) return;

    const context = new AudioContext();
    const source = context.createBufferSource();
    const time = this.audioCtx.currentTime;
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
