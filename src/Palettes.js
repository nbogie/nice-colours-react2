import React from 'react';
//const palettes = require('nice-color-palettes');
const palettes = require('nice-color-palettes/200');



function Palettes(props){
    
  return (
    <div>
      <h1>Nice Colours</h1>
      <p>Taken from <a href="https://github.com/Jam3/nice-color-palettes">https://github.com/Jam3/nice-color-palettes</a></p>
      <p>Click to copy straight to clipboard.</p>
      <div className="palettes">      
        {
          palettes.map((p, ix) => <Palette key={ix} palette={p}/>)
        }
      </div>
    </div>
  );
}

function copyPaletteToClipboardAsJSON(palette){
  console.log(palette);
  navigator.clipboard.writeText(JSON.stringify(palette, null, 2));
}

function Palette({palette}){
  return (
    <div 
    className="palette"
    onClick={() => copyPaletteToClipboardAsJSON(palette)}>
    {
      palette.map((colourHex, ix) => <Colour key={ix} colourHex={colourHex}/>)
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

function rgbToString({r, g, b}){
  return `(${r}, ${g}, ${b})`; 
}
function Colour({colourHex}){
  const rgbString = rgbToString(hexToRGB(colourHex));
  return (
    <div 
      className="colour" 
      style={{background: colourHex}}
    >
      <span className="hex">{colourHex}</span> <span className="rgb">{rgbString}</span>
      </div>
  );
}
export default Palettes;