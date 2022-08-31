import Pad, { DEFAULT_SELECTOR as PAD_SELECTOR } from '../components/pad/';

const SELECTORS = {
  screen: '#base-screen'
};

const template = document.createElement('template');
template.innerHTML = `
  <div class="m-4 w-fit">
    <div class="flex">
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_1"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_2"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_3"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_4"></div>
    </div>
    <div class="flex">
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_5"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_6"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_7"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_8"></div>
    </div>
    <div class="flex">
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_9"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_10"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_11"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_12"></div>
    </div>
    <div class="flex">
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_13"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_14"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_15"></div>
      <div class="pad flex-1 first:ml-0 last:mr-0 m-2" id="pad_16"></div>
    </div>
  </div>
`;

class BaseScreen {
  constructor() {
    this.baseScreen = document.querySelector(SELECTORS.screen) ?? new Element();

    // Insert HTML content from template
    this.baseScreen.appendChild(template.content.cloneNode(true));

    this.padsElements = Array.from(document.querySelectorAll(PAD_SELECTOR));

    this._bind();
    this._setup();
    this._addEventListeners();
  }

  // Private

  _bind() {}

  _setup() {
    this.pads = this.padsElements.map((padElement, i) => {
      const pad = new Pad(padElement);
      pad.setText(i);
      pad.setOnPlayed(() => {
        this._onPadPlayed(i);
      });

      return pad;
    });
  }

  _addEventListeners() {}

  _onPadPlayed(padIndex) {
    console.log(`Pad ${padIndex} pushed!`);
  }
}

// Setup the BaseScreen only on the IndexPage
let isIndexPage = document.querySelector(SELECTORS.screen) != null;

if (isIndexPage) {
  new BaseScreen();
}
