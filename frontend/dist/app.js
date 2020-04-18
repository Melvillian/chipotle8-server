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
        var DEAD_COLOR = "#FFFFFF";
        var ALIVE_COLOR = "#000000";
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
          drawGrid();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvbGliL2luZGV4LnRzIiwid2VicGFjazovLy8uL2Zyb250ZW5kL2xpYi9tZXNzYWdpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvbGliL3dvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsd0ZBS3FCO0FBQ3JCLG9LQUFtRTtBQUVuRSxJQUFJLE1BQU0sR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBRTVCLElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNyQixJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDN0IsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzdCLElBQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUM5QixJQUFNLEtBQUssR0FBRyxF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LENBQUMsQ0FBQztJQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFIRCx3Q0FHQzs7Ozs7Ozs7Ozs7O0FDakpEO0FBQ0Esb0JBQW9CLHFCQUF1QjtBQUMzQyxFIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vZnJvbnRlbmQvbGliL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHtcbiAgcGFyc2VTZXJ2ZXJNc2csXG4gIE1lc3NhZ2VUeXBlLFxuICBEaXNjb25uZWN0TWVzc2FnZSxcbiAgRGlzcGxheUNoYW5nZU1lc3NhZ2UsXG59IGZyb20gXCIuL21lc3NhZ2luZ1wiO1xuaW1wb3J0IE15V29ya2VyID0gcmVxdWlyZShcIndvcmtlci1sb2FkZXI/bmFtZT1bbmFtZV0uanMhLi93b3JrZXJcIik7XG5cbmxldCB3b3JrZXIgPSBuZXcgTXlXb3JrZXIoKTtcblxuY29uc3QgQ0VMTF9TSVpFID0gMTA7IC8vIHB4XG5jb25zdCBHUklEX0NPTE9SID0gXCIjQ0NDQ0NDXCI7XG5jb25zdCBERUFEX0NPTE9SID0gXCIjRkZGRkZGXCI7XG5jb25zdCBBTElWRV9DT0xPUiA9IFwiIzAwMDAwMFwiO1xuY29uc3Qgd2lkdGggPSA2NDtcbmNvbnN0IGhlaWdodCA9IDMyO1xuXG4vLyBpbml0aWFsaXplIGRpc3BsYXkgYW5kIGZpbGwgd2l0aCBlbXB0eSBwaXhlbHNcbmNvbnN0IGRpc3BsYXkgPSBuZXcgQXJyYXkod2lkdGggKiBoZWlnaHQpO1xuZm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aCAqIGhlaWdodDsgaSsrKSB7XG4gIGRpc3BsYXkucHVzaCgwKTtcbn1cblxuLy8gR2l2ZSB0aGUgY2FudmFzIHJvb20gZm9yIGFsbCBvZiBvdXIgY2VsbHMgYW5kIGEgMXB4IGJvcmRlclxuLy8gYXJvdW5kIGVhY2ggb2YgdGhlbS5cbmNvbnN0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgXCJnYW1lLW9mLWxpZmUtY2FudmFzXCJcbikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG5jYW52YXMuaGVpZ2h0ID0gKENFTExfU0laRSArIDEpICogaGVpZ2h0ICsgMTtcbmNhbnZhcy53aWR0aCA9IChDRUxMX1NJWkUgKyAxKSAqIHdpZHRoICsgMTtcblxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuY29uc3QgcmVuZGVyTG9vcCA9ICgpID0+IHtcbiAgZHJhd0dyaWQoKTtcbiAgZHJhd0NlbGxzKCk7XG5cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlckxvb3ApO1xufTtcblxuY29uc3QgZHJhd0dyaWQgPSAoKSA9PiB7XG4gIGlmIChjdHggIT09IG51bGwpIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gR1JJRF9DT0xPUjtcblxuICAgIC8vIFZlcnRpY2FsIGxpbmVzLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHdpZHRoOyBpKyspIHtcbiAgICAgIGN0eC5tb3ZlVG8oaSAqIChDRUxMX1NJWkUgKyAxKSArIDEsIDApO1xuICAgICAgY3R4LmxpbmVUbyhpICogKENFTExfU0laRSArIDEpICsgMSwgKENFTExfU0laRSArIDEpICogaGVpZ2h0ICsgMSk7XG4gICAgfVxuXG4gICAgLy8gSG9yaXpvbnRhbCBsaW5lcy5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8PSBoZWlnaHQ7IGorKykge1xuICAgICAgY3R4Lm1vdmVUbygwLCBqICogKENFTExfU0laRSArIDEpICsgMSk7XG4gICAgICBjdHgubGluZVRvKChDRUxMX1NJWkUgKyAxKSAqIHdpZHRoICsgMSwgaiAqIChDRUxMX1NJWkUgKyAxKSArIDEpO1xuICAgIH1cblxuICAgIGN0eC5zdHJva2UoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiZmFpbGVkIHRvIGxvYWQgMmQgY2FudmFzIGNvbnRleHQhXCIpO1xuICB9XG59O1xuXG5jb25zdCBnZXRJbmRleCA9ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4ge1xuICByZXR1cm4geSAqIHdpZHRoICsgeDtcbn07XG5cbmNvbnN0IGRyYXdDZWxscyA9ICgpID0+IHtcbiAgaWYgKGN0eCAhPT0gbnVsbCkge1xuICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGhlaWdodDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHdpZHRoOyBjb2wrKykge1xuICAgICAgICBjb25zdCBpZHggPSBnZXRJbmRleChjb2wsIHJvdyk7XG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGRpc3BsYXlbaWR4XSA9PT0gMSA/IEFMSVZFX0NPTE9SIDogREVBRF9DT0xPUjtcblxuICAgICAgICBjdHguZmlsbFJlY3QoXG4gICAgICAgICAgY29sICogKENFTExfU0laRSArIDEpICsgMSxcbiAgICAgICAgICByb3cgKiAoQ0VMTF9TSVpFICsgMSkgKyAxLFxuICAgICAgICAgIENFTExfU0laRSxcbiAgICAgICAgICBDRUxMX1NJWkVcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjdHguc3Ryb2tlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcImZhaWxlZCB0byBsb2FkIDJkIGNhbnZhcyBjb250ZXh0IVwiKTtcbiAgfVxufTtcblxuY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjMwMDAvZWNob1wiKTtcblxuc29ja2V0Lm9ub3BlbiA9IG9uQ29ubmVjdDtcbnNvY2tldC5vbm1lc3NhZ2UgPSBvbk1lc3NhZ2U7XG5cbmZ1bmN0aW9uIG9uQ29ubmVjdChldmVudDogRXZlbnQpIHtcbiAgY29uc29sZS5sb2coXCJ3ZSdyZSBjb25uZWN0ZWQhXCIpO1xuICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IHR5cGU6IFwiZGlzY29ubmVjdFwiLCB1c2VySWQ6IDQgfSkpO1xufVxuXG5mdW5jdGlvbiBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCkge1xuICBjb25zdCBwYXJzZWQgPSBwYXJzZVNlcnZlck1zZyhldmVudC5kYXRhKTtcblxuICBpZiAocGFyc2VkLnR5cGUoKSA9PT0gTWVzc2FnZVR5cGUuRGlzY29ubmVjdCkge1xuICAgIGNvbnNvbGUubG9nKFwicmVjZWl2ZWQgZGlzY29ubmVjdFwiKTtcbiAgICBjb25zdCBtc2cgPSBwYXJzZWQgYXMgRGlzY29ubmVjdE1lc3NhZ2U7XG4gIH0gZWxzZSBpZiAocGFyc2VkLnR5cGUoKSA9PT0gTWVzc2FnZVR5cGUuRGlzcGxheUNoYW5nZSkge1xuICAgIGNvbnNvbGUubG9nKFwicmVjZWl2ZWQgZGlzcGxheWNoYW5nZVwiKTtcbiAgICBjb25zdCBtc2cgPSBwYXJzZWQgYXMgRGlzcGxheUNoYW5nZU1lc3NhZ2U7XG5cbiAgICBjb25zdCBjaGFuZ2VzID0gbXNnLmNoYW5nZXM7XG5cbiAgICBmb3IgKGxldCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgY29uc3QgeyB4LCB5LCBpc0FsaXZlIH0gPSBjaGFuZ2U7XG4gICAgICBjb25zdCBpZHggPSBnZXRJbmRleCh4LCB5KTtcbiAgICAgIGRpc3BsYXlbaWR4XSBePSBpc0FsaXZlID8gMSA6IDA7XG4gICAgfVxuICB9XG59XG5cbnJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJMb29wKTtcbiIsImltcG9ydCB7IEtleSB9IGZyb20gXCIuL2tleVwiO1xuaW1wb3J0IHsgRGlzcGxheUNoYW5nZSB9IGZyb20gXCIuL2Rpc3BsYXlfY2hhbmdlXCI7XG5cbi8vIHVzZWQgdG8gd2UgY2FuIHNlYXJjaCBmb3Igc3RyaW5ncyB0aGF0IG1hdGNoIG91ciBNZXNzYWdlVHlwZSBlbnVtJ3MgdmFyaWFudHMuIFNob3VsZCBhbHdheXNcbi8vIG1hdGNoIHRoZSBzdHJpbmdzIGluIE1lc3NhZ2VUeXBlXG5jb25zdCBtZXNzYWdlVHlwZXMgPSBbXCJkaXNjb25uZWN0XCIsIFwiZGlzcGxheWNoYW5nZVwiLCBcImtleWRvd25cIiwgXCJrZXl1cFwiXTtcblxuLy8gdXNlZCBzbyB3ZSBjYW4gY2FsY3VsYXRlIGl0cyBgdHlwZW9mYCBhbmQgY29tcGFyZSBpdCBhZ2FpbnN0IHRoZSB0eXBlIG9mIGluY29taW5nIG1lc3NhZ2UgZGF0YVxuY29uc3QgZGlzcGxheUNoYW5nZUV4YW1wbGU6IERpc3BsYXlDaGFuZ2VbXSA9IFt7IHg6IDAsIHk6IDAsIGlzQWxpdmU6IHRydWUgfV07XG5cbi8qKlxuICogVGhlIHR5cGVzIG9mIGV2ZW50cyB3ZSdsbCByZWNlaXZlIG92ZXIgdGhlIHdlYnNvY2tldCBmcm9tIHRoZSBzZXJ2ZXJcbiAqL1xuZXhwb3J0IGVudW0gTWVzc2FnZVR5cGUge1xuICBEaXNjb25uZWN0ID0gXCJkaXNjb25uZWN0XCIsXG4gIERpc3BsYXlDaGFuZ2UgPSBcImRpc3BsYXljaGFuZ2VcIixcbiAgS2V5RG93biA9IFwia2V5ZG93blwiLFxuICBLZXlVcCA9IFwia2V5dXBcIixcbn1cblxuLyoqXG4gKiBBIG1lc3NhZ2Ugc2VudCBvciByZWNlaXZlZCB2aWEgV2ViU29ja2V0c1xuICovXG5pbnRlcmZhY2UgTWVzc2FnZSB7XG4gIHR5cGU6ICgpID0+IE1lc3NhZ2VUeXBlO1xuICB0b0pTT046ICgpID0+IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIE1lc3NhZ2UgZm9yIHRoZSBLZXlVcCBhbmQgS2V5RG93biBNZXNzYWdlVHlwZXNcbiAqL1xuZXhwb3J0IGNsYXNzIEtleU1lc3NhZ2UgaW1wbGVtZW50cyBNZXNzYWdlIHtcbiAga2V5VHlwZTogTWVzc2FnZVR5cGU7IC8vIHVwIG9yIGRvd25cbiAga2V5OiBLZXk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIEtleU1lc3NhZ2VcbiAgICogQHBhcmFtIGlzVXAgdHJ1ZSBpZiB0aGlzIGlzIGZvciBhIEtleVVwIE1lc3NhZ2VUeXBlLCBmYWxzZSBpZiBpdCdzIGZvciBhIEtleURvd24gTWVzc2FnZVR5cGVcbiAgICogQHBhcmFtIGtleSB0aGUga2V5IHRoYXQgd2FzIHByZXNzZWQgb3IgcmVsZWFzZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlzVXA6IGJvb2xlYW4sIGtleTogS2V5KSB7XG4gICAgdGhpcy5rZXlUeXBlID0gaXNVcCA/IE1lc3NhZ2VUeXBlLktleVVwIDogTWVzc2FnZVR5cGUuS2V5RG93bjtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgfVxuXG4gIHR5cGUoKTogTWVzc2FnZVR5cGUge1xuICAgIHJldHVybiB0aGlzLmtleVR5cGU7XG4gIH1cblxuICB0b0pTT04oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiB0aGlzLnR5cGUoKSwga2V5OiB0aGlzLmtleSB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEEgTWVzc2FnZSBmb3IgdGhlIERpc2Nvbm5lY3QgTWVzc2FnZVR5cGVcbiAqL1xuZXhwb3J0IGNsYXNzIERpc2Nvbm5lY3RNZXNzYWdlIGltcGxlbWVudHMgTWVzc2FnZSB7XG4gIHVzZXJJZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IGFueSkge1xuICAgIGlmIChkYXRhLnR5cGUgIT09IFwiZGlzY29ubmVjdFwiIHx8IHR5cGVvZiBkYXRhLnVzZXJJZCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgYmFkIGRhdGEgcGFzc2VkIHRvIERpc2Nvbm5lY3RNZXNzYWdlIGNvbnN0cnVjdG9yICR7ZGF0YX1gXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkO1xuICB9XG5cbiAgdHlwZSgpOiBNZXNzYWdlVHlwZSB7XG4gICAgcmV0dXJuIE1lc3NhZ2VUeXBlLkRpc2Nvbm5lY3Q7XG4gIH1cblxuICB0b0pTT04oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiB0aGlzLnR5cGUoKSwgdXNlcklkOiB0aGlzLnVzZXJJZCB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEEgTWVzc2FnZSBmb3IgdGhlIERpc3BsYXlDaGFuZ2UgTWVzc2FnZVR5cGVcbiAqL1xuZXhwb3J0IGNsYXNzIERpc3BsYXlDaGFuZ2VNZXNzYWdlIGltcGxlbWVudHMgTWVzc2FnZSB7XG4gIGNoYW5nZXM6IERpc3BsYXlDaGFuZ2VbXTtcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBhbnkpIHtcbiAgICBpZiAoXG4gICAgICBkYXRhLnR5cGUgIT09IFwiZGlzcGxheWNoYW5nZVwiIHx8XG4gICAgICB0eXBlb2YgZGF0YS5jaGFuZ2VzICE9PSB0eXBlb2YgZGlzcGxheUNoYW5nZUV4YW1wbGVcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGJhZCBkYXRhIHBhc3NlZCB0byBEaXNwbGF5Q2hhbmdlTWVzc2FnZSBjb25zdHJ1Y3RvciAke2RhdGF9YFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jaGFuZ2VzID0gZGF0YS5jaGFuZ2VzO1xuICB9XG5cbiAgdHlwZSgpOiBNZXNzYWdlVHlwZSB7XG4gICAgcmV0dXJuIE1lc3NhZ2VUeXBlLkRpc3BsYXlDaGFuZ2U7XG4gIH1cblxuICB0b0pTT04oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiB0aGlzLnR5cGUoKSwgY2hhbmdlczogdGhpcy5jaGFuZ2VzIH0pO1xuICB9XG59XG5cbi8qKlxuICogcGFyc2VkIHRoZSByYXcgc3RyaW5nIGRhdGEgc2VuZCBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHJldHVybnMgdGhlIGNvcnJlY3QgTWVzc2FnZSB0eXBlIGZvciB0aGUgY2FsbGVyXG4gKiB0byBoYW5kbGVcbiAqIEBwYXJhbSByYXdEYXRhIGEgbWVzc2FnZSBzZW50IGJ5IHRoZSBzZXJ2ZXIgdG8gdGhlIGNsaWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTZXJ2ZXJNc2cocmF3RGF0YTogc3RyaW5nKTogTWVzc2FnZSB7XG4gIGxldCBkYXRhID0gSlNPTi5wYXJzZShyYXdEYXRhKTtcbiAgc3dpdGNoIChkYXRhLnR5cGUpIHtcbiAgICBjYXNlIFwiZGlzY29ubmVjdFwiOiB7XG4gICAgICByZXR1cm4gbmV3IERpc2Nvbm5lY3RNZXNzYWdlKGRhdGEpO1xuICAgIH1cblxuICAgIGNhc2UgXCJkaXNwbGF5Y2hhbmdlXCI6IHtcbiAgICAgIHJldHVybiBuZXcgRGlzcGxheUNoYW5nZU1lc3NhZ2UoZGF0YSk7XG4gICAgfVxuXG4gICAgZGVmYXVsdDoge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbmNvcnJlY3QgTWVzc2FnZSBwYXNzZWQgdG8gaGFuZGxlTWVzc2FnZTogJHtkYXRhfWApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNlbmQgYSBrZXl1cCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAcGFyYW0gc29ja2V0IFRoZSB3ZWJzb2NrZXQgc2hhcmVkIHdpdGggdGhlIHNlcnZlclxuICogQHBhcmFtIGtleSBUaGUga2V5IHdoaWNoIHdhcyByZWxlYXNlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZEtleVVwTXNnKHNvY2tldDogV2ViU29ja2V0LCBrZXk6IEtleSkge1xuICBsZXQgbXNnID0gbmV3IEtleU1lc3NhZ2UodHJ1ZSwga2V5KTtcbiAgc29ja2V0LnNlbmQobXNnLnRvSlNPTigpKTtcbn1cblxuLyoqXG4gKiBTZW5kIGEga2V5ZG93biBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuXG4gKiBAcGFyYW0gc29ja2V0IFRoZSB3ZWJzb2NrZXQgc2hhcmVkIHdpdGggdGhlIHNlcnZlclxuICogQHBhcmFtIGtleSBUaGUga2V5IHdoaWNoIHdhcyBwcmVzc2VkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZW5kS2V5RG93bk1zZyhzb2NrZXQ6IFdlYlNvY2tldCwga2V5OiBLZXkpIHtcbiAgbGV0IG1zZyA9IG5ldyBLZXlNZXNzYWdlKGZhbHNlLCBrZXkpO1xuICBzb2NrZXQuc2VuZChtc2cudG9KU09OKCkpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBXb3JrZXIoX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIndvcmtlci5qc1wiKTtcbn07Il0sInNvdXJjZVJvb3QiOiIifQ==
