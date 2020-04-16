import MyWorker = require("worker-loader?name=[name].js!./worker");
import { updateImageData, initializeImage } from "./image";

let worker = new MyWorker();

window.onload = function () {
  // Get the canvas and context
  const canvas: HTMLCanvasElement = document.getElementById(
    "game-of-life-canvas"
  ) as HTMLCanvasElement;
  const context = canvas.getContext("2d");

  const CHIP_8_WIDTH = 64;
  const CHIP_8_HEIGHT = 32;

  // Define the image dimensions as the closest multiple of the
  // base CHIP-8 display width and height
  const widthMultiplier = Math.floor(canvas.width / CHIP_8_WIDTH);
  const heightMultiplier = Math.floor(canvas.height / CHIP_8_HEIGHT);
  const width = CHIP_8_WIDTH * widthMultiplier;
  const height = CHIP_8_HEIGHT * heightMultiplier;

  // Create an ImageData object
  let imageData = context?.createImageData(width, height)!;

  // the CHIP-8 display is a fixed width and height, but the canvas
  // width and height can change. DISPLAY_RATIO is a multiplier
  // representing how many canvas pixels represent a single CHIP-8
  // pixel

  console.log("height: " + height + " width: " + width);
  console.log(
    "canvas height: " + canvas.height + " canvas width: " + canvas.width
  );
  console.log("heightMultiplier: " + heightMultiplier);
  console.log("widthMultiplier: " + widthMultiplier);

  let shouldPrint = true;
  // setup the worker
  worker.onmessage = (evt: MessageEvent) => {
    const change = evt.data;

    let before = new Uint8ClampedArray(0);
    if (shouldPrint) {
      console.log(`updating with change ${JSON.stringify(change)}`);

      before = imageData.data.slice();
    }

    updateImageData(
      imageData,
      change,
      width,
      widthMultiplier,
      heightMultiplier
    );

    if (shouldPrint) {
      shouldPrint = false;
      for (let i = 0; i < imageData.data.length; i++) {
        if (imageData.data[i] !== before[i]) {
          console.log(
            `discrepancy. i: ${i}, before: ${before[i]}, after: ${imageData.data[i]}`
          );
        }
      }
    }
  };

  // setup our black pixel canvas
  initializeImage(imageData, width, height);

  // Main loop
  function main(tframe: number) {
    // Request animation frames
    window.requestAnimationFrame(main);

    // Draw the image data to the canvas
    context?.putImageData(imageData, 0, 0);
  }

  // Call the main loop
  main(0);
};
