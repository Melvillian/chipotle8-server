import {
  parseServerMsg,
  MessageType,
  DisconnectMessage,
  DisplayChangeMessage,
} from "./messaging";
import MyWorker = require("worker-loader?name=[name].js!./worker");

let worker = new MyWorker();

const CELL_SIZE = 10; // px
const ALIVE_COLOR = "#FFFFFF";
const width = 64;
const height = 32;

// initialize a collection to store our alive pixels which we will draw
const alivePixels: { [key: string]: number } = {};

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas: HTMLCanvasElement = document.getElementById(
  "game-of-life-canvas"
) as HTMLCanvasElement;
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");
if (ctx !== null) {
  ctx.fillStyle = ALIVE_COLOR;
}

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

    for (let key of Object.keys(alivePixels)) {
      const coords = key.split(",");
      const x = parseInt(coords[0]);
      const y = parseInt(coords[1]);

      ctx.fillRect(
        x * (CELL_SIZE + 1) + 1,
        y * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
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

      const key = `${x},${y}`;
      if (isAlive) {
        alivePixels[key] = 1;
      } else {
        delete alivePixels[key];
      }
    }
  }
}

requestAnimationFrame(renderLoop);
