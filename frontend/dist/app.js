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
    /***/ "./frontend/lib/image.ts":
      /*!*******************************!*\
  !*** ./frontend/lib/image.ts ***!
  \*******************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        var NUM_BYTES_IN_RGBA = 4;
        exports.initializeImage = function (imageData, width, height) {
          for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
              writeRGBAValue(imageData, x, y, width, false);
            }
          }
        };
        var getIndex = function (x, y, width) {
          return (y * width + x) * NUM_BYTES_IN_RGBA;
        };
        exports.updateCanvasImageData = function (
          imageData,
          change,
          width,
          widthMultiplier,
          heightMultiplier
        ) {
          var chipX = change.x,
            chipY = change.y,
            isAlive = change.isAlive;
          for (
            var _i = 0,
              _a = getCanvasChangesFromChange(
                chipX,
                chipY,
                width,
                widthMultiplier,
                heightMultiplier
              );
            _i < _a.length;
            _i++
          ) {
            var canvasChange = _a[_i];
            var x = canvasChange.x,
              y = canvasChange.y;
            writeRGBAValue(imageData, x, y, width, isAlive);
          }
        };
        var getCanvasChangesFromChange = function (
          chipX,
          chipY,
          width,
          widthMultiplier,
          heightMultiplier
        ) {
          var canvasChanges = [];
          var startingX = chipX * widthMultiplier;
          var startingY = chipY * heightMultiplier;
          for (var h = 0; h < heightMultiplier; h++) {
            var y = startingY + h;
            for (var w = 0; w < widthMultiplier; w++) {
              var x = startingX + w;
              canvasChanges.push({ x: x, y: y });
            }
          }
          return canvasChanges;
        };
        var writeRGBAValue = function (imageData, x, y, width, isWhite) {
          var pixelIndex = getIndex(x, y, width);
          var pixelValue = isWhite ? 255 : 0;
          imageData.data[pixelIndex + 0] ^= pixelValue;
          imageData.data[pixelIndex + 1] ^= pixelValue;
          imageData.data[pixelIndex + 2] ^= pixelValue;
          imageData.data[pixelIndex + 3] = 255;
        };

        /***/
      },

    /***/ "./frontend/lib/index.ts":
      /*!*******************************!*\
  !*** ./frontend/lib/index.ts ***!
  \*******************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        var MyWorker = __webpack_require__(
          /*! worker-loader?name=[name].js!./worker */ "./node_modules/worker-loader/dist/cjs.js?name=[name].js!./frontend/lib/worker.ts"
        );
        var image_1 = __webpack_require__(
          /*! ./image */ "./frontend/lib/image.ts"
        );
        var worker = new MyWorker();
        window.onload = function () {
          var canvas = document.getElementById("game-of-life-canvas");
          var context = canvas.getContext("2d");
          var CHIP_8_WIDTH = 64;
          var CHIP_8_HEIGHT = 32;
          var widthMultiplier = Math.floor(canvas.width / CHIP_8_WIDTH);
          var heightMultiplier = Math.floor(canvas.height / CHIP_8_HEIGHT);
          var width = CHIP_8_WIDTH * widthMultiplier;
          var height = CHIP_8_HEIGHT * heightMultiplier;
          var imageData =
            context === null || context === void 0
              ? void 0
              : context.createImageData(width, height);
          console.log("height: " + height + " width: " + width);
          console.log(
            "canvas height: " + canvas.height + " canvas width: " + canvas.width
          );
          console.log("heightMultiplier: " + heightMultiplier);
          console.log("widthMultiplier: " + widthMultiplier);
          var shouldPrint = true;
          worker.onmessage = function (evt) {
            var change = evt.data;
            image_1.updateCanvasImageData(
              imageData,
              change,
              width,
              widthMultiplier,
              heightMultiplier
            );
            context === null || context === void 0
              ? void 0
              : context.putImageData(imageData, 0, 0);
          };
          image_1.initializeImage(imageData, width, height);
          function main(tframe) {
            window.requestAnimationFrame(main);
          }
          main(0);
        };

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvbGliL2ltYWdlLnRzIiwid2VicGFjazovLy8uL2Zyb250ZW5kL2xpYi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9saWIvd29ya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2pGQSxJQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUlmLHVCQUFlLEdBQUcsVUFDN0IsU0FBb0IsRUFDcEIsS0FBYSxFQUNiLE1BQWM7SUFHZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFF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RSxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDekMsQ0FBQyxDQUFDO0lBR0YsdUJBQWUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRzFDLFNBQVMsSUFBSSxDQUFDLE1BQWM7UUFFMUIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFHRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDVixDQUFDLENBQUM7Ozs7Ozs7Ozs7OztBQ2xFRjtBQUNBLG9CQUFvQixxQkFBdUI7QUFDM0MsRSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Zyb250ZW5kL2xpYi9pbmRleC50c1wiKTtcbiIsIi8vIGEgY2FudmFzIFJHQkEgdmFsdWUgcmVxdWlyZXMgNCBieXRlc1xuY29uc3QgTlVNX0JZVEVTX0lOX1JHQkEgPSA0O1xudHlwZSBDYW52YXNDaGFuZ2UgPSB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH07XG5cbi8vIENyZWF0ZSB0aGUgaW5pdGlhbCBibGFjayBwaXhlbCBtYXBcbmV4cG9ydCBjb25zdCBpbml0aWFsaXplSW1hZ2UgPSAoXG4gIGltYWdlRGF0YTogSW1hZ2VEYXRhLFxuICB3aWR0aDogbnVtYmVyLFxuICBoZWlnaHQ6IG51bWJlclxuKSA9PiB7XG4gIC8vIExvb3Agb3ZlciBhbGwgb2YgdGhlIHBpeGVsc1xuICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG4gICAgICB3cml0ZVJHQkFWYWx1ZShpbWFnZURhdGEsIHgsIHksIHdpZHRoLCBmYWxzZSk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBnZXRJbmRleCA9ICh4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlcikgPT4ge1xuICByZXR1cm4gKHkgKiB3aWR0aCArIHgpICogTlVNX0JZVEVTX0lOX1JHQkE7XG59O1xuXG4vLyBVcGRhdGUgYSBjYW52YXMgcGl4ZWxzIHdpdGggdGhlIGNoYW5nZSBjb21pbmcgaW4gZnJvbSB0aGUgZ2FtZSBzZXJ2ZXIuIFRoaXMgd2lsbFxuLy8gY2hhbmdlIG11bHRpcGxlIHBpeGVscyBvbiB0aGUgY2FudmFzIGJlY2F1c2UgYSBzaW5nbGUgcGl4ZWwgb24gdGhlIGVtdWxhdG9yXG4vLyBkaXNwbGF5IGlzIHJlcHJlc2VudGVkIGJ5IG11bHRpcGxlIHBpeGVscyBvbiB0aGUgY2FudmFzLCB0aGUgZXhhY3QgbnVtYmVyXG4vLyBvZiB3aGljaCBpcyBkZXRlcm1pbmVkIGJ5IHdpZHRoTXVsdGlwbGllciBhbmQgaGVpZ2h0TXVsdGlwbGllclxuZXhwb3J0IGNvbnN0IHVwZGF0ZUNhbnZhc0ltYWdlRGF0YSA9IChcbiAgaW1hZ2VEYXRhOiBJbWFnZURhdGEsXG4gIGNoYW5nZTogYW55LFxuICB3aWR0aDogbnVtYmVyLFxuICB3aWR0aE11bHRpcGxpZXI6IG51bWJlcixcbiAgaGVpZ2h0TXVsdGlwbGllcjogbnVtYmVyXG4pID0+IHtcbiAgY29uc3QgeyB4OiBjaGlwWCwgeTogY2hpcFksIGlzQWxpdmUgfSA9IGNoYW5nZTtcblxuICBmb3IgKGxldCBjYW52YXNDaGFuZ2Ugb2YgZ2V0Q2FudmFzQ2hhbmdlc0Zyb21DaGFuZ2UoXG4gICAgY2hpcFgsXG4gICAgY2hpcFksXG4gICAgd2lkdGgsXG4gICAgd2lkdGhNdWx0aXBsaWVyLFxuICAgIGhlaWdodE11bHRpcGxpZXJcbiAgKSkge1xuICAgIGNvbnN0IHsgeCwgeSB9ID0gY2FudmFzQ2hhbmdlO1xuICAgIHdyaXRlUkdCQVZhbHVlKGltYWdlRGF0YSwgeCwgeSwgd2lkdGgsIGlzQWxpdmUpO1xuICB9XG59O1xuXG4vLyBnaXZlbiBhIHBpeGVsIGNoYW5nZSBmcm9tIHRoZSBlbXVsYXRvciwgcmV0dXJuIHRoZSBjb3JyZXNwb25kaW5nXG5jb25zdCBnZXRDYW52YXNDaGFuZ2VzRnJvbUNoYW5nZSA9IChcbiAgY2hpcFg6IG51bWJlcixcbiAgY2hpcFk6IG51bWJlcixcbiAgd2lkdGg6IG51bWJlcixcbiAgd2lkdGhNdWx0aXBsaWVyOiBudW1iZXIsXG4gIGhlaWdodE11bHRpcGxpZXI6IG51bWJlclxuKTogQ2FudmFzQ2hhbmdlW10gPT4ge1xuICBjb25zdCBjYW52YXNDaGFuZ2VzOiBDYW52YXNDaGFuZ2VbXSA9IFtdO1xuXG4gIGNvbnN0IHN0YXJ0aW5nWCA9IGNoaXBYICogd2lkdGhNdWx0aXBsaWVyO1xuICBjb25zdCBzdGFydGluZ1kgPSBjaGlwWSAqIGhlaWdodE11bHRpcGxpZXI7XG4gIGZvciAobGV0IGggPSAwOyBoIDwgaGVpZ2h0TXVsdGlwbGllcjsgaCsrKSB7XG4gICAgY29uc3QgeSA9IHN0YXJ0aW5nWSArIGg7XG4gICAgZm9yIChsZXQgdyA9IDA7IHcgPCB3aWR0aE11bHRpcGxpZXI7IHcrKykge1xuICAgICAgY29uc3QgeCA9IHN0YXJ0aW5nWCArIHc7XG4gICAgICBjYW52YXNDaGFuZ2VzLnB1c2goeyB4LCB5IH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjYW52YXNDaGFuZ2VzO1xufTtcblxuLy8gYSBDYW52YXMgSW1hZ2VEYXRhIG9iamVjdCBpcyBhIHdpZHRoeGhlaWdodHg0IGFycmF5IHdoZXJlIGVhY2ggcGl4ZWwgaXMgcmVwcmVzZW50ZWQgYnkgYW4gUkdCQSB2YWx1ZVxuLy8gb2YgNCBudW1iZXJzLlxuY29uc3Qgd3JpdGVSR0JBVmFsdWUgPSAoXG4gIGltYWdlRGF0YTogSW1hZ2VEYXRhLFxuICB4OiBudW1iZXIsXG4gIHk6IG51bWJlcixcbiAgd2lkdGg6IG51bWJlcixcbiAgaXNXaGl0ZTogYm9vbGVhblxuKSA9PiB7XG4gIC8vIEdldCB0aGUgcGl4ZWwgaW5kZXhcbiAgY29uc3QgcGl4ZWxJbmRleCA9IGdldEluZGV4KHgsIHksIHdpZHRoKTtcblxuICAvLyBTZXQgdGhlIHBpeGVsIGRhdGFcbiAgY29uc3QgcGl4ZWxWYWx1ZSA9IGlzV2hpdGUgPyAyNTUgOiAwO1xuXG4gIGltYWdlRGF0YS5kYXRhW3BpeGVsSW5kZXggKyAwXSBePSBwaXhlbFZhbHVlO1xuICBpbWFnZURhdGEuZGF0YVtwaXhlbEluZGV4ICsgMV0gXj0gcGl4ZWxWYWx1ZTtcbiAgaW1hZ2VEYXRhLmRhdGFbcGl4ZWxJbmRleCArIDJdIF49IHBpeGVsVmFsdWU7XG4gIGltYWdlRGF0YS5kYXRhW3BpeGVsSW5kZXggKyAzXSA9IDI1NTsgLy8gYWxwaGEgdmFsdWUgaXMgYWx3YXlzIG1heGVkIG91dCwgYmVjYXVzZSAwIGlzIGZ1bGx5IHRyYW5zcGFyYW50XG59O1xuIiwiaW1wb3J0IE15V29ya2VyID0gcmVxdWlyZShcIndvcmtlci1sb2FkZXI/bmFtZT1bbmFtZV0uanMhLi93b3JrZXJcIik7XG5pbXBvcnQgeyB1cGRhdGVDYW52YXNJbWFnZURhdGEsIGluaXRpYWxpemVJbWFnZSB9IGZyb20gXCIuL2ltYWdlXCI7XG5cbmxldCB3b3JrZXIgPSBuZXcgTXlXb3JrZXIoKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gR2V0IHRoZSBjYW52YXMgYW5kIGNvbnRleHRcbiAgY29uc3QgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIFwiZ2FtZS1vZi1saWZlLWNhbnZhc1wiXG4gICkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gIGNvbnN0IENISVBfOF9XSURUSCA9IDY0O1xuICBjb25zdCBDSElQXzhfSEVJR0hUID0gMzI7XG5cbiAgLy8gRGVmaW5lIHRoZSBpbWFnZSBkaW1lbnNpb25zIGFzIHRoZSBjbG9zZXN0IG11bHRpcGxlIG9mIHRoZVxuICAvLyBiYXNlIENISVAtOCBkaXNwbGF5IHdpZHRoIGFuZCBoZWlnaHRcbiAgY29uc3Qgd2lkdGhNdWx0aXBsaWVyID0gTWF0aC5mbG9vcihjYW52YXMud2lkdGggLyBDSElQXzhfV0lEVEgpO1xuICBjb25zdCBoZWlnaHRNdWx0aXBsaWVyID0gTWF0aC5mbG9vcihjYW52YXMuaGVpZ2h0IC8gQ0hJUF84X0hFSUdIVCk7XG4gIGNvbnN0IHdpZHRoID0gQ0hJUF84X1dJRFRIICogd2lkdGhNdWx0aXBsaWVyO1xuICBjb25zdCBoZWlnaHQgPSBDSElQXzhfSEVJR0hUICogaGVpZ2h0TXVsdGlwbGllcjtcblxuICAvLyBDcmVhdGUgYW4gSW1hZ2VEYXRhIG9iamVjdFxuICBsZXQgaW1hZ2VEYXRhID0gY29udGV4dD8uY3JlYXRlSW1hZ2VEYXRhKHdpZHRoLCBoZWlnaHQpITtcblxuICAvLyB0aGUgQ0hJUC04IGRpc3BsYXkgaXMgYSBmaXhlZCB3aWR0aCBhbmQgaGVpZ2h0LCBidXQgdGhlIGNhbnZhc1xuICAvLyB3aWR0aCBhbmQgaGVpZ2h0IGNhbiBjaGFuZ2UuIERJU1BMQVlfUkFUSU8gaXMgYSBtdWx0aXBsaWVyXG4gIC8vIHJlcHJlc2VudGluZyBob3cgbWFueSBjYW52YXMgcGl4ZWxzIHJlcHJlc2VudCBhIHNpbmdsZSBDSElQLThcbiAgLy8gcGl4ZWxcblxuICBjb25zb2xlLmxvZyhcImhlaWdodDogXCIgKyBoZWlnaHQgKyBcIiB3aWR0aDogXCIgKyB3aWR0aCk7XG4gIGNvbnNvbGUubG9nKFxuICAgIFwiY2FudmFzIGhlaWdodDogXCIgKyBjYW52YXMuaGVpZ2h0ICsgXCIgY2FudmFzIHdpZHRoOiBcIiArIGNhbnZhcy53aWR0aFxuICApO1xuICBjb25zb2xlLmxvZyhcImhlaWdodE11bHRpcGxpZXI6IFwiICsgaGVpZ2h0TXVsdGlwbGllcik7XG4gIGNvbnNvbGUubG9nKFwid2lkdGhNdWx0aXBsaWVyOiBcIiArIHdpZHRoTXVsdGlwbGllcik7XG5cbiAgbGV0IHNob3VsZFByaW50ID0gdHJ1ZTtcbiAgLy8gdGhlIHdvcmtlciByZWFkcyBpbiBwaXhlbCBjaGFuZ2VzIGZyb20gdGhlIGdhbWUgc2VydmVyIGFuZCBzZW5kcyB0aG9zZVxuICAvLyBjaGFuZ2VzIGhlcmUsIHdoZXJlIHRoZXkncmUgdXNlZCB0byB1cGRhdGUgdGhlIGNhbnZhcyBwaXhlbHNcbiAgd29ya2VyLm9ubWVzc2FnZSA9IChldnQ6IE1lc3NhZ2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IGNoYW5nZSA9IGV2dC5kYXRhO1xuXG4gICAgdXBkYXRlQ2FudmFzSW1hZ2VEYXRhKFxuICAgICAgaW1hZ2VEYXRhLFxuICAgICAgY2hhbmdlLFxuICAgICAgd2lkdGgsXG4gICAgICB3aWR0aE11bHRpcGxpZXIsXG4gICAgICBoZWlnaHRNdWx0aXBsaWVyXG4gICAgKTtcblxuICAgIC8vIERyYXcgdGhlIGltYWdlIGRhdGEgdG8gdGhlIGNhbnZhc1xuICAgIGNvbnRleHQ/LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xuICB9O1xuXG4gIC8vIHNldHVwIG91ciBibGFjayBwaXhlbCBjYW52YXNcbiAgaW5pdGlhbGl6ZUltYWdlKGltYWdlRGF0YSwgd2lkdGgsIGhlaWdodCk7XG5cbiAgLy8gTWFpbiBsb29wXG4gIGZ1bmN0aW9uIG1haW4odGZyYW1lOiBudW1iZXIpIHtcbiAgICAvLyBSZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZXNcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pO1xuICB9XG5cbiAgLy8gQ2FsbCB0aGUgbWFpbiBsb29wXG4gIG1haW4oMCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBXb3JrZXIoX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIndvcmtlci5qc1wiKTtcbn07Il0sInNvdXJjZVJvb3QiOiIifQ==
