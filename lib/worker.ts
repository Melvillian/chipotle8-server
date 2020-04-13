import {
  parseServerMsg,
  MessageType,
  DisconnectMessage,
  DisplayChangeMessage,
} from "./messaging";

const ctx: Worker = self as any;

console.log("starting worker");

const DOMAIN = "localhost:3000/";
const socket = new WebSocket(`ws://${DOMAIN}echo`);

socket.onopen = onConnect;
socket.onmessage = onMessage;

function onConnect(event: Event) {
  console.log(`connected to websocket server at ${DOMAIN}`);
}

function onMessage(event: MessageEvent) {
  const parsed = parseServerMsg(event.data);

  if (parsed.type() === MessageType.Disconnect) {
    console.log("received disconnect");
    const msg = parsed as DisconnectMessage;
  } else if (parsed.type() === MessageType.DisplayChange) {
    const msg = parsed as DisplayChangeMessage;

    for (let change of msg.changes) {
      ctx.postMessage(change);
    }
  }
}
