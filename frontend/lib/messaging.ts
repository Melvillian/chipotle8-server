/**
 * A message sent by the server
 */
export interface ServerMessage {
  handle: () => void;
}

/**
 * A message sent by the client
 */
export interface ClientMessage {
  handle: () => void;
}

/**
 * DisplayChange represents the pixel state for the pixel at x and y coordinates, where "true" is white and "false" is black.
 *
 * For example, we might have `let change: DisplayChange = { x: 0, x: 0, isAlive: true };` for a white pixel in the top left of the display
 */
type DisplayChange = { x: number; y: number; isAlive: boolean };

/**
 * KeyChange represents when the client has pressed or released a key. The client main thread in index.ts, where
 * these events are generated, filters down key presses so they are only 1 of the 16 hexadecimal keys. This way
 * the main thread doesn't needlessly use resources to send unactionable keys to the worker thread.
 */
export type KeyChange = { key: string; isUp: boolean };

/**
 * A Message sent by the client when a key is pressed up or down
 */
export class KeyMessage implements ClientMessage {
  isUp: boolean; // up or down
  key: string;
  websocket: WebSocket;

  /**
   * Create a KeyMessage
   * @param isUp true if the key was released, false otherwise
   * @param key the key that was pressed or released
   */
  constructor(data: { isUp: boolean; key: string }, websocket: WebSocket) {
    this.isUp = data.isUp;
    this.key = data.key;
    this.websocket = websocket;
  }

  handle() {
    console.log(`key: ${this.key}`);
  }
}

/**
 * A Message sent by the server when another user disconnects
 */
export class DisconnectMessage implements ServerMessage {
  userId: number;
  worker: Worker;

  constructor(data: { type: string; userId: number }, worker: Worker) {
    if (data.type !== "disconnect" || typeof data.userId !== "number") {
      throw new Error(
        `bad data passed to DisconnectMessage constructor ${data}`
      );
    }
    this.userId = data.userId;
    this.worker = worker;
  }

  handle() {
    // TODO
  }
}

/**
 * A Message sent by the server when a pixel on the 64x32 CHIP-8 display changes
 */
export class DisplayChangeMessage implements ServerMessage {
  changes: DisplayChange[];
  worker: Worker;

  constructor(
    data: { type: string; changes: DisplayChange[] },
    worker: Worker
  ) {
    if (data.type !== "displaychange") {
      throw new Error(
        `bad data passed to DisplayChangeMessage constructor ${data}`
      );
    }
    this.changes = data.changes;
    this.worker = worker;
  }

  handle() {
    for (let change of this.changes) {
      this.worker.postMessage(change);
    }
  }
}

/**
 * parse the raw string data send from the server and returns the correct Message type for the caller
 * to handle
 * @param jsonString a message sent by the server to the client
 * @param worker a web worker we'll use to communicate with the clent's main thread rendering logic
 */
export function parseServerMsg(
  jsonString: string,
  worker: Worker
): ServerMessage {
  let eventData = JSON.parse(jsonString);
  switch (eventData.type) {
    case "disconnect": {
      return new DisconnectMessage(eventData, worker);
    }

    case "displaychange": {
      return new DisplayChangeMessage(eventData, worker);
    }

    default: {
      throw new Error(
        `incorrect Message passed to parseServerMsg: ${jsonString}`
      );
    }
  }
}

/**
 * parse a webworker message from the client into a Message which can be handled
 *
 * @param jsonString event data sent by the client to the server
 * @param socket a socket we'll use to communicate with the server
 */
export function parseClientMsg(
  jsonString: string,
  socket: WebSocket
): ClientMessage {
  let eventData = JSON.parse(jsonString);
  if (eventData.key !== undefined) {
    // it's a keychange event
    let data = eventData as KeyChange;
    return new KeyMessage(data, socket);
  } else {
    // we may add more events here and refactor this into a switch for better handling
    throw new Error(
      `incorrect Message passed to parseClientMsg: ${jsonString}`
    );
  }
}
