import SamplerEngine from './sampler-engine';
import WaveTableEngine from './wave-table-engine';

const soundEngines = [];

soundEngines.push(new WaveTableEngine());
soundEngines.push(new SamplerEngine());

export default soundEngines;
