import { Key } from "./key";
import { DisplayChange } from "./display_change";

// used to we can search for strings that match our MessageType enum's variants. Should always
// match the strings in MessageType
const messageTypes = ["disconnect", "displaychange", "keydown", "keyup"];

// used so we can calculate its `typeof` and compare it against the type of incoming message data
const displayChangeExample = [[0, 0, true]];

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
 * A message sent or received via WebSockets
 */
export interface Message {
  type: () => MessageType;
  toJSON: () => string;
}

/**
 * A Message for the KeyUp and KeyDown MessageTypes
 */
export class KeyMessage implements Message {
  keyType: MessageType; // up or down
  key: Key;

  /**
   * Create a KeyMessage
   * @param isUp true if this is for a KeyUp MessageType, false if it's for a KeyDown MessageType
   * @param key the key that was pressed or released
   */
  constructor(isUp: boolean, key: Key) {
    this.keyType = isUp ? MessageType.KeyUp : MessageType.KeyDown;
    this.key = key;
  }

  type(): MessageType {
    return this.keyType;
  }

  toJSON(): string {
    return JSON.stringify({ type: this.type(), key: this.key });
  }
}

/**
 * A Message for the Disconnect MessageType
 */
export class DisconnectMessage implements Message {
  userId: number;

  constructor(data: any) {
    if (data.type !== "disconnect" || typeof data.userId !== "number") {
      throw new Error(
        `bad data passed to DisconnectMessage constructor ${data}`
      );
    }
    this.userId = data.userId;
  }

  type(): MessageType {
    return MessageType.Disconnect;
  }

  toJSON(): string {
    return JSON.stringify({ type: this.type(), userId: this.userId });
  }
}

/**
 * A Message for the DisplayChange MessageType
 */
export class DisplayChangeMessage implements Message {
  changes: DisplayChange[];

  constructor(data: any) {
    if (
      data.type !== "displaychange" ||
      typeof data.changes !== typeof displayChangeExample
    ) {
      throw new Error(
        `bad data passed to DisplayChangeMessage constructor ${data}`
      );
    }
    this.changes = data.changes;
  }

  type(): MessageType {
    return MessageType.DisplayChange;
  }

  toJSON(): string {
    return JSON.stringify({ type: this.type(), changes: this.changes });
  }
}

/**
 * parsed the raw string data send from the server and returns the correct Message type for the caller
 * to handle
 * @param rawData a message sent by the server to the client
 */
export function parseServerMsg(rawData: string): Message {
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
 * Send a keyup message to the server.
 * @param socket The websocket shared with the server
 * @param key The key which was released
 */
export function sendKeyUpMsg(socket: WebSocket, key: Key) {
  let msg = new KeyMessage(true, key);
  socket.send(msg.toJSON());
}

/**
 * Send a keydown message to the server.
 * @param socket The websocket shared with the server
 * @param key The key which was pressed
 */
export function sendKeyDownMsg(socket: WebSocket, key: Key) {
  let msg = new KeyMessage(false, key);
  socket.send(msg.toJSON());
}
