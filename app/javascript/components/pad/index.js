export const DEFAULT_SELECTOR = '.pad';

const CLASS_NAMES = {
  containerElement: '.pad__container',
  textElement: '.pad__text'
};

const template = document.createElement('template');
template.innerHTML = `
  <div class="pad__container">
    <div class="pad__text"></div>
  </div>
`;

class Pad {
  constructor(elementRef) {
    this.pad = elementRef;

    // Insert HTML content from template
    this.pad.appendChild(template.content.cloneNode(true));

    this.padContainer = this.pad.querySelector(CLASS_NAMES.containerElement) ?? new Element();
    this.textElement = this.pad.querySelector(CLASS_NAMES.textElement) ?? new Element();

    this._bind();
    this._setup();
    this._addEventListeners();
  }

  // Event Handlers

  onPadClicked() {
    this._onPlayedCallback();
    this.padContainer.classList.add('pad--pressed');
    setTimeout(() => {
      this.padContainer.classList.remove('pad--pressed');
    }, 200);
  }

  // Object interface for external usage

  /**
   * @param {*} text: text to be displayed within the pad
   */
  setText(text) {
    this.textElement.innerHTML = text;
  }

  /**
   * Trigger a Play button action
   * @param {*} callback: function to be called when the pad is triggered
   */
  setOnPlayed(callback) {
    this._onPlayedCallback = callback;
  }

  // Private

  _bind() {
    this.onPadClicked = this.onPadClicked.bind(this);
  }

  _setup() {
    this._onPlayedCallback = () => {
      console.log('OnPlayedCallback not assigned to pad: ', this.pad);
    };
  }

  _addEventListeners() {
    this.pad.addEventListener('mousedown', this.onPadClicked);
  }
}

export default Pad;
