import { parseServerMsg } from "./messaging";

console.log("starting worker");

const DOMAIN = "localhost:3000/";
const socket = new WebSocket(`ws://${DOMAIN}echo`);

socket.onopen = onConnect;
socket.onmessage = onMessage;

function onConnect(event: Event) {
  console.log(`connected to websocket server at ${DOMAIN}`);
}

const worker: Worker = self as any;

worker.onmessage = (event: MessageEvent) => {
  // TODO
  //const msg: Message = parseClientMsg(event.data, socket);
};
function onMessage(event: MessageEvent) {
  const msg = parseServerMsg(event.data, worker);

  msg.handle(worker);
}
