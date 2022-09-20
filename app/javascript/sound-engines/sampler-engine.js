import InstrumentService from "../services/instrument.service";

class SamplerEngine {
  constructor() {
    this.name = 'Sampler';
    this.instrument = '-';
    InstrumentService.loadSample('assets/sample.wav')
      .then(sample => {
          this.synthService = new InstrumentService(sample)
      })

  }

  onPadPressed(padIndex) {
    console.log(`Pad ${padIndex} pushed from the Sampler engine`);

    // Implement here the logic to produce Sound based on the Pad Index (int)
    // TODO: Play in correct synth mode only
    if (this.synthService) {
        this.synthService.play(padIndex / 15)
    }

  }

  changeInstrument() {
    console.log('Changed instrument for the Sampler');
    this.instrument = 'A new instrument!';
  }
}

export default SamplerEngine;
