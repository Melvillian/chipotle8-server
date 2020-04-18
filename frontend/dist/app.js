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
        var GRID_COLOR = "#CCCCCC";
        var DEAD_COLOR = "#000000";
        var ALIVE_COLOR = "#FFFFFF";
        var width = 64;
        var height = 32;
        var display = new Array(width * height);
        for (var i = 0; i < width * height; i++) {
          display.push(0);
        }
        var canvas = document.getElementById("game-of-life-canvas");
        canvas.height = (CELL_SIZE + 1) * height + 1;
        canvas.width = (CELL_SIZE + 1) * width + 1;
        var ctx = canvas.getContext("2d");
        var renderLoop = function () {
          drawCells();
          requestAnimationFrame(renderLoop);
        };
        var drawGrid = function () {
          if (ctx !== null) {
            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;
            for (var i = 0; i <= width; i++) {
              ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
              ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
            }
            for (var j = 0; j <= height; j++) {
              ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
              ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
            }
            ctx.stroke();
          } else {
            console.error("failed to load 2d canvas context!");
          }
        };
        var getIndex = function (x, y) {
          return y * width + x;
        };
        var drawCells = function () {
          if (ctx !== null) {
            ctx.beginPath();
            for (var row = 0; row < height; row++) {
              for (var col = 0; col < width; col++) {
                var idx = getIndex(col, row);
                ctx.fillStyle = display[idx] === 1 ? ALIVE_COLOR : DEAD_COLOR;
                ctx.fillRect(
                  col * (CELL_SIZE + 1) + 1,
                  row * (CELL_SIZE + 1) + 1,
                  CELL_SIZE,
                  CELL_SIZE
                );
              }
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
              var idx = getIndex(x, y);
              display[idx] ^= isAlive ? 1 : 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvbGliL2luZGV4LnRzIiwid2VicGFjazovLy8uL2Zyb250ZW5kL2xpYi9tZXNzYWdpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvbGliL3dvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsd0ZBS3FCO0FBQ3JCLG9LQUFtRTtBQUVuRSxJQUFJLE1BQU0sR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBRTVCLElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNyQixJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDN0IsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzdCLElBQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUM5QixJQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDakIsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBR2xCLElBQU0sT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQztBQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2pCO0FBSUQsSUFBTSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQ3ZELHFCQUFxQixDQUNELENBQUM7QUFDdkIsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUUzQyxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXBDLElBQU0sVUFBVSxHQUFHO0lBRWpCLFNBQVMsRUFBRSxDQUFDO0lBRVoscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUYsSUFBTSxRQUFRLEdBQUc7SUFDZixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDaEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBRzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbkU7UUFHRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN2QyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Q7U0FBTTtRQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztLQUNwRDtBQUNILENBQUMsQ0FBQztBQUVGLElBQU0sUUFBUSxHQUFHLFVBQUMsQ0FBUyxFQUFFLENBQVM7SUFDcEMsT0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUN2QixDQUFDLENBQUM7QUFFRixJQUFNLFNBQVMsR0FBRztJQUNoQixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDaEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWhCLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDckMsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtnQkFDcEMsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFFL0IsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztnQkFFOUQsR0FBRyxDQUFDLFFBQVEsQ0FDVixHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUN6QixHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUN6QixTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUM7YUFDSDtTQUNGO1FBRUQsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Q7U0FBTTtRQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztLQUNwRDtBQUNILENBQUMsQ0FBQztBQUVGLElBQU0sTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFekQsTUFBTSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDMUIsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFFN0IsU0FBUyxTQUFTLENBQUMsS0FBWTtJQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxLQUFtQjtJQUNwQyxJQUFNLE1BQU0sR0FBRywwQkFBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUxQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyx1QkFBVyxDQUFDLFVBQVUsRUFBRTtRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDbkMsSUFBTSxHQUFHLEdBQUcsTUFBMkIsQ0FBQztLQUN6QztTQUFNLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLHVCQUFXLENBQUMsYUFBYSxFQUFFO1FBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN0QyxJQUFNLEdBQUcsR0FBRyxNQUE4QixDQUFDO1FBRTNDLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFFNUIsS0FBbUIsVUFBTyxFQUFQLG1CQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPLEVBQUU7WUFBdkIsSUFBSSxNQUFNO1lBQ0wsZ0JBQUMsRUFBRSxZQUFDLEVBQUUsd0JBQU8sQ0FBWTtZQUNqQyxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO0tBQ0Y7QUFDSCxDQUFDO0FBRUQscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3JIbEMsSUFBTSxZQUFZLEdBQUcsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUd6RSxJQUFNLG9CQUFvQixHQUFvQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBSzlFLElBQVksV0FLWDtBQUxELFdBQVksV0FBVztJQUNyQix3Q0FBeUI7SUFDekIsOENBQStCO0lBQy9CLGtDQUFtQjtJQUNuQiw4QkFBZTtBQUNqQixDQUFDLEVBTFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFLdEI7QUFhRDtJQVNFLG9CQUFZLElBQWEsRUFBRSxHQUFRO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQzlELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7SUFFRCx5QkFBSSxHQUFKO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCwyQkFBTSxHQUFOO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQztBQXJCWSxnQ0FBVTtBQTBCdkI7SUFHRSwyQkFBWSxJQUFTO1FBQ25CLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxZQUFZLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUNqRSxNQUFNLElBQUksS0FBSyxDQUNiLHNEQUFvRCxJQUFNLENBQzNELENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM1QixDQUFDO0lBRUQsZ0NBQUksR0FBSjtRQUNFLE9BQU8sV0FBVyxDQUFDLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsa0NBQU0sR0FBTjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUM7QUFuQlksOENBQWlCO0FBd0I5QjtJQUdFLDhCQUFZLElBQVM7UUFDbkIsSUFDRSxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQWU7WUFDN0IsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLE9BQU8sb0JBQW9CLEVBQ25EO1lBQ0EsTUFBTSxJQUFJLEtBQUssQ0FDYix5REFBdUQsSUFBTSxDQUM5RCxDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDOUIsQ0FBQztJQUVELG1DQUFJLEdBQUo7UUFDRSxPQUFPLFdBQVcsQ0FBQyxhQUFhLENBQUM7SUFDbkMsQ0FBQztJQUVELHFDQUFNLEdBQU47UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBQ0gsMkJBQUM7QUFBRCxDQUFDO0FBdEJZLG9EQUFvQjtBQTZCakMsU0FBZ0IsY0FBYyxDQUFDLE9BQWU7SUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDakIsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUNqQixPQUFPLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEM7UUFFRCxLQUFLLGVBQWUsQ0FBQyxDQUFDO1lBQ3BCLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QztRQUVELE9BQU8sQ0FBQyxDQUFDO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBOEMsSUFBTSxDQUFDLENBQUM7U0FDdkU7S0FDRjtBQUNILENBQUM7QUFmRCx3Q0FlQztBQU9ELFNBQWdCLFlBQVksQ0FBQyxNQUFpQixFQUFFLEdBQVE7SUFDdEQsSUFBSSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUhELG9DQUdDO0FBT0QsU0FBZ0IsY0FBYyxDQUFDLE1BQWlCLEVBQUUsR0FBUTtJQUN4RCxJQUFJLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBSEQsd0NBR0M7Ozs7Ozs7Ozs7OztBQ2pKRDtBQUNBLG9CQUFvQixxQkFBdUI7QUFDM0MsRSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Zyb250ZW5kL2xpYi9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7XG4gIHBhcnNlU2VydmVyTXNnLFxuICBNZXNzYWdlVHlwZSxcbiAgRGlzY29ubmVjdE1lc3NhZ2UsXG4gIERpc3BsYXlDaGFuZ2VNZXNzYWdlLFxufSBmcm9tIFwiLi9tZXNzYWdpbmdcIjtcbmltcG9ydCBNeVdvcmtlciA9IHJlcXVpcmUoXCJ3b3JrZXItbG9hZGVyP25hbWU9W25hbWVdLmpzIS4vd29ya2VyXCIpO1xuXG5sZXQgd29ya2VyID0gbmV3IE15V29ya2VyKCk7XG5cbmNvbnN0IENFTExfU0laRSA9IDEwOyAvLyBweFxuY29uc3QgR1JJRF9DT0xPUiA9IFwiI0NDQ0NDQ1wiO1xuY29uc3QgREVBRF9DT0xPUiA9IFwiIzAwMDAwMFwiO1xuY29uc3QgQUxJVkVfQ09MT1IgPSBcIiNGRkZGRkZcIjtcbmNvbnN0IHdpZHRoID0gNjQ7XG5jb25zdCBoZWlnaHQgPSAzMjtcblxuLy8gaW5pdGlhbGl6ZSBkaXNwbGF5IGFuZCBmaWxsIHdpdGggZW1wdHkgcGl4ZWxzXG5jb25zdCBkaXNwbGF5ID0gbmV3IEFycmF5KHdpZHRoICogaGVpZ2h0KTtcbmZvciAobGV0IGkgPSAwOyBpIDwgd2lkdGggKiBoZWlnaHQ7IGkrKykge1xuICBkaXNwbGF5LnB1c2goMCk7XG59XG5cbi8vIEdpdmUgdGhlIGNhbnZhcyByb29tIGZvciBhbGwgb2Ygb3VyIGNlbGxzIGFuZCBhIDFweCBib3JkZXJcbi8vIGFyb3VuZCBlYWNoIG9mIHRoZW0uXG5jb25zdCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gIFwiZ2FtZS1vZi1saWZlLWNhbnZhc1wiXG4pIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuY2FudmFzLmhlaWdodCA9IChDRUxMX1NJWkUgKyAxKSAqIGhlaWdodCArIDE7XG5jYW52YXMud2lkdGggPSAoQ0VMTF9TSVpFICsgMSkgKiB3aWR0aCArIDE7XG5cbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbmNvbnN0IHJlbmRlckxvb3AgPSAoKSA9PiB7XG4gIC8vZHJhd0dyaWQoKTtcbiAgZHJhd0NlbGxzKCk7XG5cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlckxvb3ApO1xufTtcblxuY29uc3QgZHJhd0dyaWQgPSAoKSA9PiB7XG4gIGlmIChjdHggIT09IG51bGwpIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gR1JJRF9DT0xPUjtcblxuICAgIC8vIFZlcnRpY2FsIGxpbmVzLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHdpZHRoOyBpKyspIHtcbiAgICAgIGN0eC5tb3ZlVG8oaSAqIChDRUxMX1NJWkUgKyAxKSArIDEsIDApO1xuICAgICAgY3R4LmxpbmVUbyhpICogKENFTExfU0laRSArIDEpICsgMSwgKENFTExfU0laRSArIDEpICogaGVpZ2h0ICsgMSk7XG4gICAgfVxuXG4gICAgLy8gSG9yaXpvbnRhbCBsaW5lcy5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8PSBoZWlnaHQ7IGorKykge1xuICAgICAgY3R4Lm1vdmVUbygwLCBqICogKENFTExfU0laRSArIDEpICsgMSk7XG4gICAgICBjdHgubGluZVRvKChDRUxMX1NJWkUgKyAxKSAqIHdpZHRoICsgMSwgaiAqIChDRUxMX1NJWkUgKyAxKSArIDEpO1xuICAgIH1cblxuICAgIGN0eC5zdHJva2UoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiZmFpbGVkIHRvIGxvYWQgMmQgY2FudmFzIGNvbnRleHQhXCIpO1xuICB9XG59O1xuXG5jb25zdCBnZXRJbmRleCA9ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4ge1xuICByZXR1cm4geSAqIHdpZHRoICsgeDtcbn07XG5cbmNvbnN0IGRyYXdDZWxscyA9ICgpID0+IHtcbiAgaWYgKGN0eCAhPT0gbnVsbCkge1xuICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGhlaWdodDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHdpZHRoOyBjb2wrKykge1xuICAgICAgICBjb25zdCBpZHggPSBnZXRJbmRleChjb2wsIHJvdyk7XG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGRpc3BsYXlbaWR4XSA9PT0gMSA/IEFMSVZFX0NPTE9SIDogREVBRF9DT0xPUjtcblxuICAgICAgICBjdHguZmlsbFJlY3QoXG4gICAgICAgICAgY29sICogKENFTExfU0laRSArIDEpICsgMSxcbiAgICAgICAgICByb3cgKiAoQ0VMTF9TSVpFICsgMSkgKyAxLFxuICAgICAgICAgIENFTExfU0laRSxcbiAgICAgICAgICBDRUxMX1NJWkVcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjdHguc3Ryb2tlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImZhaWxlZCB0byBsb2FkIDJkIGNhbnZhcyBjb250ZXh0IVwiKTtcbiAgfVxufTtcblxuY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjMwMDAvZWNob1wiKTtcblxuc29ja2V0Lm9ub3BlbiA9IG9uQ29ubmVjdDtcbnNvY2tldC5vbm1lc3NhZ2UgPSBvbk1lc3NhZ2U7XG5cbmZ1bmN0aW9uIG9uQ29ubmVjdChldmVudDogRXZlbnQpIHtcbiAgY29uc29sZS5sb2coXCJ3ZSdyZSBjb25uZWN0ZWQhXCIpO1xuICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IHR5cGU6IFwiZGlzY29ubmVjdFwiLCB1c2VySWQ6IDQgfSkpO1xufVxuXG5mdW5jdGlvbiBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCkge1xuICBjb25zdCBwYXJzZWQgPSBwYXJzZVNlcnZlck1zZyhldmVudC5kYXRhKTtcblxuICBpZiAocGFyc2VkLnR5cGUoKSA9PT0gTWVzc2FnZVR5cGUuRGlzY29ubmVjdCkge1xuICAgIGNvbnNvbGUubG9nKFwicmVjZWl2ZWQgZGlzY29ubmVjdFwiKTtcbiAgICBjb25zdCBtc2cgPSBwYXJzZWQgYXMgRGlzY29ubmVjdE1lc3NhZ2U7XG4gIH0gZWxzZSBpZiAocGFyc2VkLnR5cGUoKSA9PT0gTWVzc2FnZVR5cGUuRGlzcGxheUNoYW5nZSkge1xuICAgIGNvbnNvbGUubG9nKFwicmVjZWl2ZWQgZGlzcGxheWNoYW5nZVwiKTtcbiAgICBjb25zdCBtc2cgPSBwYXJzZWQgYXMgRGlzcGxheUNoYW5nZU1lc3NhZ2U7XG5cbiAgICBjb25zdCBjaGFuZ2VzID0gbXNnLmNoYW5nZXM7XG5cbiAgICBmb3IgKGxldCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgY29uc3QgeyB4LCB5LCBpc0FsaXZlIH0gPSBjaGFuZ2U7XG4gICAgICBjb25zdCBpZHggPSBnZXRJbmRleCh4LCB5KTtcbiAgICAgIGRpc3BsYXlbaWR4XSBePSBpc0FsaXZlID8gMSA6IDA7XG4gICAgfVxuICB9XG59XG5cbnJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJMb29wKTtcbiIsImltcG9ydCB7IEtleSB9IGZyb20gXCIuL2tleVwiO1xuaW1wb3J0IHsgRGlzcGxheUNoYW5nZSB9IGZyb20gXCIuL2Rpc3BsYXlfY2hhbmdlXCI7XG5cbi8vIHVzZWQgdG8gd2UgY2FuIHNlYXJjaCBmb3Igc3RyaW5ncyB0aGF0IG1hdGNoIG91ciBNZXNzYWdlVHlwZSBlbnVtJ3MgdmFyaWFudHMuIFNob3VsZCBhbHdheXNcbi8vIG1hdGNoIHRoZSBzdHJpbmdzIGluIE1lc3NhZ2VUeXBlXG5jb25zdCBtZXNzYWdlVHlwZXMgPSBbXCJkaXNjb25uZWN0XCIsIFwiZGlzcGxheWNoYW5nZVwiLCBcImtleWRvd25cIiwgXCJrZXl1cFwiXTtcblxuLy8gdXNlZCBzbyB3ZSBjYW4gY2FsY3VsYXRlIGl0cyBgdHlwZW9mYCBhbmQgY29tcGFyZSBpdCBhZ2FpbnN0IHRoZSB0eXBlIG9mIGluY29taW5nIG1lc3NhZ2UgZGF0YVxuY29uc3QgZGlzcGxheUNoYW5nZUV4YW1wbGU6IERpc3BsYXlDaGFuZ2VbXSA9IFt7IHg6IDAsIHk6IDAsIGlzQWxpdmU6IHRydWUgfV07XG5cbi8qKlxuICogVGhlIHR5cGVzIG9mIGV2ZW50cyB3ZSdsbCByZWNlaXZlIG92ZXIgdGhlIHdlYnNvY2tldCBmcm9tIHRoZSBzZXJ2ZXJcbiAqL1xuZXhwb3J0IGVudW0gTWVzc2FnZVR5cGUge1xuICBEaXNjb25uZWN0ID0gXCJkaXNjb25uZWN0XCIsXG4gIERpc3BsYXlDaGFuZ2UgPSBcImRpc3BsYXljaGFuZ2VcIixcbiAgS2V5RG93biA9IFwia2V5ZG93blwiLFxuICBLZXlVcCA9IFwia2V5dXBcIixcbn1cblxuLyoqXG4gKiBBIG1lc3NhZ2Ugc2VudCBvciByZWNlaXZlZCB2aWEgV2ViU29ja2V0c1xuICovXG5pbnRlcmZhY2UgTWVzc2FnZSB7XG4gIHR5cGU6ICgpID0+IE1lc3NhZ2VUeXBlO1xuICB0b0pTT046ICgpID0+IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIE1lc3NhZ2UgZm9yIHRoZSBLZXlVcCBhbmQgS2V5RG93biBNZXNzYWdlVHlwZXNcbiAqL1xuZXhwb3J0IGNsYXNzIEtleU1lc3NhZ2UgaW1wbGVtZW50cyBNZXNzYWdlIHtcbiAga2V5VHlwZTogTWVzc2FnZVR5cGU7IC8vIHVwIG9yIGRvd25cbiAga2V5OiBLZXk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIEtleU1lc3NhZ2VcbiAgICogQHBhcmFtIGlzVXAgdHJ1ZSBpZiB0aGlzIGlzIGZvciBhIEtleVVwIE1lc3NhZ2VUeXBlLCBmYWxzZSBpZiBpdCdzIGZvciBhIEtleURvd24gTWVzc2FnZVR5cGVcbiAgICogQHBhcmFtIGtleSB0aGUga2V5IHRoYXQgd2FzIHByZXNzZWQgb3IgcmVsZWFzZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlzVXA6IGJvb2xlYW4sIGtleTogS2V5KSB7XG4gICAgdGhpcy5rZXlUeXBlID0gaXNVcCA/IE1lc3NhZ2VUeXBlLktleVVwIDogTWVzc2FnZVR5cGUuS2V5RG93bjtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgfVxuXG4gIHR5cGUoKTogTWVzc2FnZVR5cGUge1xuICAgIHJldHVybiB0aGlzLmtleVR5cGU7XG4gIH1cblxuICB0b0pTT04oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiB0aGlzLnR5cGUoKSwga2V5OiB0aGlzLmtleSB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEEgTWVzc2FnZSBmb3IgdGhlIERpc2Nvbm5lY3QgTWVzc2FnZVR5cGVcbiAqL1xuZXhwb3J0IGNsYXNzIERpc2Nvbm5lY3RNZXNzYWdlIGltcGxlbWVudHMgTWVzc2FnZSB7XG4gIHVzZXJJZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IGFueSkge1xuICAgIGlmIChkYXRhLnR5cGUgIT09IFwiZGlzY29ubmVjdFwiIHx8IHR5cGVvZiBkYXRhLnVzZXJJZCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgYmFkIGRhdGEgcGFzc2VkIHRvIERpc2Nvbm5lY3RNZXNzYWdlIGNvbnN0cnVjdG9yICR7ZGF0YX1gXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkO1xuICB9XG5cbiAgdHlwZSgpOiBNZXNzYWdlVHlwZSB7XG4gICAgcmV0dXJuIE1lc3NhZ2VUeXBlLkRpc2Nvbm5lY3Q7XG4gIH1cblxuICB0b0pTT04oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiB0aGlzLnR5cGUoKSwgdXNlcklkOiB0aGlzLnVzZXJJZCB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEEgTWVzc2FnZSBmb3IgdGhlIERpc3BsYXlDaGFuZ2UgTWVzc2FnZVR5cGVcbiAqL1xuZXhwb3J0IGNsYXNzIERpc3BsYXlDaGFuZ2VNZXNzYWdlIGltcGxlbWVudHMgTWVzc2FnZSB7XG4gIGNoYW5nZXM6IERpc3BsYXlDaGFuZ2VbXTtcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBhbnkpIHtcbiAgICBpZiAoXG4gICAgICBkYXRhLnR5cGUgIT09IFwiZGlzcGxheWNoYW5nZVwiIHx8XG4gICAgICB0eXBlb2YgZGF0YS5jaGFuZ2VzICE9PSB0eXBlb2YgZGlzcGxheUNoYW5nZUV4YW1wbGVcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGJhZCBkYXRhIHBhc3NlZCB0byBEaXNwbGF5Q2hhbmdlTWVzc2FnZSBjb25zdHJ1Y3RvciAke2RhdGF9YFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jaGFuZ2VzID0gZGF0YS5jaGFuZ2VzO1xuICB9XG5cbiAgdHlwZSgpOiBNZXNzYWdlVHlwZSB7XG4gICAgcmV0dXJuIE1lc3NhZ2VUeXBlLkRpc3BsYXlDaGFuZ2U7XG4gIH1cblxuICB0b0pTT04oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiB0aGlzLnR5cGUoKSwgY2hhbmdlczogdGhpcy5jaGFuZ2VzIH0pO1xuICB9XG59XG5cbi8qKlxuICogcGFyc2VkIHRoZSByYXcgc3RyaW5nIGRhdGEgc2VuZCBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHJldHVybnMgdGhlIGNvcnJlY3QgTWVzc2FnZSB0eXBlIGZvciB0aGUgY2FsbGVyXG4gKiB0byBoYW5kbGVcbiAqIEBwYXJhbSByYXdEYXRhIGEgbWVzc2FnZSBzZW50IGJ5IHRoZSBzZXJ2ZXIgdG8gdGhlIGNsaWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTZXJ2ZXJNc2cocmF3RGF0YTogc3RyaW5nKTogTWVzc2FnZSB7XG4gIGxldCBkYXRhID0gSlNPTi5wYXJzZShyYXdEYXRhKTtcbiAgc3dpdGNoIChkYXRhLnR5cGUpIHtcbiAgICBjYXNlIFwiZGlzY29ubmVjdFwiOiB7XG4gICAgICByZXR1cm4gbmV3IERpc2Nvbm5lY3RNZXNzYWdlKGRhdGEpO1xuICAgIH1cblxuICAgIGNhc2UgXCJkaXNwbGF5Y2hhbmdlXCI6IHtcbiAgICAgIHJldHVybiBuZXcgRGlzcGxheUNoYW5nZU1lc3NhZ2UoZGF0YSk7XG4gICAgfVxuXG4gICAgZGVmYXVsdDoge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbmNvcnJlY3QgTWVzc2FnZSBwYXNzZWQgdG8gaGFuZGxlTWVzc2FnZTogJHtkYXRhfWApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNlbmQgYSBrZXl1cCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAcGFyYW0gc29ja2V0IFRoZSB3ZWJzb2NrZXQgc2hhcmVkIHdpdGggdGhlIHNlcnZlclxuICogQHBhcmFtIGtleSBUaGUga2V5IHdoaWNoIHdhcyByZWxlYXNlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZEtleVVwTXNnKHNvY2tldDogV2ViU29ja2V0LCBrZXk6IEtleSkge1xuICBsZXQgbXNnID0gbmV3IEtleU1lc3NhZ2UodHJ1ZSwga2V5KTtcbiAgc29ja2V0LnNlbmQobXNnLnRvSlNPTigpKTtcbn1cblxuLyoqXG4gKiBTZW5kIGEga2V5ZG93biBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAcGFyYW0gc29ja2V0IFRoZSB3ZWJzb2NrZXQgc2hhcmVkIHdpdGggdGhlIHNlcnZlclxuICogQHBhcmFtIGtleSBUaGUga2V5IHdoaWNoIHdhcyBwcmVzc2VkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZW5kS2V5RG93bk1zZyhzb2NrZXQ6IFdlYlNvY2tldCwga2V5OiBLZXkpIHtcbiAgbGV0IG1zZyA9IG5ldyBLZXlNZXNzYWdlKGZhbHNlLCBrZXkpO1xuICBzb2NrZXQuc2VuZChtc2cudG9KU09OKCkpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBXb3JrZXIoX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIndvcmtlci5qc1wiKTtcbn07Il0sInNvdXJjZVJvb3QiOiIifQ==
