import SamplerEngine from './sampler-engine';
import WaveTableEngine from './wave-table-engine';

const getSoundEngines = () => {
  return [new WaveTableEngine(), new SamplerEngine()];
};

export default getSoundEngines;
