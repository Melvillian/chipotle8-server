/******/ (function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function (exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      });
      /******/
    }
    /******/
  }; // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function (exports) {
    /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module",
      });
      /******/
    }
    /******/ Object.defineProperty(exports, "__esModule", { value: true });
    /******/
  }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function (
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value);
    /******/ if (mode & 8) return value;
    /******/ if (
      mode & 4 &&
      typeof value === "object" &&
      value &&
      value.__esModule
    )
      return value;
    /******/ var ns = Object.create(null);
    /******/ __webpack_require__.r(ns);
    /******/ Object.defineProperty(ns, "default", {
      enumerable: true,
      value: value,
    });
    /******/ if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    /******/ return ns;
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function (module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module["default"];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__(
    (__webpack_require__.s = "./frontend/lib/index.ts")
  );
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ "./frontend/lib/index.ts":
      /*!*******************************!*\
  !*** ./frontend/lib/index.ts ***!
  \*******************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        var messaging_1 = __webpack_require__(
          /*! ./messaging */ "./frontend/lib/messaging.ts"
        );
        var MyWorker = __webpack_require__(
          /*! worker-loader?name=[name].js!./worker */ "./node_modules/worker-loader/dist/cjs.js?name=[name].js!./frontend/lib/worker.ts"
        );
        var worker = new MyWorker();
        var CELL_SIZE = 10;
        var DEAD_COLOR = "#000000";
        var ALIVE_COLOR = "#FFFFFF";
        var width = 64;
        var height = 32;
        var alivePixels = {};
        var canvas = document.getElementById("game-of-life-canvas");
        canvas.height = (CELL_SIZE + 1) * height + 1;
        canvas.width = (CELL_SIZE + 1) * width + 1;
        var ctx = canvas.getContext("2d");
        if (ctx !== null) {
          ctx.fillStyle = ALIVE_COLOR;
        }
        var renderLoop = function () {
          drawCells();
          requestAnimationFrame(renderLoop);
        };
        var getIndex = function (x, y) {
          return y * width + x;
        };
        var drawCells = function () {
          if (ctx !== null) {
            ctx.beginPath();
            for (
              var _i = 0, _a = Object.keys(alivePixels);
              _i < _a.length;
              _i++
            ) {
              var key = _a[_i];
              var coords = key.split(",");
              var x = parseInt(coords[0]);
              var y = parseInt(coords[1]);
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
        var socket = new WebSocket("ws://localhost:3000/echo");
        socket.onopen = onConnect;
        socket.onmessage = onMessage;
        function onConnect(event) {
          console.log("we're connected!");
          socket.send(JSON.stringify({ type: "disconnect", userId: 4 }));
        }
        function onMessage(event) {
          var parsed = messaging_1.parseServerMsg(event.data);
          if (parsed.type() === messaging_1.MessageType.Disconnect) {
            console.log("received disconnect");
            var msg = parsed;
          } else if (parsed.type() === messaging_1.MessageType.DisplayChange) {
            console.log("received displaychange");
            var msg = parsed;
            var changes = msg.changes;
            for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
              var change = changes_1[_i];
              var x = change.x,
                y = change.y,
                isAlive = change.isAlive;
              var key = x + "," + y;
              if (isAlive) {
                alivePixels[key] = 1;
              } else {
                delete alivePixels[key];
              }
            }
          }
        }
        requestAnimationFrame(renderLoop);

        /***/
      },

    /***/ "./frontend/lib/messaging.ts":
      /*!***********************************!*\
  !*** ./frontend/lib/messaging.ts ***!
  \***********************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        var messageTypes = ["disconnect", "displaychange", "keydown", "keyup"];
        var displayChangeExample = [{ x: 0, y: 0, isAlive: true }];
        var MessageType;
        (function (MessageType) {
          MessageType["Disconnect"] = "disconnect";
          MessageType["DisplayChange"] = "displaychange";
          MessageType["KeyDown"] = "keydown";
          MessageType["KeyUp"] = "keyup";
        })((MessageType = exports.MessageType || (exports.MessageType = {})));
        var KeyMessage = (function () {
          function KeyMessage(isUp, key) {
            this.keyType = isUp ? MessageType.KeyUp : MessageType.KeyDown;
            this.key = key;
          }
          KeyMessage.prototype.type = function () {
            return this.keyType;
          };
          KeyMessage.prototype.toJSON = function () {
            return JSON.stringify({ type: this.type(), key: this.key });
          };
          return KeyMessage;
        })();
        exports.KeyMessage = KeyMessage;
        var DisconnectMessage = (function () {
          function DisconnectMessage(data) {
            if (data.type !== "disconnect" || typeof data.userId !== "number") {
              throw new Error(
                "bad data passed to DisconnectMessage constructor " + data
              );
            }
            this.userId = data.userId;
          }
          DisconnectMessage.prototype.type = function () {
            return MessageType.Disconnect;
          };
          DisconnectMessage.prototype.toJSON = function () {
            return JSON.stringify({ type: this.type(), userId: this.userId });
          };
          return DisconnectMessage;
        })();
        exports.DisconnectMessage = DisconnectMessage;
        var DisplayChangeMessage = (function () {
          function DisplayChangeMessage(data) {
            if (
              data.type !== "displaychange" ||
              typeof data.changes !== typeof displayChangeExample
            ) {
              throw new Error(
                "bad data passed to DisplayChangeMessage constructor " + data
              );
            }
            this.changes = data.changes;
          }
          DisplayChangeMessage.prototype.type = function () {
            return MessageType.DisplayChange;
          };
          DisplayChangeMessage.prototype.toJSON = function () {
            return JSON.stringify({ type: this.type(), changes: this.changes });
          };
          return DisplayChangeMessage;
        })();
        exports.DisplayChangeMessage = DisplayChangeMessage;
        function parseServerMsg(rawData) {
          var data = JSON.parse(rawData);
          switch (data.type) {
            case "disconnect": {
              return new DisconnectMessage(data);
            }
            case "displaychange": {
              return new DisplayChangeMessage(data);
            }
            default: {
              throw new Error(
                "incorrect Message passed to handleMessage: " + data
              );
            }
          }
        }
        exports.parseServerMsg = parseServerMsg;
        function sendKeyUpMsg(socket, key) {
          var msg = new KeyMessage(true, key);
          socket.send(msg.toJSON());
        }
        exports.sendKeyUpMsg = sendKeyUpMsg;
        function sendKeyDownMsg(socket, key) {
          var msg = new KeyMessage(false, key);
          socket.send(msg.toJSON());
        }
        exports.sendKeyDownMsg = sendKeyDownMsg;

        /***/
      },

    /***/ "./node_modules/worker-loader/dist/cjs.js?name=[name].js!./frontend/lib/worker.ts":
      /*!****************************************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js?name=[name].js!./frontend/lib/worker.ts ***!
  \****************************************************************************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        module.exports = function () {
          return new Worker(__webpack_require__.p + "worker.js");
        };

        /***/
      },

    /******/
  }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvbGliL2luZGV4LnRzIiwid2VicGFjazovLy8uL2Zyb250ZW5kL2xpYi9tZXNzYWdpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvbGliL3dvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsd0ZBS3FCO0FBQ3JCLG9LQUFtRTtBQUVuRSxJQUFJLE1BQU0sR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBRTVCLElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNyQixJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDN0IsSUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDO0FBQzlCLElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNqQixJQUFNLE1BQU0sR0FBRyxF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QUM7QUFDNUIsQ0FBQztBQUhELHdDQUdDOzs7Ozs7Ozs7Ozs7QUNqSkQ7QUFDQSxvQkFBb0IscUJBQXVCO0FBQzNDLEUiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9mcm9udGVuZC9saWIvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQge1xuICBwYXJzZVNlcnZlck1zZyxcbiAgTWVzc2FnZVR5cGUsXG4gIERpc2Nvbm5lY3RNZXNzYWdlLFxuICBEaXNwbGF5Q2hhbmdlTWVzc2FnZSxcbn0gZnJvbSBcIi4vbWVzc2FnaW5nXCI7XG5pbXBvcnQgTXlXb3JrZXIgPSByZXF1aXJlKFwid29ya2VyLWxvYWRlcj9uYW1lPVtuYW1lXS5qcyEuL3dvcmtlclwiKTtcblxubGV0IHdvcmtlciA9IG5ldyBNeVdvcmtlcigpO1xuXG5jb25zdCBDRUxMX1NJWkUgPSAxMDsgLy8gcHhcbmNvbnN0IERFQURfQ09MT1IgPSBcIiMwMDAwMDBcIjtcbmNvbnN0IEFMSVZFX0NPTE9SID0gXCIjRkZGRkZGXCI7XG5jb25zdCB3aWR0aCA9IDY0O1xuY29uc3QgaGVpZ2h0ID0gMzI7XG5cbi8vIGluaXRpYWxpemUgYSBjb2xsZWN0aW9uIHRvIHN0b3JlIG91ciBhbGl2ZSBwaXhlbHMgd2hpY2ggd2Ugd2lsbCBkcmF3XG5jb25zdCBhbGl2ZVBpeGVsczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xuXG4vLyBHaXZlIHRoZSBjYW52YXMgcm9vbSBmb3IgYWxsIG9mIG91ciBjZWxscyBhbmQgYSAxcHggYm9yZGVyXG4vLyBhcm91bmQgZWFjaCBvZiB0aGVtLlxuY29uc3QgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICBcImdhbWUtb2YtbGlmZS1jYW52YXNcIlxuKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbmNhbnZhcy5oZWlnaHQgPSAoQ0VMTF9TSVpFICsgMSkgKiBoZWlnaHQgKyAxO1xuY2FudmFzLndpZHRoID0gKENFTExfU0laRSArIDEpICogd2lkdGggKyAxO1xuXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuaWYgKGN0eCAhPT0gbnVsbCkge1xuICBjdHguZmlsbFN0eWxlID0gQUxJVkVfQ09MT1I7XG59XG5cbmNvbnN0IHJlbmRlckxvb3AgPSAoKSA9PiB7XG4gIGRyYXdDZWxscygpO1xuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJMb29wKTtcbn07XG5cbmNvbnN0IGdldEluZGV4ID0gKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiB7XG4gIHJldHVybiB5ICogd2lkdGggKyB4O1xufTtcblxuY29uc3QgZHJhd0NlbGxzID0gKCkgPT4ge1xuICBpZiAoY3R4ICE9PSBudWxsKSB7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKGFsaXZlUGl4ZWxzKSkge1xuICAgICAgY29uc3QgY29vcmRzID0ga2V5LnNwbGl0KFwiLFwiKTtcbiAgICAgIGNvbnN0IHggPSBwYXJzZUludChjb29yZHNbMF0pO1xuICAgICAgY29uc3QgeSA9IHBhcnNlSW50KGNvb3Jkc1sxXSlcblxuICAgICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICB4ICogKENFTExfU0laRSArIDEpICsgMSxcbiAgICAgICAgeSAqIChDRUxMX1NJWkUgKyAxKSArIDEsXG4gICAgICAgIENFTExfU0laRSxcbiAgICAgICAgQ0VMTF9TSVpFXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjdHguc3Ryb2tlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImZhaWxlZCB0byBsb2FkIDJkIGNhbnZhcyBjb250ZXh0IVwiKTtcbiAgfVxufTtcblxuY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjMwMDAvZWNob1wiKTtcblxuc29ja2V0Lm9ub3BlbiA9IG9uQ29ubmVjdDtcbnNvY2tldC5vbm1lc3NhZ2UgPSBvbk1lc3NhZ2U7XG5cbmZ1bmN0aW9uIG9uQ29ubmVjdChldmVudDogRXZlbnQpIHtcbiAgY29uc29sZS5sb2coXCJ3ZSdyZSBjb25uZWN0ZWQhXCIpO1xuICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IHR5cGU6IFwiZGlzY29ubmVjdFwiLCB1c2VySWQ6IDQgfSkpO1xufVxuXG5mdW5jdGlvbiBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCkge1xuICBjb25zdCBwYXJzZWQgPSBwYXJzZVNlcnZlck1zZyhldmVudC5kYXRhKTtcblxuICBpZiAocGFyc2VkLnR5cGUoKSA9PT0gTWVzc2FnZVR5cGUuRGlzY29ubmVjdCkge1xuICAgIGNvbnNvbGUubG9nKFwicmVjZWl2ZWQgZGlzY29ubmVjdFwiKTtcbiAgICBjb25zdCBtc2cgPSBwYXJzZWQgYXMgRGlzY29ubmVjdE1lc3NhZ2U7XG4gIH0gZWxzZSBpZiAocGFyc2VkLnR5cGUoKSA9PT0gTWVzc2FnZVR5cGUuRGlzcGxheUNoYW5nZSkge1xuICAgIGNvbnNvbGUubG9nKFwicmVjZWl2ZWQgZGlzcGxheWNoYW5nZVwiKTtcbiAgICBjb25zdCBtc2cgPSBwYXJzZWQgYXMgRGlzcGxheUNoYW5nZU1lc3NhZ2U7XG5cbiAgICBjb25zdCBjaGFuZ2VzID0gbXNnLmNoYW5nZXM7XG5cbiAgICBmb3IgKGxldCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgY29uc3QgeyB4LCB5LCBpc0FsaXZlIH0gPSBjaGFuZ2U7XG5cbiAgICAgIGNvbnN0IGtleSA9IGAke3h9LCR7eX1gO1xuICAgICAgaWYgKGlzQWxpdmUpIHtcbiAgICAgICAgYWxpdmVQaXhlbHNba2V5XSA9IDFcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBhbGl2ZVBpeGVsc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyTG9vcCk7XG4iLCJpbXBvcnQgeyBLZXkgfSBmcm9tIFwiLi9rZXlcIjtcbmltcG9ydCB7IERpc3BsYXlDaGFuZ2UgfSBmcm9tIFwiLi9kaXNwbGF5X2NoYW5nZVwiO1xuXG4vLyB1c2VkIHRvIHdlIGNhbiBzZWFyY2ggZm9yIHN0cmluZ3MgdGhhdCBtYXRjaCBvdXIgTWVzc2FnZVR5cGUgZW51bSdzIHZhcmlhbnRzLiBTaG91bGQgYWx3YXlzXG4vLyBtYXRjaCB0aGUgc3RyaW5ncyBpbiBNZXNzYWdlVHlwZVxuY29uc3QgbWVzc2FnZVR5cGVzID0gW1wiZGlzY29ubmVjdFwiLCBcImRpc3BsYXljaGFuZ2VcIiwgXCJrZXlkb3duXCIsIFwia2V5dXBcIl07XG5cbi8vIHVzZWQgc28gd2UgY2FuIGNhbGN1bGF0ZSBpdHMgYHR5cGVvZmAgYW5kIGNvbXBhcmUgaXQgYWdhaW5zdCB0aGUgdHlwZSBvZiBpbmNvbWluZyBtZXNzYWdlIGRhdGFcbmNvbnN0IGRpc3BsYXlDaGFuZ2VFeGFtcGxlOiBEaXNwbGF5Q2hhbmdlW10gPSBbeyB4OiAwLCB5OiAwLCBpc0FsaXZlOiB0cnVlIH1dO1xuXG4vKipcbiAqIFRoZSB0eXBlcyBvZiBldmVudHMgd2UnbGwgcmVjZWl2ZSBvdmVyIHRoZSB3ZWJzb2NrZXQgZnJvbSB0aGUgc2VydmVyXG4gKi9cbmV4cG9ydCBlbnVtIE1lc3NhZ2VUeXBlIHtcbiAgRGlzY29ubmVjdCA9IFwiZGlzY29ubmVjdFwiLFxuICBEaXNwbGF5Q2hhbmdlID0gXCJkaXNwbGF5Y2hhbmdlXCIsXG4gIEtleURvd24gPSBcImtleWRvd25cIixcbiAgS2V5VXAgPSBcImtleXVwXCIsXG59XG5cbi8qKlxuICogQSBtZXNzYWdlIHNlbnQgb3IgcmVjZWl2ZWQgdmlhIFdlYlNvY2tldHNcbiAqL1xuaW50ZXJmYWNlIE1lc3NhZ2Uge1xuICB0eXBlOiAoKSA9PiBNZXNzYWdlVHlwZTtcbiAgdG9KU09OOiAoKSA9PiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBNZXNzYWdlIGZvciB0aGUgS2V5VXAgYW5kIEtleURvd24gTWVzc2FnZVR5cGVzXG4gKi9cbmV4cG9ydCBjbGFzcyBLZXlNZXNzYWdlIGltcGxlbWVudHMgTWVzc2FnZSB7XG4gIGtleVR5cGU6IE1lc3NhZ2VUeXBlOyAvLyB1cCBvciBkb3duXG4gIGtleTogS2V5O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBLZXlNZXNzYWdlXG4gICAqIEBwYXJhbSBpc1VwIHRydWUgaWYgdGhpcyBpcyBmb3IgYSBLZXlVcCBNZXNzYWdlVHlwZSwgZmFsc2UgaWYgaXQncyBmb3IgYSBLZXlEb3duIE1lc3NhZ2VUeXBlXG4gICAqIEBwYXJhbSBrZXkgdGhlIGtleSB0aGF0IHdhcyBwcmVzc2VkIG9yIHJlbGVhc2VkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpc1VwOiBib29sZWFuLCBrZXk6IEtleSkge1xuICAgIHRoaXMua2V5VHlwZSA9IGlzVXAgPyBNZXNzYWdlVHlwZS5LZXlVcCA6IE1lc3NhZ2VUeXBlLktleURvd247XG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gIH1cblxuICB0eXBlKCk6IE1lc3NhZ2VUeXBlIHtcbiAgICByZXR1cm4gdGhpcy5rZXlUeXBlO1xuICB9XG5cbiAgdG9KU09OKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgdHlwZTogdGhpcy50eXBlKCksIGtleTogdGhpcy5rZXkgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIE1lc3NhZ2UgZm9yIHRoZSBEaXNjb25uZWN0IE1lc3NhZ2VUeXBlXG4gKi9cbmV4cG9ydCBjbGFzcyBEaXNjb25uZWN0TWVzc2FnZSBpbXBsZW1lbnRzIE1lc3NhZ2Uge1xuICB1c2VySWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YS50eXBlICE9PSBcImRpc2Nvbm5lY3RcIiB8fCB0eXBlb2YgZGF0YS51c2VySWQgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGJhZCBkYXRhIHBhc3NlZCB0byBEaXNjb25uZWN0TWVzc2FnZSBjb25zdHJ1Y3RvciAke2RhdGF9YFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy51c2VySWQgPSBkYXRhLnVzZXJJZDtcbiAgfVxuXG4gIHR5cGUoKTogTWVzc2FnZVR5cGUge1xuICAgIHJldHVybiBNZXNzYWdlVHlwZS5EaXNjb25uZWN0O1xuICB9XG5cbiAgdG9KU09OKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgdHlwZTogdGhpcy50eXBlKCksIHVzZXJJZDogdGhpcy51c2VySWQgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIE1lc3NhZ2UgZm9yIHRoZSBEaXNwbGF5Q2hhbmdlIE1lc3NhZ2VUeXBlXG4gKi9cbmV4cG9ydCBjbGFzcyBEaXNwbGF5Q2hhbmdlTWVzc2FnZSBpbXBsZW1lbnRzIE1lc3NhZ2Uge1xuICBjaGFuZ2VzOiBEaXNwbGF5Q2hhbmdlW107XG5cbiAgY29uc3RydWN0b3IoZGF0YTogYW55KSB7XG4gICAgaWYgKFxuICAgICAgZGF0YS50eXBlICE9PSBcImRpc3BsYXljaGFuZ2VcIiB8fFxuICAgICAgdHlwZW9mIGRhdGEuY2hhbmdlcyAhPT0gdHlwZW9mIGRpc3BsYXlDaGFuZ2VFeGFtcGxlXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBiYWQgZGF0YSBwYXNzZWQgdG8gRGlzcGxheUNoYW5nZU1lc3NhZ2UgY29uc3RydWN0b3IgJHtkYXRhfWBcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuY2hhbmdlcyA9IGRhdGEuY2hhbmdlcztcbiAgfVxuXG4gIHR5cGUoKTogTWVzc2FnZVR5cGUge1xuICAgIHJldHVybiBNZXNzYWdlVHlwZS5EaXNwbGF5Q2hhbmdlO1xuICB9XG5cbiAgdG9KU09OKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgdHlwZTogdGhpcy50eXBlKCksIGNoYW5nZXM6IHRoaXMuY2hhbmdlcyB9KTtcbiAgfVxufVxuXG4vKipcbiAqIHBhcnNlZCB0aGUgcmF3IHN0cmluZyBkYXRhIHNlbmQgZnJvbSB0aGUgc2VydmVyIGFuZCByZXR1cm5zIHRoZSBjb3JyZWN0IE1lc3NhZ2UgdHlwZSBmb3IgdGhlIGNhbGxlclxuICogdG8gaGFuZGxlXG4gKiBAcGFyYW0gcmF3RGF0YSBhIG1lc3NhZ2Ugc2VudCBieSB0aGUgc2VydmVyIHRvIHRoZSBjbGllbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2VydmVyTXNnKHJhd0RhdGE6IHN0cmluZyk6IE1lc3NhZ2Uge1xuICBsZXQgZGF0YSA9IEpTT04ucGFyc2UocmF3RGF0YSk7XG4gIHN3aXRjaCAoZGF0YS50eXBlKSB7XG4gICAgY2FzZSBcImRpc2Nvbm5lY3RcIjoge1xuICAgICAgcmV0dXJuIG5ldyBEaXNjb25uZWN0TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBjYXNlIFwiZGlzcGxheWNoYW5nZVwiOiB7XG4gICAgICByZXR1cm4gbmV3IERpc3BsYXlDaGFuZ2VNZXNzYWdlKGRhdGEpO1xuICAgIH1cblxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgaW5jb3JyZWN0IE1lc3NhZ2UgcGFzc2VkIHRvIGhhbmRsZU1lc3NhZ2U6ICR7ZGF0YX1gKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZW5kIGEga2V5dXAgbWVzc2FnZSB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHNvY2tldCBUaGUgd2Vic29ja2V0IHNoYXJlZCB3aXRoIHRoZSBzZXJ2ZXJcbiAqIEBwYXJhbSBrZXkgVGhlIGtleSB3aGljaCB3YXMgcmVsZWFzZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbmRLZXlVcE1zZyhzb2NrZXQ6IFdlYlNvY2tldCwga2V5OiBLZXkpIHtcbiAgbGV0IG1zZyA9IG5ldyBLZXlNZXNzYWdlKHRydWUsIGtleSk7XG4gIHNvY2tldC5zZW5kKG1zZy50b0pTT04oKSk7XG59XG5cbi8qKlxuICogU2VuZCBhIGtleWRvd24gbWVzc2FnZSB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHNvY2tldCBUaGUgd2Vic29ja2V0IHNoYXJlZCB3aXRoIHRoZSBzZXJ2ZXJcbiAqIEBwYXJhbSBrZXkgVGhlIGtleSB3aGljaCB3YXMgcHJlc3NlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZEtleURvd25Nc2coc29ja2V0OiBXZWJTb2NrZXQsIGtleTogS2V5KSB7XG4gIGxldCBtc2cgPSBuZXcgS2V5TWVzc2FnZShmYWxzZSwga2V5KTtcbiAgc29ja2V0LnNlbmQobXNnLnRvSlNPTigpKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgV29ya2VyKF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJ3b3JrZXIuanNcIik7XG59OyJdLCJzb3VyY2VSb290IjoiIn0=
