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

/***/ "../common/output.ts":
/*!***************************!*\
  !*** ../common/output.ts ***!
  \***************************/
/*! exports provided: Output */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Output\", function() { return Output; });\nvar Output = /** @class */ (function () {\n    function Output() {\n    }\n    Output.print = function (str, type) {\n        if (type === void 0) { type = \"normal\"; }\n        var head, end;\n        head = \"<p class = \\\"\" + type + \"\\\">\";\n        end = \"</p>\";\n        document.getElementById(\"text\").innerHTML += head + str + end;\n    };\n    Output.clear = function () {\n        document.getElementById(\"text\").innerHTML = \"\";\n    };\n    Output.renderKaTeX = function () {\n        if (typeof renderMathInElement === 'undefined')\n            return;\n        renderMathInElement(document.body, {\n            delimiters: [\n                { left: \"$$\", right: \"$$\", display: true },\n                { left: \"$\", right: \"$\", display: false }\n            ]\n        });\n    };\n    return Output;\n}());\n\n\n\n//# sourceURL=webpack:///../common/output.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_output__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/output */ \"../common/output.ts\");\n\nvar button = document.getElementById(\"button\");\nvar form = document.form;\nif (button)\n    form.onkeyup = button.onclick = function () { return onclick(); };\nfunction onclick() {\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].clear();\n    var v = parseInt(form.form_num.value);\n    if (v > 0) {\n        _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"・結果\", \"headline\");\n        if (v > 9999999999999) {\n            _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"値が大きすぎ!\", \"error\");\n            return;\n        }\n        prime(v);\n        divide(form.form_num.value);\n        _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].renderKaTeX();\n    }\n}\nfunction prime(v) {\n    var k = Math.floor(Math.sqrt(v));\n    var list = [], list2 = [];\n    if (v == 1) {\n        _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"$1 = 1^1$\");\n        return;\n    }\n    for (var i = 2; i <= k; i++) {\n        var c = 0;\n        while (v % i == 0) {\n            v /= i, c++;\n        }\n        if (c)\n            list.push(i), list2.push(c);\n    }\n    if (v != 1)\n        list.push(v), list2.push(1);\n    var str = parseInt(form.form_num.value) + \"=\";\n    for (var i = 0; i < list.length; i++) {\n        if (i)\n            str += \"\\\\cdot\";\n        str += list[i] + \"^{\" + list2[i] + \"}\";\n    }\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"$\" + str + \"$\");\n}\nfunction divide(v) {\n    var k = Math.floor(Math.sqrt(v)), sum = 0;\n    var list = [], list2 = [];\n    for (var i = 1; i <= k; i++) {\n        if (v % i == 0) {\n            list.push(i);\n            if (v != i * i)\n                list2.push(v / i);\n        }\n    }\n    list = list.concat(list2.reverse());\n    var str = \"\";\n    for (var i = 0; i < list.length; i++) {\n        if (i)\n            str += \",\";\n        sum += list[i];\n        str += list[i];\n    }\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"約数の個数:$\" + list.length + \"$\");\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"約数の和:$\" + sum + \"$\");\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"$\" + str + \"$\");\n}\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ })

/******/ });