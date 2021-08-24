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

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var form, text_form, katex_rule, menu, range, auto_update, font_size, error_cnt = 0;\nvar html_temp;\nsetTimeout(function () { return setup(); }, 200);\nfunction setup() {\n    console.log(\"setup\");\n    form = document[\"form\"];\n    text_form = getRuleBySelector('.textform');\n    katex_rule = getRuleBySelector('.katex');\n    menu = document.getElementById(\"floating_menu\");\n    range = menu.children[\"move\"];\n    auto_update = menu.children[\"auto_update\"];\n    font_size = menu.children[\"font_size\"];\n    if (text_form == null || katex_rule == null) {\n        console.log(\"error\");\n        setTimeout(function () { return setup(); }, 200);\n        if (error_cnt == 10)\n            alert(\"error ページをリロードしてください。\");\n        error_cnt++;\n        return;\n    }\n    set_button_option();\n    auto_update.onclick = function () { return onclick(); };\n    font_size.addEventListener('change', function () { change_fontsize(), onclick(); });\n    range.addEventListener('input', function () { return change_range(); });\n    change_fontsize();\n    document.getElementById(\"button_menu\").onclick = form.onkeyup = function () {\n        var pos = form.text.selectionStart;\n        var len = form.text.value.length;\n        change_fontsize();\n        if (form.text.value.length != len)\n            pos++;\n        form.text.selectionEnd = form.text.selectionStart = pos;\n        if (auto_update.checked)\n            onclick();\n    };\n    form.text.value = \"a+b+c\";\n    onclick();\n}\nfunction set_button_option() {\n    document.getElementById(\"button_clear\").onclick = function () { if (window.confirm(\"本当にテキストを全て削除しますか？\"))\n        form.text.value = \"\"; };\n    document.getElementById(\"button_cases\").onclick = function () { return add_str(\"\\n\\\\begin{cases}\\n\", \"\\n\\\\end{cases}\"); };\n    document.getElementById(\"button_align\").onclick = function () { return add_str(\"\\n\\\\begin{aligned}\\n\", \"\\n\\\\end{aligned}\", true); };\n    document.getElementById(\"button_frac\").onclick = function () { return add_str(\"\\\\frac{a}{b}\"); };\n    document.getElementById(\"button_dfrac\").onclick = function () { return add_str(\"\\\\dfrac{a}{b}\"); };\n    document.getElementById(\"syntax_checker\").onclick = function () { return onclick(true); };\n}\nfunction add_str(str1, str2, flag) {\n    if (str2 === void 0) { str2 = \"\"; }\n    if (flag === void 0) { flag = false; }\n    var pos = form.text.selectionStart;\n    var pos2 = form.text.selectionEnd;\n    var pre = form.text.value.slice(0, pos);\n    var middle = form.text.value.slice(pos, pos2);\n    var after = form.text.value.slice(pos2);\n    middle = middle.replace(/(^|[^&])=/g, '$1&=');\n    pre += str1;\n    middle += str2;\n    form.text.value = pre + middle + after;\n    form.text.focus();\n    form.text.selectionEnd = form.text.selectionStart = pre.length + middle.length;\n}\nfunction onclick(error_disp) {\n    if (error_disp === void 0) { error_disp = false; }\n    var text = henkan2(form.text.value);\n    var html, msg = \"\";\n    try {\n        html = katex.renderToString(text, {}) + \"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>\";\n    }\n    catch (error) {\n        msg = error.message;\n    }\n    if (!msg) {\n        html_temp = html;\n        document.getElementById(\"text\").innerHTML = html_temp;\n    }\n    if (msg && error_disp) {\n        alert(msg);\n        console.log(msg);\n    }\n}\nfunction change_fontsize() {\n    katex_rule.style.cssText = \"font-size : \" + font_size.value + \"em\";\n}\nfunction henkan2(str) {\n    str = str.replace(/\\\\$/, '');\n    str = str.replace(/\\*/g, '\\\\times ');\n    str = str.replace(/\\//g, '\\\\div ');\n    str = str.replace(/\\\\begin{cases}\\n/g, '\\\\begin{cases}');\n    str = str.replace(/\\\\begin{aligned}\\n/g, '\\\\begin{aligned}');\n    str = str.replace(/\\\\begin{matrix}\\n/g, '\\\\left\\(\\\\begin{array}{}');\n    str = str.replace(/\\\\end{matrix}/g, '\\\\end{array}\\\\right\\)');\n    str = str.replace(/\\.\\n/g, '');\n    str = str.replace(/\\n/g, '\\\\ \\\\\\\\\\n');\n    str = str.replace(/>=/g, '\\\\geqq');\n    str = str.replace(/<=/g, '\\\\leqq');\n    str = str.replace(/\\\\vec2/g, '\\\\overrightarrow');\n    return str;\n}\nfunction getRuleBySelector(sele) {\n    var i, j, sheets, rules, rule = null;\n    // stylesheetのリストを取得\n    sheets = document.styleSheets;\n    for (i = 0; i < sheets.length; i++) {\n        // そのstylesheetが持つCSSルールのリストを取得\n        rules = sheets[i].cssRules;\n        for (j = 0; j < rules.length; j++) {\n            // セレクタが一致するか調べる\n            if (sele === rules[j].selectorText) {\n                rule = rules[j];\n                break;\n            }\n        }\n    }\n    return rule;\n}\nfunction change_range() {\n    var v = parseInt(range.value) / 100;\n    var left = 30 * (1 - v) + 80 * v;\n    text_form.style.cssText = \"\\\r\n    position: fixed;\\\r\n    top: 20px;\\\r\n    left: \" + left + \"%;\\\r\n    width: 50%;\\\r\n    height: 80%;\\\r\n\";\n}\n\n\n//# sourceURL=webpack:///./src/main.ts?");

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