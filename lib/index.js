import io from 'socket.io-client';


const socket = io('http://localhost:3000/chat');

console.log('init');

socket.on('connect', onConnect);

function onConnect(){
  console.log('connect ' + socket.id);
}
