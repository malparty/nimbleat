class SamplerEngine {
  constructor() {
    this.name = 'Sampler';
    this.instrument = '-';
  }

  onPadPressed(padIndex) {
    console.log(`Pad ${padIndex} pushed from the Sampler engine`);

    // Implement here the logic to produce Sound based on the Pad Index (int)
  }

  changeInstrument() {
    console.log('Changed instrument for the Sampler');
    this.instrument = 'A new instrument!';
  }
}

export default SamplerEngine;
