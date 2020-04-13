import MyWorker = require("worker-loader?name=[name].js!./worker");

const CELL_SIZE = 10; // px
const GRID_COLOR = "#000000"; // #CCCCCC
const DEAD_COLOR = "#000000";
const ALIVE_COLOR = "#FFFFFF";

// const renderLoop = () => {
//   drawGame();
//   //drawGrid();
//   //drawCells();

//   requestAnimationFrame(renderLoop);
// };

// const drawGame = () => {
//   ctx?.putImageData(imageData, 0, 0);
// }

// const drawGrid = () => {
//   if (ctx !== null) {
//     ctx.beginPath();
//     ctx.strokeStyle = GRID_COLOR;

//     // Vertical lines.
//     for (let i = 0; i <= width; i++) {
//       ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
//       ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
//     }

//     // Horizontal lines.
//     for (let j = 0; j <= height; j++) {
//       ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
//       ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
//     }

//     ctx.stroke();
//   } else {
//     console.error("failed to load 2d canvas context!");
//   }
// };

// const drawCells = () => {
//   if (ctx !== null) {
//     ctx.beginPath();

//     for (let row = 0; row < height; row++) {
//       for (let col = 0; col < width; col++) {
//         const idx = getIndex(col, row);

//         ctx.fillStyle = display[idx] === 1 ? ALIVE_COLOR : DEAD_COLOR;

//         ctx.fillRect(
//           col * (CELL_SIZE + 1) + 1,
//           row * (CELL_SIZE + 1) + 1,
//           CELL_SIZE,
//           CELL_SIZE
//         );
//       }
//     }

//     ctx.stroke();
//   } else {
//     console.error("failed to load 2d canvas context!");
//   }
// };

//requestAnimationFrame(renderLoop);

window.onload = function () {
  let worker = new MyWorker();
  worker.onmessage = (evt: MessageEvent) => {
    const change = evt.data;

    const idx = getIndex(change.x, change.y);

    //display[idx] ^= change.isAlive ? 1 : 0;
  };

  const getIndex = (x: number, y: number) => {
    return y * width + x;
  };

  // Get the canvas and context
  const canvas: HTMLCanvasElement = document.getElementById(
    "game-of-life-canvas"
  ) as HTMLCanvasElement;
  var context = canvas.getContext("2d");

  // Define the image dimensions
  const width = canvas.width;
  const height = canvas.height;

  console.log("height: " + height + " width: " + width);

  // Create an ImageData object
  var imagedata = context?.createImageData(width, height);

  // Create the image
  function initializeImage() {
    // Loop over all of the pixels
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        // Get the pixel index
        var pixelindex = (y * width + x) * 4;

        // Set the pixel data
        imagedata!.data[pixelindex] = Math.random() * 255; // Red
        imagedata!.data[pixelindex + 1] = Math.random() * 255; // Green
        imagedata!.data[pixelindex + 2] = Math.random() * 255; // Blue
        imagedata!.data[pixelindex + 3] = 255; // Alpha
      }
    }
  }

  // Main loop
  function main(tframe: number) {
    // Request animation frames
    window.requestAnimationFrame(main);

    // Create the image
    initializeImage();

    // Draw the image data to the canvas
    context?.putImageData(imagedata!, 0, 0);
  }

  // Call the main loop
  main(0);
};
