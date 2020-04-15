import MyWorker = require("worker-loader?name=[name].js!./worker");

// const CELL_SIZE = 10; // px
// const GRID_COLOR = "#000000"; // #CCCCCC
// const DEAD_COLOR = "#000000";
// const ALIVE_COLOR = "#FFFFFF";

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

// a canvas RGBA value requires 4 bytes
const NUM_BYTES_IN_RGBA_VAL = 4;

type CanvasChange = { x: number; y: number };

const getIndex = (x: number, y: number, width: number) => {
  return (y * width + x) * NUM_BYTES_IN_RGBA_VAL;
};

let worker = new MyWorker();

// a Canvas ImageData object is a widthxheightx4 array where each pixel is represented by an RGBA value
// of 4 numbers.
const writeRGBValue = (
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  isWhite: boolean
) => {
  // Get the pixel index
  const pixelIndex = getIndex(x, y, width);

  // Set the pixel data
  const pixelValue = isWhite ? 255 : 0;

  imageData.data[pixelIndex + 0] ^= pixelValue;
  imageData.data[pixelIndex + 1] ^= pixelValue;
  imageData.data[pixelIndex + 2] ^= pixelValue;
  imageData.data[pixelIndex + 3] = 255; // alpha value is always maxed out, because 0 is fully transparant
};

// given a pixel change from the emulator, return the corresponding
const getCanvasChangesFromChange = (
  chip_x: number,
  chip_y: number,
  width: number,
  widthMultiplier: number,
  heightMultiplier: number
): CanvasChange[] => {
  const canvasChanges: CanvasChange[] = [];
  for (let w = 0; w < widthMultiplier; w++) {
    for (let h = 0; h < heightMultiplier; h++) {
      const x = w;
      const y = h * width;
      canvasChanges.push({ x, y });
    }
  }

  return canvasChanges;
};

// Update an imageData's pixel color value with the change coming in from the game server
const updateImageData = (
  imageData: ImageData,
  change: any,
  width: number,
  widthMultiplier: number,
  heightMultiplier: number
) => {
  const { x: chip_x, y: chip_y, isAlive } = change;

  for (let canvasChange of getCanvasChangesFromChange(
    chip_x,
    chip_y,
    width,
    widthMultiplier,
    heightMultiplier
  )) {
    const { x, y } = canvasChange;
    writeRGBValue(imageData, x, y, width, isAlive);
  }
};

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
  let imageData = context?.createImageData(width, height);

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

      before = imageData!.data.slice();
      console.log("before");
      console.log(this.JSON.stringify(imageData!.data));
    }

    updateImageData(
      imageData!,
      change,
      width,
      widthMultiplier,
      heightMultiplier
    );

    if (shouldPrint) {
      shouldPrint = false;
      console.log("after");
      console.log(this.JSON.stringify(imageData!.data));
      for (let i = 0; i < imageData!.data.length; i++) {
        if (imageData!.data[i] !== before[i]) {
          console.log(
            `discrepancy. i: ${i}, before: ${before[i]}, after: ${
              imageData!.data[i]
            }`
          );
        }
      }
    }

    //display[idx] ^= change.isAlive ? 1 : 0;
  };

  // Create the initial black pixel map
  function initializeImage() {
    // Loop over all of the pixels
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        writeRGBValue(imageData!, x, y, width, false);
      }
    }
  }
  initializeImage();

  // Main loop
  function main(tframe: number) {
    // Request animation frames
    window.requestAnimationFrame(main);

    // Draw the image data to the canvas
    context?.putImageData(imageData!, 0, 0);
  }

  // Call the main loop
  main(0);
};
