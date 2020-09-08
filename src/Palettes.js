import React from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


//const palettes = require('nice-color-palettes');
const palettes = require('nice-color-palettes/200');


toast.configure();
function Palettes(props) {

  return (
    <div>
      <h1>Nice Colours</h1>
      <p>Top palettes from ColourLovers, via Matt Deslauriers' <a href="https://github.com/Jam3/nice-color-palettes">https://github.com/Jam3/nice-color-palettes</a></p>

      <p>Click any palette to copy it to clipboard (as JavaScript).</p>
      <div className="palettes">
        {
          palettes.map((p, ix) => <Palette key={ix} palette={p} />)
        }
      </div>
    </div>
  );
}

function copyPaletteToClipboardAsJSON(palette) {
  console.log(palette);
  navigator.clipboard.writeText(JSON.stringify(palette, null, 2));
}
function copyAndNotify(palette) {
  copyPaletteToClipboardAsJSON(palette);

  toast('Copied palette to clipboard!', {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: true,
    pauseOnHover: true,
  });
}
function Palette({ palette }) {
  return (
    <div
      className="palette"
      onClick={() => copyAndNotify(palette)} >
      {
        palette.map((colourHex, ix) => <Colour key={ix} colourHex={colourHex} />)
      }
    </div>
  )
}

function hexToRGB(hex) {
  //https://stackoverflow.com/a/5624139/669686
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToString({ r, g, b }) {
  return `(${r}, ${g}, ${b})`;
}
function Colour({ colourHex }) {
  const rgbString = rgbToString(hexToRGB(colourHex));
  return (
    <div
      className="colour"
      style={{ background: colourHex }}
    >
      <span className="hex">{colourHex}</span> <span className="rgb">{rgbString}</span>
    </div>
  );
}
export default Palettes;