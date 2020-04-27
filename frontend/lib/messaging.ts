import { Key } from "./key";
import { DisplayChange } from "./display_change";

const serverMessageTypes = ["disconnect", "displaychange"];
const clientMessageTypes = ["keychange"];

/**
 * The types of events we'll receive over the websocket from the server
 */
export enum MessageType {
  Disconnect = "disconnect",
  DisplayChange = "displaychange",
  KeyDown = "keydown",
  KeyUp = "keyup",
}

/**
 * A message sent by the server
 */
export interface ServerMessage {
  handle: (workerSocket: Worker) => void;
}

/**
 * A message sent by the client
 */
export interface ClientMessage {
  handle: (websocket: WebSocket) => void;
}

/**
 * A Message sent by the client when a key is pressed up or down
 */
export class KeyMessage implements ClientMessage {
  isUp: boolean; // up or down
  key: Key;

  /**
   * Create a KeyMessage
   * @param isUp true if the key was released, false otherwise
   * @param key the key that was pressed or released
   */
  constructor(isUp: boolean, key: Key) {
    this.isUp = isUp;
    this.key = key;
  }

  handle(websocket: WebSocket) {
    // TODO
  }
}

/**
 * A Message sent by the server when another user disconnects
 */
export class DisconnectMessage implements ServerMessage {
  userId: number;

  constructor(data: { type: string; userId: number }) {
    if (data.type !== "disconnect" || typeof data.userId !== "number") {
      throw new Error(
        `bad data passed to DisconnectMessage constructor ${data}`
      );
    }
    this.userId = data.userId;
  }

  handle(webworker: Worker) {
    // TODO
  }
}

/**
 * A Message sent by the server when a pixel on the 64x32 CHIP-8 display changes
 */
export class DisplayChangeMessage implements ServerMessage {
  changes: DisplayChange[];

  constructor(data: { type: string; changes: DisplayChange[] }) {
    if (data.type !== "displaychange") {
      throw new Error(
        `bad data passed to DisplayChangeMessage constructor ${data}`
      );
    }
    this.changes = data.changes;
  }

  handle(webworker: Worker) {
    for (let change of this.changes) {
      webworker.postMessage(change);
    }
  }
}

/**
 * parse the raw string data send from the server and returns the correct Message type for the caller
 * to handle
 * @param rawData a message sent by the server to the client
 * @param worker a web worker we'll use to communicate with the clent's main thread rendering logic
 */
export function parseServerMsg(rawData: string, worker: Worker): ServerMessage {
  let data = JSON.parse(rawData);
  switch (data.type) {
    case "disconnect": {
      return new DisconnectMessage(data);
    }

    case "displaychange": {
      return new DisplayChangeMessage(data);
    }

    default: {
      throw new Error(`incorrect Message passed to handleMessage: ${data}`);
    }
  }
}

/**
 * parse a webworker message from the client into a Message which can be handled
 *
 * @param rawData the JSON data from a websocket MessageEvent
 * @param socket a socket we'll use to communicate with the server
 */
// export function parseClientMsg(rawData: string, socket: WebSocket): ClientMessage {
//   let data = JSON.parse(rawData);
//   switch (data.type) {
//     case "keychange": {
//       return new KeyMessage(data)
//     }
//   }
// }
