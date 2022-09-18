import Pad, { DEFAULT_SELECTOR as PAD_SELECTOR } from '../components/pad/';
import getSoundEngines from '../sound-engines';
import { KeyMap } from '../utilities/keyMap';
import JogDisplay, {
  DEFAULT_SELECTOR as JOG_DISPLAY_SELECTOR,
} from '../components/jogDisplay';

const SELECTORS = {
  screen: '#base-screen',
  startButton: '.start-button',

  playPad: `${PAD_SELECTOR}.pad--play`,

  padMode: '#pad_mode',
  padInstrument: '#pad_instrument',

  displayMode: '#display_mode',
  displayInstrument: '#display_instrument',
};

const splash = document.createElement('template');
splash.innerHTML = `
  <div class="m-4 w-fit">
    <button class="btn btn-primary start-button">
      Click to start!
    </div>
  </div>
`;

const template = document.createElement('template');
template.innerHTML = `
  <div class="m-4 w-fit">
    <div class="flex">
      <div class="pad pad--option flex-2" id="pad_mode">Mode</div>
      <div class="flex-1 w-48 px-4 py-2 m-2 rounded-full font-mono font-medium leading-none text-sm text-center text-primary bg-primary-content">
        <div id="display_mode">Mode...</div>
        <div id="display_instrument">Instrument...</div>
      </div>
      <div class="pad pad--option flex-2" id="pad_instrument">Instr.</div>
    </div>
    <div class="flex">
      <div class="pad pad--play flex-1" id="pad_1"></div>
      <div class="pad pad--play flex-1" id="pad_2"></div>
      <div class="pad pad--play flex-1" id="pad_3"></div>
      <div class="pad pad--play flex-1" id="pad_4"></div>
    </div>
    <div class="flex">
      <div class="pad pad--play flex-1" id="pad_5"></div>
      <div class="pad pad--play flex-1" id="pad_6"></div>
      <div class="pad pad--play flex-1" id="pad_7"></div>
      <div class="pad pad--play flex-1" id="pad_8"></div>
    </div>
    <div class="flex">
      <div class="pad pad--play flex-1" id="pad_9"></div>
      <div class="pad pad--play flex-1" id="pad_10"></div>
      <div class="pad pad--play flex-1" id="pad_11"></div>
      <div class="pad pad--play flex-1" id="pad_12"></div>
    </div>
    <div class="flex">
      <div class="pad pad--play flex-1" id="pad_13"></div>
      <div class="pad pad--play flex-1" id="pad_14"></div>
      <div class="pad pad--play flex-1" id="pad_15"></div>
      <div class="pad pad--play flex-1" id="pad_16"></div>
    </div>
    <div class ="jog-display" id="jog_display"></div>
  </div>
`;

class BaseScreen {
  constructor() {
    this.baseScreen = document.querySelector(SELECTORS.screen) ?? new Element();

    // Insert HTML content from splash screen
    this.baseScreen.appendChild(splash.content.cloneNode(true));

    this.startButton = document.querySelector(SELECTORS.startButton);
    this.padsElements = Array.from(document.querySelectorAll(PAD_SELECTOR));
    this.jogElements = Array.from(
      document.querySelectorAll(JOG_DISPLAY_SELECTOR)
    );

    this._bind();
    this._addSplashEventListeners();
  }

  onKeyDown(e) {
    const padId = KeyMap[e.key];
    if (padId !== undefined) {
      this.pads[KeyMap[e.key]].onPadClicked();
    }
  }

  onStart() {
    // Insert HTML content from template
    this.baseScreen.appendChild(template.content.cloneNode(true));
    this.baseScreen.removeChild(this.baseScreen.firstElementChild);

    this.padsElements = Array.from(
      document.querySelectorAll(SELECTORS.playPad)
    );
    this.padInstrument = document.querySelector(SELECTORS.padInstrument);
    this.padMode = document.querySelector(SELECTORS.padMode);
    this.displayInstrument = document.querySelector(
      SELECTORS.displayInstrument
    );
    this.displayMode = document.querySelector(SELECTORS.displayMode);

    this.soundEngines = getSoundEngines();

    this._setup();
    this._addEventListeners();
  }

  padModeOnClick() {
    this.currentSoundEngineIndex++;

    if (this.currentSoundEngineIndex >= this.soundEngines.length) {
      this.currentSoundEngineIndex = 0;
    }

    this.currentSoundEngine = this.soundEngines[this.currentSoundEngineIndex];

    this._refreshDisplays();
  }

  padInstrumentOnClick() {
    if (this.currentSoundEngine.changeInstrument) {
      this.currentSoundEngine.changeInstrument();

      this._refreshDisplays();
    }
  }

  // Private

  _bind() {
    this.onStart = this.onStart.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.padModeOnClick = this.padModeOnClick.bind(this);
    this.padInstrumentOnClick = this.padInstrumentOnClick.bind(this);
  }

  _setup() {
    this.currentSoundEngineIndex = 0;
    this.currentSoundEngine = this.soundEngines[this.currentSoundEngineIndex];

    this.pads = this.padsElements.map((padElement, i) => {
      const pad = new Pad(padElement);
      pad.setText(i);
      pad.setOnPlayed(() => {
        this._onPadPlayed(i);
      });

      return pad;
    });

    this.jogDisplay = this.jogElements.map((jogElement, i) => {
      const jogDisplay = new JogDisplay(jogElement);
      jogDisplay.setText('Hello' + i);
      jogDisplay.setOnPlayed(() => {
        this._onJogPlayed(i);
      });

      return jogDisplay;
    });

    this._refreshDisplays();
  }

  _addSplashEventListeners() {
    this.startButton.addEventListener('click', this.onStart);
  }

  _addEventListeners() {
    document.addEventListener('keydown', this.onKeyDown);
    this.padMode.addEventListener('click', this.padModeOnClick);
    this.padInstrument.addEventListener('click', this.padInstrumentOnClick);
  }

  _onPadPlayed(padIndex) {
    // Handle Scales here (and add frequency as second arg)
    this.currentSoundEngine.onPadPressed(padIndex);
  }

  _refreshDisplays() {
    this.displayMode.innerHTML = this.currentSoundEngine.name;
    this.displayInstrument.innerHTML = this.currentSoundEngine.instrument;
  }
}

// Setup the BaseScreen only on the IndexPage
let isIndexPage = document.querySelector(SELECTORS.screen) != null;

if (isIndexPage) {
  new BaseScreen();
}
