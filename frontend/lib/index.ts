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

  // Create an ImageData object and setup our default black pixel canvas
  let imageData = context?.createImageData(width, height)!;
  initializeImage(imageData, width, height);

  // log in case we need to debug
  console.log("height: " + height + " width: " + width);
  console.log(
    "canvas height: " + canvas.height + " canvas width: " + canvas.width
  );
  console.log("heightMultiplier: " + heightMultiplier);
  console.log("widthMultiplier: " + widthMultiplier);

  // setup handlers for messages sent from the server and forwarded
  // by the webworker
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

  // setup handlers for key down/up events, which will send to the server via the webworker
  this.document.addEventListener("keydown", handleKeyDown);
  this.document.addEventListener("keyup", handleKeyUp);

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

/**
 * Sends a message to the server via the websocket when the player presses a key down
 * @param event a key pressed down
 */
const handleKeyDown = (event: KeyboardEvent) => {
  const keyMsg = { key: event.key, isUp: false };
  worker.postMessage(JSON.stringify(keyMsg));
};

/**
 * Same as handleKeyDown but for when the key is released
 * @param event a key released
 */
const handleKeyUp = (event: KeyboardEvent) => {
  const keyMsg = { key: event.key, isUp: true };
  worker.postMessage(JSON.stringify(keyMsg));
};
