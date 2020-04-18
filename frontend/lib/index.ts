import {
  parseServerMsg,
  MessageType,
  DisconnectMessage,
  DisplayChangeMessage,
} from "./messaging";
import MyWorker = require("worker-loader?name=[name].js!./worker");

let worker = new MyWorker();

const CELL_SIZE = 10; // px
const GRID_COLOR = "#CCCCCC";
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
  drawCells();

  requestAnimationFrame(renderLoop);
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

const socket = new WebSocket("ws://localhost:3000/echo");

socket.onopen = onConnect;
socket.onmessage = onMessage;

function onConnect(event: Event) {
  console.log("we're connected!");
  socket.send(JSON.stringify({ type: "disconnect", userId: 4 }));
}

function onMessage(event: MessageEvent) {
  const parsed = parseServerMsg(event.data);

  if (parsed.type() === MessageType.Disconnect) {
    console.log("received disconnect");
    const msg = parsed as DisconnectMessage;
  } else if (parsed.type() === MessageType.DisplayChange) {
    console.log("received displaychange");
    const msg = parsed as DisplayChangeMessage;

    const changes = msg.changes;

    for (let change of changes) {
      const { x, y, isAlive } = change;
      const idx = getIndex(x, y);
      display[idx] ^= isAlive ? 1 : 0;
    }
  }
}

requestAnimationFrame(renderLoop);
