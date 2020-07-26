/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../common/output.ts":
/*!***************************!*\
  !*** ../common/output.ts ***!
  \***************************/
/*! exports provided: Output */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Output\", function() { return Output; });\nvar Output = /** @class */ (function () {\n    function Output() {\n    }\n    Output.print = function (str, type) {\n        if (type === void 0) { type = \"normal\"; }\n        var head, end;\n        str = this.escapeHtml(str);\n        if (type === \"raw\") {\n            head = \"\";\n            end = \"\";\n        }\n        else {\n            head = \"<p class = \\\"\" + type + \"\\\">\";\n            end = \"</p>\";\n        }\n        document.getElementById(\"text\").innerHTML += head + str + end;\n    };\n    Output.clear = function () {\n        document.getElementById(\"text\").innerHTML = \"\";\n    };\n    Output.renderKaTeX = function () {\n        if (typeof renderMathInElement === 'undefined')\n            return;\n        renderMathInElement(document.body, {\n            delimiters: [\n                { left: \"$$\", right: \"$$\", display: true },\n                { left: \"$\", right: \"$\", display: false }\n            ]\n        });\n    };\n    Output.escapeHtml = function (str) {\n        str = str.replace(/&/g, '&amp;');\n        str = str.replace(/</g, '&lt;');\n        str = str.replace(/>/g, '&gt;');\n        str = str.replace(/\"/g, '&quot;');\n        str = str.replace(/'/g, '&#39;');\n        return str;\n    };\n    return Output;\n}());\n\n\n\n//# sourceURL=webpack:///../common/output.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_output__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/output */ \"../common/output.ts\");\n\nvar button = document.getElementById(\"button\");\nvar form = document.form;\nif (button)\n    form.onkeyup = button.onclick = function () { return onclick(); };\nform.text.value = \"$\\n入力例\\\\\\\\\\n半径rの円の面積は\\\\pi r^2。\\\\\\\\\\nf(x) = \\\\frac{1}{\\\\sqrt{2\\\\pi \\\\sigma^2}} \\\\exp \\\\left(-\\\\frac{(x - \\\\mu)^2}{2\\\\sigma^2} \\\\right)\\\\\\\\\\n\\\\begin{aligned}\\nab + 3b + a^2 + 3a &= b(a + 3) + a(a + 3)\\\\\\\\\\n&= (a + b)(a + 3)\\n\\\\end{aligned}\\\\\\\\\\n$\";\nonclick();\nfunction onclick() {\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].clear();\n    var text = form.text.value;\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(text);\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].renderKaTeX();\n}\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ }),

/***/ "./src/use.ts":
/*!********************!*\
  !*** ./src/use.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var table = document.getElementsByName(\"table_mode\");\nfor (var i = 0; i < table.rows.length; i++) {\n    renderMathInElement(table.rows[i].cells[2]);\n}\n\n\n//# sourceURL=webpack:///./src/use.ts?");

/***/ }),

/***/ 0:
/*!****************************************!*\
  !*** multi ./src/main.ts ./src/use.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/main.ts */\"./src/main.ts\");\nmodule.exports = __webpack_require__(/*! ./src/use.ts */\"./src/use.ts\");\n\n\n//# sourceURL=webpack:///multi_./src/main.ts_./src/use.ts?");

/***/ })

/******/ });