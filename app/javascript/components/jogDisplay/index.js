export const DEFAULT_SELECTOR = '.jog-display';

const CLASS_NAMES = {
  textElement: '.jog-display__text'
};

const template = document.createElement('template');
template.innerHTML = `
<div class="py-5 flex items-center justify-center space-x-8">
<div id="drop-area" class="relative w-72 h-72 bg-purple-300 rounded-full flex justify-center items-center text-center p-5 shadow-xl">
  <form class="my-form">
    <input type="file" id="fileElem" multiple accept="image/*" onchange="handleFiles(this.files)">
    <label class="button" for="fileElem">Select your Music</label>
  </form>
</div>
</div>
`;

class JogDisplay {
  constructor(elementRef) {
    this.jogDisplay = elementRef;

    // Insert HTML content from template
    this.jogDisplay.appendChild(template.content.cloneNode(true));

    this.textElement = this.jogDisplay.querySelector(CLASS_NAMES.textElement) ?? new Element();

    this._bind();
    this._setup();
    this._addEventListeners();
  }

  // Event Handlers

  onJogDisplayClicked() {
    this._onPlayedCallback();
  }

  // Object interface for external usage

  /**
   * @param {*} text: text to be displayed within the jog display
   */
  setText(text) {
    this.textElement.innerHTML = text;
  }

  /**
   * Trigger a Play button action
   * @param {*} callback: function to be called when the jog display is triggered
   */
  setOnPlayed(callback) {
    this._onPlayedCallback = callback;
  }

  // Private

  _bind() {
    this.onJogDisplayClicked = this.onJogDisplayClicked.bind(this);
  }

  _setup() {
    this._onPlayedCallback = () => {
      console.log('OnPlayedCallback not assigned to jog display: ', this.jogDisplay);
    };
  }

  _addEventListeners() {
    let dropArea = document.getElementById('drop-area');
    dropArea.addEventListener('dragenter', handlerFunction, false);
    dropArea.addEventListener('dragleave', handlerFunction, false);
    dropArea.addEventListener('dragover', handlerFunction, false);
    dropArea.addEventListener('drop', handlerFunction, false);
    this.jogDisplay.addEventListener('mousedown', this.onJogDisplayClicked);
  }

}

export default JogDisplay;
