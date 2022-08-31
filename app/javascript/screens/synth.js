import SynthVoice, { DEFAULT_SELECTOR as SYNTH_VOICE_SELECTOR } from '../components/synthVoice/';

const SELECTORS = {
  screen: '#synth-screen',
  onOffToggle: '.synth-screen__on-off-toggle',
  playAllBtn: '.synth-screen__play-all',
  sequenceToggle: '.synth-screen__sequence-toggle'
};

const template = document.createElement('template');
template.innerHTML = `
  <div class="m-4">
    <label for="synth-screen__start-toggle" class="inline-flex relative items-center cursor-pointer">
      <input type="checkbox" value="" id="synth-screen__start-toggle" class="synth-screen__on-off-toggle sr-only peer">
      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">ON/OFF</span>
    </label>
    <div class="synth-voice"></div>
    <div class="synth-voice"></div>
    <div class="synth-voice"></div>
    <label for="synth-screen__sequence-toggle" class="inline-flex relative items-center cursor-pointer">
      <input type="checkbox" value="" id="synth-screen__sequence-toggle" class="synth-screen__sequence-toggle sr-only peer">
      <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">⏯</span>
    </label>
    <button disabled class="synth-screen__play-all btn btn-primary" type="button">Play Chord!</button>
  </div>
`;

class SynthScreen {
  constructor() {
    this.synthScreen = document.querySelector(SELECTORS.screen) ?? new Element();

    // Insert HTML content from template
    this.synthScreen.appendChild(template.content.cloneNode(true));

    this.synthVoiceElements = Array.from(document.querySelectorAll(SYNTH_VOICE_SELECTOR));
    this.onOffToggle = document.querySelector(SELECTORS.onOffToggle) ?? new Element();
    this.sequenceToggle = document.querySelector(SELECTORS.sequenceToggle) ?? new Element();
    this.playAllBtn = document.querySelector(SELECTORS.playAllBtn) ?? new Element();

    this._bind();
    this._setup();
    this._addEventListeners();
  }

  onOnOffToggleChanged() {
    this.synthVoiceObjects?.forEach((voice) => {
      voice.toggleNimbleat(this.onOffToggle.checked);
    });

    this.playAllBtn.disabled = !this.onOffToggle.checked;
  }

  async onSequenceToggleChanged() {
    this.seqencerStarted = this.sequenceToggle.checked;

    if (this.seqencerStarted) {
      console.log('Start seq');
      this._sequencer();
    }
  }

  onPlayAllBtnClicked() {
    this.synthVoiceObjects?.forEach((voice) => {
      voice.play();
    });
  }

  // Private

  _bind() {
    this.onOnOffToggleChanged = this.onOnOffToggleChanged.bind(this);
    this.onSequenceToggleChanged = this.onSequenceToggleChanged.bind(this);

    this.onPlayAllBtnClicked = this.onPlayAllBtnClicked.bind(this);
  }

  _setup() {
    this.synthVoiceObjects = this.synthVoiceElements.map((synthVoice) => {
      return new SynthVoice(synthVoice);
    });

    this.seqencerStarted = this.sequenceToggle.checked;
  }

  _addEventListeners() {
    this.onOffToggle.addEventListener('change', this.onOnOffToggleChanged);
    this.sequenceToggle.addEventListener('change', this.onSequenceToggleChanged);

    this.playAllBtn.addEventListener('click', this.onPlayAllBtnClicked);
  }

  async _sequencer() {
    const count = this.synthVoiceObjects?.length;
    let i = 0;
    const intervalId = setInterval(() => {
      console.log('Next step: ', i);
      if (!this.seqencerStarted) {
        clearInterval(intervalId);
        console.log('Sequencer Stopped');
      }

      this.synthVoiceObjects[i].play();
      this.timerId = undefined;
      i = (i + 1) % count;
    }, 500);
  }
}

// Setup the SynthScreen only on the SynthPage
let isSynthPage = document.querySelector(SELECTORS.screen) != null;

if (isSynthPage) {
  new SynthScreen();
}
