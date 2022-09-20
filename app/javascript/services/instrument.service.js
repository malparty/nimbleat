const AudioContext = window.AudioContext || window.webkitAudioContext;

export default class InstrumentService {
    constructor(sample) {
        this.sample = sample
    }

    play(rate) {
        const context = new AudioContext();
        const source = context.createBufferSource();
        source.buffer = this.sample;
        source.playbackRate.value = rate;
        source.connect(context.destination);
        source.start(0);
    }

    static async loadSample(url) {
        const context = new AudioContext()
        if (context.decodeAudioData.length !== 1) {
            const originalDecodeAudioData = context.decodeAudioData.bind(context);
            context.decodeAudioData = buffer =>
                new Promise((resolve, reject) =>
                    originalDecodeAudioData(buffer, resolve, reject)
                );
        }

        const response = await fetch(url)
        const buffer = await response.arrayBuffer()

        return await context.decodeAudioData(buffer)
    }
}