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
    (__webpack_require__.s =
      "./node_modules/ts-loader/index.js!./frontend/lib/worker.ts")
  );
  /******/
})(
  /************************************************************************/
  /******/ {
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

    /***/ "./node_modules/ts-loader/index.js!./frontend/lib/worker.ts":
      /*!*********************************************************!*\
  !*** ./node_modules/ts-loader!./frontend/lib/worker.ts ***!
  \*********************************************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        var messaging_1 = __webpack_require__(
          /*! ./messaging */ "./frontend/lib/messaging.ts"
        );
        console.log("starting worker");
        var DOMAIN = "localhost:3000/";
        var socket = new WebSocket("ws://" + DOMAIN + "echo");
        socket.onopen = onConnect;
        socket.onmessage = onMessage;
        function onConnect(event) {
          console.log("connected to websocket server at " + DOMAIN);
        }
        var ctx = self;
        function onMessage(event) {
          var parsed = messaging_1.parseServerMsg(event.data);
          if (parsed.type() === messaging_1.MessageType.Disconnect) {
            console.log("received disconnect");
            var msg = parsed;
          } else if (parsed.type() === messaging_1.MessageType.DisplayChange) {
            var msg = parsed;
            for (var _i = 0, _a = msg.changes; _i < _a.length; _i++) {
              var change = _a[_i];
              ctx.postMessage(change);
            }
          }
        }

        /***/
      },

    /******/
  }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvbGliL21lc3NhZ2luZy50cyIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9saWIvd29ya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzdFQSxJQUFNLFlBQVksR0FBRyxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBR3pFLElBQU0sb0JBQW9CLEdBQW9CLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFLOUUsSUFBWSxXQUtYO0FBTEQsV0FBWSxXQUFXO0lBQ3JCLHdDQUF5QjtJQUN6Qiw4Q0FBK0I7SUFDL0Isa0NBQW1CO0lBQ25C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QUFHLE1BQThCLENBQUM7UUFFM0MsS0FBbUIsVUFBVyxFQUFYLFFBQUcsQ0FBQyxPQUFPLEVBQVgsY0FBVyxFQUFYLElBQVcsRUFBRTtZQUEzQixJQUFJLE1BQU07WUFDYixHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pCO0tBQ0Y7QUFDSCxDQUFDIiwiZmlsZSI6Indvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vbm9kZV9tb2R1bGVzL3RzLWxvYWRlci9pbmRleC5qcyEuL2Zyb250ZW5kL2xpYi93b3JrZXIudHNcIik7XG4iLCJpbXBvcnQgeyBLZXkgfSBmcm9tIFwiLi9rZXlcIjtcbmltcG9ydCB7IERpc3BsYXlDaGFuZ2UgfSBmcm9tIFwiLi9kaXNwbGF5X2NoYW5nZVwiO1xuXG4vLyB1c2VkIHRvIHdlIGNhbiBzZWFyY2ggZm9yIHN0cmluZ3MgdGhhdCBtYXRjaCBvdXIgTWVzc2FnZVR5cGUgZW51bSdzIHZhcmlhbnRzLiBTaG91bGQgYWx3YXlzXG4vLyBtYXRjaCB0aGUgc3RyaW5ncyBpbiBNZXNzYWdlVHlwZVxuY29uc3QgbWVzc2FnZVR5cGVzID0gW1wiZGlzY29ubmVjdFwiLCBcImRpc3BsYXljaGFuZ2VcIiwgXCJrZXlkb3duXCIsIFwia2V5dXBcIl07XG5cbi8vIHVzZWQgc28gd2UgY2FuIGNhbGN1bGF0ZSBpdHMgYHR5cGVvZmAgYW5kIGNvbXBhcmUgaXQgYWdhaW5zdCB0aGUgdHlwZSBvZiBpbmNvbWluZyBtZXNzYWdlIGRhdGFcbmNvbnN0IGRpc3BsYXlDaGFuZ2VFeGFtcGxlOiBEaXNwbGF5Q2hhbmdlW10gPSBbeyB4OiAwLCB5OiAwLCBpc0FsaXZlOiB0cnVlIH1dO1xuXG4vKipcbiAqIFRoZSB0eXBlcyBvZiBldmVudHMgd2UnbGwgcmVjZWl2ZSBvdmVyIHRoZSB3ZWJzb2NrZXQgZnJvbSB0aGUgc2VydmVyXG4gKi9cbmV4cG9ydCBlbnVtIE1lc3NhZ2VUeXBlIHtcbiAgRGlzY29ubmVjdCA9IFwiZGlzY29ubmVjdFwiLFxuICBEaXNwbGF5Q2hhbmdlID0gXCJkaXNwbGF5Y2hhbmdlXCIsXG4gIEtleURvd24gPSBcImtleWRvd25cIixcbiAgS2V5VXAgPSBcImtleXVwXCIsXG59XG5cbi8qKlxuICogQSBtZXNzYWdlIHNlbnQgb3IgcmVjZWl2ZWQgdmlhIFdlYlNvY2tldHNcbiAqL1xuaW50ZXJmYWNlIE1lc3NhZ2Uge1xuICB0eXBlOiAoKSA9PiBNZXNzYWdlVHlwZTtcbiAgdG9KU09OOiAoKSA9PiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBNZXNzYWdlIGZvciB0aGUgS2V5VXAgYW5kIEtleURvd24gTWVzc2FnZVR5cGVzXG4gKi9cbmV4cG9ydCBjbGFzcyBLZXlNZXNzYWdlIGltcGxlbWVudHMgTWVzc2FnZSB7XG4gIGtleVR5cGU6IE1lc3NhZ2VUeXBlOyAvLyB1cCBvciBkb3duXG4gIGtleTogS2V5O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBLZXlNZXNzYWdlXG4gICAqIEBwYXJhbSBpc1VwIHRydWUgaWYgdGhpcyBpcyBmb3IgYSBLZXlVcCBNZXNzYWdlVHlwZSwgZmFsc2UgaWYgaXQncyBmb3IgYSBLZXlEb3duIE1lc3NhZ2VUeXBlXG4gICAqIEBwYXJhbSBrZXkgdGhlIGtleSB0aGF0IHdhcyBwcmVzc2VkIG9yIHJlbGVhc2VkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpc1VwOiBib29sZWFuLCBrZXk6IEtleSkge1xuICAgIHRoaXMua2V5VHlwZSA9IGlzVXAgPyBNZXNzYWdlVHlwZS5LZXlVcCA6IE1lc3NhZ2VUeXBlLktleURvd247XG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gIH1cblxuICB0eXBlKCk6IE1lc3NhZ2VUeXBlIHtcbiAgICByZXR1cm4gdGhpcy5rZXlUeXBlO1xuICB9XG5cbiAgdG9KU09OKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgdHlwZTogdGhpcy50eXBlKCksIGtleTogdGhpcy5rZXkgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIE1lc3NhZ2UgZm9yIHRoZSBEaXNjb25uZWN0IE1lc3NhZ2VUeXBlXG4gKi9cbmV4cG9ydCBjbGFzcyBEaXNjb25uZWN0TWVzc2FnZSBpbXBsZW1lbnRzIE1lc3NhZ2Uge1xuICB1c2VySWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YS50eXBlICE9PSBcImRpc2Nvbm5lY3RcIiB8fCB0eXBlb2YgZGF0YS51c2VySWQgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGJhZCBkYXRhIHBhc3NlZCB0byBEaXNjb25uZWN0TWVzc2FnZSBjb25zdHJ1Y3RvciAke2RhdGF9YFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy51c2VySWQgPSBkYXRhLnVzZXJJZDtcbiAgfVxuXG4gIHR5cGUoKTogTWVzc2FnZVR5cGUge1xuICAgIHJldHVybiBNZXNzYWdlVHlwZS5EaXNjb25uZWN0O1xuICB9XG5cbiAgdG9KU09OKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgdHlwZTogdGhpcy50eXBlKCksIHVzZXJJZDogdGhpcy51c2VySWQgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIE1lc3NhZ2UgZm9yIHRoZSBEaXNwbGF5Q2hhbmdlIE1lc3NhZ2VUeXBlXG4gKi9cbmV4cG9ydCBjbGFzcyBEaXNwbGF5Q2hhbmdlTWVzc2FnZSBpbXBsZW1lbnRzIE1lc3NhZ2Uge1xuICBjaGFuZ2VzOiBEaXNwbGF5Q2hhbmdlW107XG5cbiAgY29uc3RydWN0b3IoZGF0YTogYW55KSB7XG4gICAgaWYgKFxuICAgICAgZGF0YS50eXBlICE9PSBcImRpc3BsYXljaGFuZ2VcIiB8fFxuICAgICAgdHlwZW9mIGRhdGEuY2hhbmdlcyAhPT0gdHlwZW9mIGRpc3BsYXlDaGFuZ2VFeGFtcGxlXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBiYWQgZGF0YSBwYXNzZWQgdG8gRGlzcGxheUNoYW5nZU1lc3NhZ2UgY29uc3RydWN0b3IgJHtkYXRhfWBcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuY2hhbmdlcyA9IGRhdGEuY2hhbmdlcztcbiAgfVxuXG4gIHR5cGUoKTogTWVzc2FnZVR5cGUge1xuICAgIHJldHVybiBNZXNzYWdlVHlwZS5EaXNwbGF5Q2hhbmdlO1xuICB9XG5cbiAgdG9KU09OKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgdHlwZTogdGhpcy50eXBlKCksIGNoYW5nZXM6IHRoaXMuY2hhbmdlcyB9KTtcbiAgfVxufVxuXG4vKipcbiAqIHBhcnNlZCB0aGUgcmF3IHN0cmluZyBkYXRhIHNlbmQgZnJvbSB0aGUgc2VydmVyIGFuZCByZXR1cm5zIHRoZSBjb3JyZWN0IE1lc3NhZ2UgdHlwZSBmb3IgdGhlIGNhbGxlclxuICogdG8gaGFuZGxlXG4gKiBAcGFyYW0gcmF3RGF0YSBhIG1lc3NhZ2Ugc2VudCBieSB0aGUgc2VydmVyIHRvIHRoZSBjbGllbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2VydmVyTXNnKHJhd0RhdGE6IHN0cmluZyk6IE1lc3NhZ2Uge1xuICBsZXQgZGF0YSA9IEpTT04ucGFyc2UocmF3RGF0YSk7XG4gIHN3aXRjaCAoZGF0YS50eXBlKSB7XG4gICAgY2FzZSBcImRpc2Nvbm5lY3RcIjoge1xuICAgICAgcmV0dXJuIG5ldyBEaXNjb25uZWN0TWVzc2FnZShkYXRhKTtcbiAgICB9XG5cbiAgICBjYXNlIFwiZGlzcGxheWNoYW5nZVwiOiB7XG4gICAgICByZXR1cm4gbmV3IERpc3BsYXlDaGFuZ2VNZXNzYWdlKGRhdGEpO1xuICAgIH1cblxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgaW5jb3JyZWN0IE1lc3NhZ2UgcGFzc2VkIHRvIGhhbmRsZU1lc3NhZ2U6ICR7ZGF0YX1gKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZW5kIGEga2V5dXAgbWVzc2FnZSB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHNvY2tldCBUaGUgd2Vic29ja2V0IHNoYXJlZCB3aXRoIHRoZSBzZXJ2ZXJcbiAqIEBwYXJhbSBrZXkgVGhlIGtleSB3aGljaCB3YXMgcmVsZWFzZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbmRLZXlVcE1zZyhzb2NrZXQ6IFdlYlNvY2tldCwga2V5OiBLZXkpIHtcbiAgbGV0IG1zZyA9IG5ldyBLZXlNZXNzYWdlKHRydWUsIGtleSk7XG4gIHNvY2tldC5zZW5kKG1zZy50b0pTT04oKSk7XG59XG5cbi8qKlxuICogU2VuZCBhIGtleWRvd24gbWVzc2FnZSB0byB0aGUgc2VydmVyLlxuICogQHBhcmFtIHNvY2tldCBUaGUgd2Vic29ja2V0IHNoYXJlZCB3aXRoIHRoZSBzZXJ2ZXJcbiAqIEBwYXJhbSBrZXkgVGhlIGtleSB3aGljaCB3YXMgcHJlc3NlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZEtleURvd25Nc2coc29ja2V0OiBXZWJTb2NrZXQsIGtleTogS2V5KSB7XG4gIGxldCBtc2cgPSBuZXcgS2V5TWVzc2FnZShmYWxzZSwga2V5KTtcbiAgc29ja2V0LnNlbmQobXNnLnRvSlNPTigpKTtcbn1cbiIsImltcG9ydCB7XG4gIHBhcnNlU2VydmVyTXNnLFxuICBNZXNzYWdlVHlwZSxcbiAgRGlzY29ubmVjdE1lc3NhZ2UsXG4gIERpc3BsYXlDaGFuZ2VNZXNzYWdlLFxufSBmcm9tIFwiLi9tZXNzYWdpbmdcIjtcblxuY29uc29sZS5sb2coXCJzdGFydGluZyB3b3JrZXJcIik7XG5cbmNvbnN0IERPTUFJTiA9IFwibG9jYWxob3N0OjMwMDAvXCI7XG5jb25zdCBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KGB3czovLyR7RE9NQUlOfWVjaG9gKTtcblxuc29ja2V0Lm9ub3BlbiA9IG9uQ29ubmVjdDtcbnNvY2tldC5vbm1lc3NhZ2UgPSBvbk1lc3NhZ2U7XG5cbmZ1bmN0aW9uIG9uQ29ubmVjdChldmVudDogRXZlbnQpIHtcbiAgY29uc29sZS5sb2coYGNvbm5lY3RlZCB0byB3ZWJzb2NrZXQgc2VydmVyIGF0ICR7RE9NQUlOfWApO1xufVxuXG5jb25zdCBjdHg6IFdvcmtlciA9IHNlbGYgYXMgYW55O1xuXG5mdW5jdGlvbiBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCkge1xuICBjb25zdCBwYXJzZWQgPSBwYXJzZVNlcnZlck1zZyhldmVudC5kYXRhKTtcblxuICBpZiAocGFyc2VkLnR5cGUoKSA9PT0gTWVzc2FnZVR5cGUuRGlzY29ubmVjdCkge1xuICAgIGNvbnNvbGUubG9nKFwicmVjZWl2ZWQgZGlzY29ubmVjdFwiKTtcbiAgICBjb25zdCBtc2cgPSBwYXJzZWQgYXMgRGlzY29ubmVjdE1lc3NhZ2U7XG4gIH0gZWxzZSBpZiAocGFyc2VkLnR5cGUoKSA9PT0gTWVzc2FnZVR5cGUuRGlzcGxheUNoYW5nZSkge1xuICAgIGNvbnN0IG1zZyA9IHBhcnNlZCBhcyBEaXNwbGF5Q2hhbmdlTWVzc2FnZTtcblxuICAgIGZvciAobGV0IGNoYW5nZSBvZiBtc2cuY2hhbmdlcykge1xuICAgICAgY3R4LnBvc3RNZXNzYWdlKGNoYW5nZSk7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9
