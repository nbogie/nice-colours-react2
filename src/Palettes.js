import React, { useEffect, useState } from "react";
import useStateWithLocalStorage from "./useStateWithLocalStorage.js";
import { toast } from "react-toastify";
import io from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import RadioBinaryButton from "./RadioBinaryButton";

const palettes = require("nice-color-palettes/200");

let socket; // keep it over multiple renders.  TODO: why not state variable?

toast.configure();
function Palettes(props) {
  const [exportAsHexCodes, setExportAsHexCodes] = useState(true);
  const [socketioDestURL, setSocketioDestURL] = useStateWithLocalStorage(
    "nice-colours-socketio-dest"
  );

  useEffect(() => {
    if (!socketioDestURL || socketioDestURL.length <= 4) {
      return; // no cleanup fn needed in this case.
    }
    socket = io.connect(socketioDestURL);

    socket.on("palette_received", (data) => {
      console.log("palette received by sketch!", data);
    });

    return () => {
      //unregister listeners
      for (let eventName of ["palette_received"]) {
        socket.off(eventName);
      }
      socket.disconnect();
    };
  }, [socketioDestURL]);

  const handlePaletteClicked = (palette) => {
    if (socket && socket.connected) {
      socket.emit("palette_chosen", palette);
    }
  };

  return (
    <div>
      <h1>Nice Colours</h1>
      <p>
        Top palettes from ColourLovers, via Matt Deslauriers'{" "}
        <a href="https://github.com/Jam3/nice-color-palettes">
          https://github.com/Jam3/nice-color-palettes
        </a>
      </p>
      <p>Click any palette to copy it to clipboard (as JavaScript).</p>
      <div>
        Socket.io destination address:
        <input
          type="text"
          id="socketIODest"
          value={socketioDestURL}
          onChange={(ev) => setSocketioDestURL(ev.target.value)}
          placeholder="socket.io dest addr"
        />
      </div>
      Export as...{" "}
      <RadioBinaryButton
        groupName="exportMode"
        nameOn="Hex Codes"
        nameOff="color(r,g,b) array"
        current={exportAsHexCodes}
        changeHandler={setExportAsHexCodes}
      />
      <div>
        See also{" "}
        <a href="https://chromotome-quicker.netlify.app/">
          chromotome-quicker.netlify.app
        </a>{" "}
        for KGolid's fantastic palettes.
      </div>
      <div className="palettes">
        {palettes.map((p, ix) => (
          <Palette
            key={ix}
            palette={p}
            exportAsHexCodes={exportAsHexCodes}
            handleOnClick={handlePaletteClicked}
          />
        ))}
      </div>
    </div>
  );
}

function copyPaletteToClipboardAsJSON(palette, exportAsHexCodes) {
  const text = exportAsHexCodes
    ? JSON.stringify(palette, null, 2)
    : paletteToKhanAcademyCode(palette);
  navigator.clipboard.writeText(text);
}

function paletteToKhanAcademyCode(palette) {
  function hexCodeToRGBColorCall(hex) {
    const { r, g, b } = hexToRGB(hex);
    return `color(${r}, ${g}, ${b})`;
  }
  return (
    "var palette = [ \n" +
    palette.map(hexCodeToRGBColorCall).join(",\n") +
    "\n ];"
  );
}

function copyAndNotify(palette, exportAsHexCodes) {
  copyPaletteToClipboardAsJSON(palette, exportAsHexCodes);

  //https://fkhadra.github.io/react-toastify/api/toast
  toast("Copied palette to clipboard!", {
    position: "bottom-left",
    autoClose: 2000,
    hideProgressBar: true,
    pauseOnHover: true,
    style: toastStyleForPalette(palette),
  });
}

function Palette({ palette, exportAsHexCodes, handleOnClick }) {
  return (
    <div
      className="palette"
      onClick={() => {
        copyAndNotify(palette, exportAsHexCodes);
        handleOnClick(palette);
      }}
    >
      {palette.map((colourHex, ix) => (
        <Colour key={ix} colourHex={colourHex} />
      ))}
    </div>
  );
}
function Colour({ colourHex }) {
  // const rgbString = rgbToString(hexToRGB(colourHex));
  return (
    <div className="colour" style={{ background: colourHex }}>
      {/* <span className="hex">{colourHex}</span> <span className="rgb">{rgbString}</span> */}
    </div>
  );
}

function hexToRGB(hex) {
  //https://stackoverflow.com/a/5624139/669686
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// function rgbToString({ r, g, b }) {
//   return `(${r}, ${g}, ${b})`;
// }

function toastStyleForPalette(palette) {
  return {
    backgroundImage: `linear-gradient(to right,${paletteToHardGradient(
      palette
    )})`,
  };
}

function paletteToHardGradient(palette) {
  const stepSize = 100 / palette.length;
  return palette
    .map((hex, i) => [
      `${hex} ${(i + 0) * stepSize}%`,
      `${hex} ${(i + 1) * stepSize}%`,
    ])
    .flat()
    .join(", ");
}

export default Palettes;
