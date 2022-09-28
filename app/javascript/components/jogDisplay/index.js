
export const DEFAULT_SELECTOR = '.jog-display';

const CLASS_NAMES = {
  textElement: '.jog-display__text'
};

// Set Audio Context
const audioContextJog = new AudioContext();
// Set Sample Music
const sampleJogMusic = new Audio("./assets/samples/milk-shake.mp3");
// Add Sample Music to source to play on the destination
const sourceJog = audioContextJog.createMediaElementSource(sampleJogMusic);
sourceJog.connect(audioContextJog.destination);


const template = document.createElement('template');
template.innerHTML = `

<div class="py-5 flex items-center justify-center space-x-8">
  <div id="drop-area" class="relative w-72 h-72 bg-purple-300 rounded-full flex justify-center items-center text-center p-5 shadow-xl">
    <form class="my-form">
      <label class="button" for="fileElem">Select your Music</label>
    </form> 
  </div>
</div>
<div class="py-5 flex items-center justify-center space-x-8">
    <p class="underline decoration-1"> Let's play our sample music ⚡🎧 </p>
    <button class="btn btn-primary m-4 play">Play</button>
    <button class="btn btn-primary m-4 pause">Pause</button>
</div>

`;

class JogDisplay {
  constructor(elementRef) {
    this.jogDisplay = elementRef;
    // Insert HTML content from template
    this.jogDisplay.appendChild(template.content.cloneNode(true));
    // this.textElement = this.jogDisplay.querySelector(CLASS_NAMES.textElement) ?? new Element();

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
    this.jogDisplay.addEventListener('mousedown', this.onJogDisplayClicked);
    let dropArea = document.getElementById('drop-area');
    // dropArea.addEventListener('dragenter', handlerFunction, false);
    // dropArea.addEventListener('dragleave', handlerFunction, false);
    // dropArea.addEventListener('dragover', handlerFunction, false);
    // dropArea.addEventListener('drop', handlerFunction, false);

    let playBtn = document.querySelector(".play");
    let pauseBtn = document.querySelector(".pause");
    // Play sample jog
    playBtn.addEventListener('click', () => {
      if(audioContextJog.state==="suspended"){
        audioContextJog.resume();
        console.log(audioContextJog);
      }
      sampleJogMusic.play();
    })
    // Pause sample jog
    pauseBtn.addEventListener('click', () => {
      sampleJogMusic.pause();
    })
  }
}

export default JogDisplay;
