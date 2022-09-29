// A scale is an array of frequency where the index is the Pad index and value is the frequency
// Find more values here: https://mixbutton.com/mixing-articles/music-note-to-frequency-chart/

const Scales = {
  blues: [65, 78, 87, 92, 98, 116, 131, 156, 175, 185, 196, 233, 262, 311 ,349, 370],
  chromatic2: [65, 69, 73, 78, 82, 87, 92, 98, 103, 110, 116, 123, 131, 139, 147, 156],
  chromatic3: [131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311],
  pentagonic: [52, 58, 69, 78, 92, 103, 116 ,139, 156, 185, 208, 233, 277, 311, 370, 415],
}

export default Scales;
