import { parseClientMsg, parseServerMsg, KeyChange } from "./messaging";

console.log("starting worker");

const DOMAIN = "localhost:3000/";
const socket = new WebSocket(`ws://${DOMAIN}echo`);

socket.onopen = onConnect;
socket.onmessage = onServerMessage;

function onConnect(event: Event) {
  console.log(`connected to websocket server at ${DOMAIN}`);
}

function onServerMessage(event: MessageEvent) {
  const msg = parseServerMsg(event.data, worker);

  msg.handle();
}

const worker: Worker = self as any;
worker.onmessage = onClientMessage;

function onClientMessage(evt: MessageEvent) {
  const msg = parseClientMsg(evt.data, socket);

  msg.handle();
}
