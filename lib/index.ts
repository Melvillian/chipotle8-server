import {
  parseServerMsg,
  Message,
  MessageType,
  DisconnectMessage,
  DisplayChangeMessage,
} from "./messaging";

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
  }
}
