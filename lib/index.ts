import MyWorker = require("worker-loader?name=[name].js!./worker");

let worker = new MyWorker();
worker.onmessage = (evt: MessageEvent) => {
  const changes = evt.data;
  for (let change of changes) {
    const idx = getIndex(change.x, change.y);
    display[idx] ^= change.isAlive ? 1 : 0;
  }
};

const CELL_SIZE = 10; // px
const GRID_COLOR = "#000000"; // #CCCCCC
const DEAD_COLOR = "#000000";
const ALIVE_COLOR = "#FFFFFF";
const width = 64;
const height = 32;

// initialize display and fill with empty pixels
const display = new Array(width * height);
for (let i = 0; i < width * height; i++) {
  display.push(0);
}

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas: HTMLCanvasElement = document.getElementById(
  "game-of-life-canvas"
) as HTMLCanvasElement;
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

const renderLoop = () => {
  drawGrid();
  drawCells();

  requestAnimationFrame(renderLoop);
};

const drawGrid = () => {
  if (ctx !== null) {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
  } else {
    console.error("failed to load 2d canvas context!");
  }
};

const getIndex = (x: number, y: number) => {
  return y * width + x;
};

const drawCells = () => {
  if (ctx !== null) {
    ctx.beginPath();

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(col, row);

        ctx.fillStyle = display[idx] === 1 ? ALIVE_COLOR : DEAD_COLOR;

        ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    ctx.stroke();
  } else {
    console.error("failed to load 2d canvas context!");
  }
};

requestAnimationFrame(renderLoop);
