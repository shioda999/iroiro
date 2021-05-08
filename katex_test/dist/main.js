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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Output\", function() { return Output; });\nvar Output = /** @class */ (function () {\n    function Output() {\n    }\n    Output.print = function (str, type) {\n        if (type === void 0) { type = \"normal\"; }\n        var head, end;\n        str = this.escapeHtml(str);\n        if (type === \"raw\") {\n            head = \"\";\n            end = \"\";\n        }\n        else {\n            head = \"<p class = \\\"\" + type + \"\\\">\";\n            end = \"</p>\";\n        }\n        document.getElementById(\"text\").innerHTML += head + str + end;\n    };\n    Output.clear = function () {\n        document.getElementById(\"text\").innerHTML = \"\";\n    };\n    Output.renderKaTeX = function () {\n        if (typeof renderMathInElement === 'undefined')\n            return;\n        renderMathInElement(document.body, {\n            delimiters: [\n                { left: \"$$\", right: \"$$\", display: true },\n                { left: \"$\", right: \"$\", display: false }\n            ]\n        });\n    };\n    Output.escapeHtml = function (str) {\n        str = str.replace(/&/g, '&amp;');\n        str = str.replace(/</g, '&lt;');\n        str = str.replace(/>/g, '&gt;');\n        str = str.replace(/\"/g, '&quot;');\n        str = str.replace(/'/g, '&#39;');\n        str = str.replace(/'/g, '&#39;');\n        return str;\n    };\n    return Output;\n}());\n\n\n\n//# sourceURL=webpack:///../common/output.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_output__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/output */ \"../common/output.ts\");\n\n//console.warn = (e) => { }\nvar form = document[\"form\"];\nvar text_form = getRuleBySelector('.textform');\nvar katex_rule = getRuleBySelector('.katex');\nvar menu = document.getElementById(\"floating_menu\");\nvar range = menu.children[\"move\"];\nvar auto_update = menu.children[\"auto_update\"];\nvar font_size = menu.children[\"font_size\"];\nsetTimeout(function () { return setup(); }, 200);\nfunction setup() {\n    auto_update.onclick = function () { return onclick(); };\n    font_size.addEventListener('change', function () { change_fontsize(), onclick(); });\n    range.addEventListener('input', function () { return change_range(); });\n    change_fontsize();\n    form.onkeyup = function () {\n        var pos = form.text.selectionStart;\n        var len = form.text.value.length;\n        change_fontsize();\n        form.text.value = henkan(form.text.value);\n        if (form.text.value.length != len)\n            pos++;\n        form.text.selectionEnd = form.text.selectionStart = pos;\n        if (auto_update.checked)\n            onclick();\n    };\n    form.text.value = \"a+b+c\";\n    onclick();\n}\nfunction onclick() {\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].clear();\n    var text = henkan2(form.text.value);\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"$\" + text + \"\\\\ \\\\\\\\\\n \\\\ \\\\\\\\\\n\\\\ \\\\\\\\\\n\\\\ \\\\\\\\\\n\\\\ \\\\\\\\\\n\\\\ \\\\\\\\\\n\\\\ \\\\\\\\\\n\\\\ \\\\\\\\\\n$\");\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].renderKaTeX();\n}\nfunction change_fontsize() {\n    katex_rule.style.cssText = \"font-size : \" + font_size.value + \"em\";\n}\nfunction henkan(str) {\n    str = str.replace(/_([^{]|$)/g, '_{}$1');\n    str = str.replace(/\\^([^{]|$)/g, '^{}$1');\n    str = str.replace(/([^\\\\]|^)sum/g, '$1\\\\sum');\n    str = str.replace(/([^\\\\|d]|^)frac/g, '$1\\\\frac{}{}');\n    str = str.replace(/([^\\\\]|^)dfrac/g, '$1\\\\dfrac{}{}');\n    str = str.replace(/([^\\\\]|^)int/g, '$1\\\\int');\n    str = str.replace(/([^\\\\]|^)infty/g, '$1\\\\infty');\n    str = str.replace(/([^\\\\]|^)iint/g, '$1\\\\iint');\n    str = str.replace(/([^\\\\]|^)oint/g, '$1\\\\oint');\n    str = str.replace(/([^\\\\]|^)sin/g, '$1\\\\sin');\n    str = str.replace(/([^\\\\]|^)cos/g, '$1\\\\cos');\n    str = str.replace(/([^\\\\]|^)tan/g, '$1\\\\tan');\n    str = str.replace(/([^\\\\]|^)log/g, '$1\\\\log');\n    str = str.replace(/([^\\\\]|^)lim/g, '$1\\\\lim');\n    str = str.replace(/([^\\\\]|^)prod/g, '$1\\\\prod');\n    str = str.replace(/([^\\\\]|^)vec/g, '$1\\\\vec{}');\n    str = str.replace(/([^\\\\]|^)alpha/g, '$1\\\\alpha');\n    str = str.replace(/([^\\\\]|^)beta/g, '$1\\\\beta');\n    str = str.replace(/([^\\\\]|^)gamma/g, '$1\\\\gamma');\n    str = str.replace(/([^\\\\]|^)pi/g, '$1\\\\pi');\n    str = str.replace(/([^\\\\]|^)theta/g, '$1\\\\theta');\n    str = str.replace(/([^\\\\]|^)cdot/g, '$1\\\\cdot');\n    str = str.replace(/([^\\\\]|^)left\\(/g, '$1\\\\left\\(\\\\right\\)');\n    str = str.replace(/([^\\\\]|^)left\\[/g, '$1\\\\left\\[\\\\right\\]');\n    str = str.replace(/([^{])case/g, '$1\\\\begin{cases}\\n\\n\\\\end{cases}');\n    str = str.replace(/([^{])align/g, '$1\\\\begin{aligned}\\n\\n\\\\end{aligned}');\n    return str;\n}\nfunction henkan2(str) {\n    str = str.replace(/\\\\$/, '');\n    str = str.replace(/{cases}\\n/g, '{cases}');\n    str = str.replace(/{aligned}\\n/g, '{aligned}');\n    str = str.replace(/\\.\\n/g, '');\n    str = str.replace(/\\n/g, '\\\\ \\\\\\\\\\n');\n    str = str.replace(/>=/g, '\\\\geqq');\n    str = str.replace(/<=/g, '\\\\leqq');\n    str = str.replace(/\\\\vec2/g, '\\\\overrightarrow');\n    return str;\n}\nfunction getRuleBySelector(sele) {\n    var i, j, sheets, rules, rule = null;\n    // stylesheetのリストを取得\n    sheets = document.styleSheets;\n    for (i = 0; i < sheets.length; i++) {\n        // そのstylesheetが持つCSSルールのリストを取得\n        rules = sheets[i].cssRules;\n        for (j = 0; j < rules.length; j++) {\n            // セレクタが一致するか調べる\n            if (sele === rules[j].selectorText) {\n                rule = rules[j];\n                break;\n            }\n        }\n    }\n    return rule;\n}\nfunction change_range() {\n    var v = parseInt(range.value) / 100;\n    var left = 30 * (1 - v) + 80 * v;\n    text_form.style.cssText = \"\\\r\n    position: fixed;\\\r\n    top: 20px;\\\r\n    left: \" + left + \"%;\\\r\n    width: 50%;\\\r\n    height: 80%;\\\r\n\";\n}\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ }),

/***/ 0:
/*!****************************************!*\
  !*** multi ./src/main.ts ./src/use.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/main.ts */\"./src/main.ts\");\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module './src/use.ts'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n\n\n//# sourceURL=webpack:///multi_./src/main.ts_./src/use.ts?");

/***/ })

/******/ });