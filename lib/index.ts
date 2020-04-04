const socket = new WebSocket("ws://localhost:3000/echo");

console.log("init");

socket.onopen = onConnect;

function onConnect(event: Event) {
  console.log("it connected! with event");
  console.log(event);
  socket.send("sending blarf");
}
