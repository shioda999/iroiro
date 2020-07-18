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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/list.ts":
/*!*********************!*\
  !*** ./src/list.ts ***!
  \*********************/
/*! exports provided: List */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"List\", function() { return List; });\nvar List = /** @class */ (function () {\n    function List(num, num2) {\n        if (num === void 0) { num = 0; }\n        if (num2 === void 0) { num2 = 0; }\n        this.num = num;\n        this.num2 = num2;\n        this.next = null;\n    }\n    List.prototype.push = function (num, num2) {\n        var temp = this;\n        while (temp.next)\n            temp = temp.next;\n        temp.next = new List(num, num2);\n    };\n    return List;\n}());\n\n\n\n//# sourceURL=webpack:///./src/list.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list */ \"./src/list.ts\");\n/* harmony import */ var _output__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./output */ \"./src/output.ts\");\n\n\nvar button = document.getElementById(\"button\");\nvar form = document.form;\nif (button)\n    form.onkeyup = button.onclick = function () { return onclick(); };\nfunction onclick() {\n    _output__WEBPACK_IMPORTED_MODULE_1__[\"Output\"].clear();\n    _output__WEBPACK_IMPORTED_MODULE_1__[\"Output\"].print(\"・結果\", \"headline\");\n    prime(form.form_num.value);\n    divide(form.form_num.value);\n    _output__WEBPACK_IMPORTED_MODULE_1__[\"Output\"].renderKaTeX();\n}\nfunction prime(v) {\n    var k = Math.ceil(Math.sqrt(v));\n    var list = new _list__WEBPACK_IMPORTED_MODULE_0__[\"List\"]();\n    for (var i = 2; i <= k; i++) {\n        var k_1 = 0;\n        while (v % i == 0) {\n            v /= i, k_1++;\n        }\n        if (k_1)\n            list.push(i, k_1);\n    }\n    if (v != 1)\n        list.push(v, 1);\n    var str = form.form_num.value + \"=\";\n    var work = list.next;\n    while (work) {\n        if (work != list.next)\n            str += \"\\\\cdot\";\n        str += work.num + \"^{\" + work.num2 + \"}\";\n        work = work.next;\n    }\n    _output__WEBPACK_IMPORTED_MODULE_1__[\"Output\"].print(str, \"math\");\n}\nfunction divide(v) {\n    var k = Math.floor(Math.sqrt(v)), sum = 0;\n    var list = new _list__WEBPACK_IMPORTED_MODULE_0__[\"List\"](), size = 0;\n    for (var i = 1; i <= k; i++) {\n        if (v % i == 0) {\n            list.push(i, v / i);\n            if (v != i * i)\n                size += 2, sum += i + v / i;\n            else\n                size++, sum += i;\n        }\n    }\n    var str = \"\", str2 = \"\";\n    var work = list.next;\n    while (work) {\n        if (work != list.next) {\n            str += \",\";\n            if (work.num != work.num2)\n                str2 = \",\" + str2;\n        }\n        str += work.num;\n        if (work.num != work.num2)\n            str2 = work.num2 + str2;\n        work = work.next;\n    }\n    _output__WEBPACK_IMPORTED_MODULE_1__[\"Output\"].print(\"約数の個数:\" + size, \"math\");\n    _output__WEBPACK_IMPORTED_MODULE_1__[\"Output\"].print(\"約数の和:\" + sum, \"math\");\n    _output__WEBPACK_IMPORTED_MODULE_1__[\"Output\"].print(str + \",\" + str2, \"math\");\n}\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ }),

/***/ "./src/output.ts":
/*!***********************!*\
  !*** ./src/output.ts ***!
  \***********************/
/*! exports provided: Output */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Output\", function() { return Output; });\nvar Output = /** @class */ (function () {\n    function Output() {\n    }\n    Output.print = function (str, type) {\n        if (type === void 0) { type = \"normal\"; }\n        var head, end;\n        if (type === \"math\")\n            str = \"$\" + str + \"$\", type = \"normal\";\n        head = \"<p class = \\\"\" + type + \"\\\">\";\n        end = \"</p>\";\n        document.getElementById(\"text\").innerHTML += head + str + end;\n    };\n    Output.clear = function () {\n        document.getElementById(\"text\").innerHTML = \"\";\n    };\n    Output.renderKaTeX = function () {\n        if (typeof renderMathInElement === 'undefined')\n            return;\n        renderMathInElement(document.body, {\n            delimiters: [\n                { left: \"$$\", right: \"$$\", display: true },\n                { left: \"$\", right: \"$\", display: false }\n            ]\n        });\n    };\n    return Output;\n}());\n\n\n\n//# sourceURL=webpack:///./src/output.ts?");

/***/ })

/******/ });