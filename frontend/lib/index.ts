import MyWorker = require("worker-loader?name=[name].js!./worker");
import { updateCanvasImageData, initializeImage } from "./image";

let worker = new MyWorker();

window.onload = function () {
  // Get the canvas and context
  const canvas: HTMLCanvasElement = document.getElementById(
    "game-of-life-canvas"
  ) as HTMLCanvasElement;
  const context = canvas.getContext("2d");

  const CHIP_8_WIDTH = 64;
  const CHIP_8_HEIGHT = 32;

  canvas.width = 640;
  canvas.height = 320;

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
  // the worker reads in pixel changes from the game server and sends those
  // changes here, where they're used to update the canvas pixels
  worker.onmessage = (evt: MessageEvent) => {
    const change = evt.data;

    updateCanvasImageData(
      imageData,
      change,
      width,
      widthMultiplier,
      heightMultiplier
    );
  };

  // setup our black pixel canvas
  initializeImage(imageData, width, height);

  // Main loop
  function main(tframe: number) {
    // Draw the image data to the canvas
    context?.putImageData(imageData, 0, 0);

    // Request animation frames
    window.requestAnimationFrame(main);
  }

  // Call the main loop
  main(0);
};
