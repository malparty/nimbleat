class WaveTableEngine {
  constructor() {
    this.name = 'Wave Table';
    this.instrument = '-';
  }

  onPadPressed(padIndex) {
    console.log(`Pad ${padIndex} pushed from the Wave-table engine`);

    // Implement here the logic to produce Sound based on the Pad Index (int)
  }

  changeInstrument() {
    console.log('Changed instrument for the Wave Table');
    this.instrument = 'A new instrument!';
  }
}

export default WaveTableEngine;
