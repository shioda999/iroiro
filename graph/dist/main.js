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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Output\", function() { return Output; });\nvar Output = /** @class */ (function () {\n    function Output() {\n    }\n    Output.print = function (str, type) {\n        if (type === void 0) { type = \"normal\"; }\n        var head, end;\n        str = this.escapeHtml(str);\n        if (type === \"raw\") {\n            head = \"\";\n            end = \"\";\n        }\n        else {\n            head = \"<p class = \\\"\" + type + \"\\\">\";\n            end = \"</p>\";\n        }\n        document.getElementById(\"text\").innerHTML += head + str + end;\n    };\n    Output.clear = function () {\n        document.getElementById(\"text\").innerHTML = \"\";\n    };\n    Output.renderKaTeX = function () {\n        if (typeof renderMathInElement === 'undefined')\n            return;\n        renderMathInElement(document.body, {\n            delimiters: [\n                { left: \"$$\", right: \"$$\", display: true },\n                { left: \"$\", right: \"$\", display: false }\n            ]\n        });\n    };\n    Output.escapeHtml = function (str) {\n        str = str.replace(/&/g, '&amp;');\n        str = str.replace(/</g, '&lt;');\n        str = str.replace(/>/g, '&gt;');\n        str = str.replace(/\"/g, '&quot;');\n        str = str.replace(/'/g, '&#39;');\n        return str;\n    };\n    return Output;\n}());\n\n\n\n//# sourceURL=webpack:///../common/output.ts?");

/***/ }),

/***/ "./src/graph.ts":
/*!**********************!*\
  !*** ./src/graph.ts ***!
  \**********************/
/*! exports provided: Graph */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Graph\", function() { return Graph; });\nvar Graph = /** @class */ (function () {\n    function Graph() {\n    }\n    Graph.get_scaleX = function (canvas, left, right) {\n        var margin = 50;\n        var width = canvas.width - margin * 2, height = canvas.height - margin * 2;\n        var scale_x = width / (right - left);\n        return scale_x;\n    };\n    Graph.plot = function (data, canvas) {\n        if (!canvas.getContext)\n            return \"キャンバスが使用できません。\";\n        var ctx = canvas.getContext('2d');\n        ctx.clearRect(0, 0, canvas.width, canvas.height);\n        var left = data.min_x, right = data.max_x;\n        if (left >= right) {\n            return \"定義域が不正です。\";\n        }\n        var margin = 50;\n        var width = canvas.width - margin * 2, height = canvas.height - margin * 2;\n        var scale_x = width / (right - left);\n        var scale_y = height / (data.max_y - data.min_y);\n        this.drawAxis(ctx, canvas, data.max_y, left, scale_y, scale_x, margin);\n        ctx.beginPath();\n        for (var i = 0; i < data.v_num; i++) {\n            var x = void 0, y = void 0;\n            x = (data.x[i] - left) * scale_x + margin;\n            y = (data.max_y - data.y[i]) * scale_y + margin;\n            if (i === 0)\n                ctx.moveTo(x, y);\n            else\n                ctx.lineTo(x, y);\n        }\n        ctx.stroke();\n    };\n    Graph.drawAxis = function (ctx, canvas, top, left, scale_y, scale_x, margin) {\n        var arrow_size = 5;\n        ctx.beginPath();\n        ctx.moveTo(0, top * scale_y + margin);\n        ctx.lineTo(canvas.width, top * scale_y + margin);\n        ctx.lineTo(canvas.width - arrow_size * 1.414, top * scale_y + margin - arrow_size * 1.414);\n        ctx.lineTo(canvas.width, top * scale_y + margin);\n        ctx.lineTo(canvas.width - arrow_size * 1.414, top * scale_y + margin + arrow_size * 1.414);\n        ctx.moveTo(-left * scale_x + margin, canvas.height);\n        ctx.lineTo(-left * scale_x + margin, 0);\n        ctx.lineTo(-left * scale_x + margin - arrow_size * 1.414, arrow_size * 1.414);\n        ctx.lineTo(-left * scale_x + margin, 0);\n        ctx.lineTo(-left * scale_x + margin + arrow_size * 1.414, arrow_size * 1.414);\n        ctx.stroke();\n    };\n    return Graph;\n}());\n\n\n\n//# sourceURL=webpack:///./src/graph.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_output__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/output */ \"../common/output.ts\");\n/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parse */ \"./src/parse.ts\");\n/* harmony import */ var _graph__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./graph */ \"./src/graph.ts\");\n\n\n\nvar button = document.getElementById(\"button\");\nvar form = document.form;\nif (button)\n    form.onkeyup = form.onchange = button.onclick = function () { return onclick(); };\nform.text.value = \"sinx\";\nonclick();\nfunction onclick() {\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].clear();\n    var text = preparation(form.text.value);\n    var formula = _parse__WEBPACK_IMPORTED_MODULE_1__[\"Parse\"].parse(text);\n    console.log(formula);\n    text = conv(text);\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"・$y = \" + text + \"\\\\ $\", \"headline\");\n    _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].renderKaTeX();\n    plot(formula);\n}\nfunction plot(formula) {\n    var left = parseFloat(form.left.value), right = parseFloat(form.right.value);\n    var canvas = document.getElementById('sample');\n    var scale_x = _graph__WEBPACK_IMPORTED_MODULE_2__[\"Graph\"].get_scaleX(canvas, left, right);\n    var v = getpoint(formula, left, right, 1 / scale_x);\n    if (!v)\n        return;\n    var error = _graph__WEBPACK_IMPORTED_MODULE_2__[\"Graph\"].plot(v, canvas);\n    if (error)\n        _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(error, \"error\");\n}\nfunction getpoint(formula, left, right, d) {\n    var px = [], py = [], max_y = NaN, min_y = NaN;\n    if (left >= right) {\n        _common_output__WEBPACK_IMPORTED_MODULE_0__[\"Output\"].print(\"定義域が不正です。\", \"error\");\n        return;\n    }\n    for (var x = left, y = void 0; x <= right; x += d) {\n        y = _parse__WEBPACK_IMPORTED_MODULE_1__[\"Parse\"].calc(formula, x);\n        if (isNaN(y))\n            continue;\n        px.push(x);\n        py.push(y);\n        if (isNaN(max_y))\n            max_y = min_y = y;\n        else\n            max_y = Math.max(max_y, y), min_y = Math.min(min_y, y);\n    }\n    if (isNaN(max_y))\n        max_y = min_y = 0;\n    max_y = Math.min(10, max_y + d);\n    min_y = Math.max(-10, min_y - d);\n    return { \"x\": px, \"y\": py, \"max_y\": max_y, \"min_y\": min_y, \"max_x\": right, \"min_x\": left, \"v_num\": px.length };\n}\nfunction conv(str) {\n    str = str.replace(/\\*/g, \"\\\\times \");\n    str = str.replace(/\\//g, \"\\\\div \");\n    str = str.replace(/sin/g, \"\\\\sin \");\n    str = str.replace(/cos/g, \"\\\\cos \");\n    str = str.replace(/tan/g, \"\\\\tan \");\n    str = str.replace(/arc\\\\sin/g, \"\\\\arcsin \");\n    str = str.replace(/arc\\\\cos/g, \"\\\\arccos \");\n    str = str.replace(/arc\\\\tan/g, \"\\\\arctan \");\n    str = str.replace(/log/g, \"\\\\log \");\n    str = str.replace(/log 2/g, \"\\\\log_2 \");\n    str = str.replace(/log 10/g, \"\\\\log_{10} \");\n    str = str.replace(/pi/g, \"\\\\pi \");\n    for (var i = 0, i2 = void 0; i < str.length - 1; i++) {\n        if (str[i] === \"^\" && str[i + 1] === \"(\") {\n            var nest = 0;\n            for (i2 = i + 1; i2 < str.length; i2++) {\n                if (str[i2] === '(')\n                    nest++;\n                if (str[i2] === ')') {\n                    nest--;\n                    if (nest == 0)\n                        break;\n                }\n            }\n            if (i2 < str.length)\n                str = str.slice(0, i + 1) + \"{\" + str.slice(i + 2, i2) + \"}\" + str.slice(i2 + 1);\n            else\n                str = str.slice(0, i + 1) + \"{\" + str.slice(i + 2) + \"}\";\n        }\n        else if (str[i] === \"^\" && str[i + 1] !== \"(\") {\n            i2 = i + 1;\n            if (str[i2] === \"-\")\n                i2++;\n            if (str[i2] === \"x\")\n                i2++;\n            for (; i2 < str.length; i2++)\n                if (!('0' <= str[i2] && str[i2] <= '9'))\n                    break;\n            if (i2 < str.length)\n                str = str.slice(0, i + 1) + \"{\" + str.slice(i + 1, i2) + \"}\" + str.slice(i2);\n            else\n                str = str.slice(0, i + 1) + \"{\" + str.slice(i + 1) + \"}\";\n        }\n    }\n    return str;\n}\nfunction preparation(text) {\n    text = text.replace(/{/g, \"(\");\n    text = text.replace(/}/g, \")\");\n    text = text.replace(/\\[/g, \"(\");\n    text = text.replace(/\\]/g, \")\");\n    text = text.replace(/sin\\^-1/g, \"arcsin\");\n    text = text.replace(/asin/g, \"arcsin\");\n    text = text.replace(/cos\\^-1/g, \"arccos\");\n    text = text.replace(/acos/g, \"arccos\");\n    text = text.replace(/tan\\^-1/g, \"arctan\");\n    text = text.replace(/atan/g, \"arctan\");\n    return text;\n}\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ }),

/***/ "./src/parse.ts":
/*!**********************!*\
  !*** ./src/parse.ts ***!
  \**********************/
/*! exports provided: Parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Parse\", function() { return Parse; });\nvar default_reserved = {\n    \"+\": { priority: 3, type: \"ope\", calc: function (p1, p2) { return p1 + p2; } },\n    \"-\": { priority: 4, type: \"ope\", calc: function (p1, p2) { return p1 - p2; } },\n    \"*\": { priority: 1, type: \"ope\", calc: function (p1, p2) { return p1 * p2; } },\n    \"/\": { priority: 2, type: \"ope\", calc: function (p1, p2) { return p1 / p2; } },\n    \".\": { priority: 0, type: \"ope\", back: true, calc: function (p1, p2) { return p1 * p2; } },\n    \"^\": { priority: -1, type: \"ope\", back: true, calc: function (p1, p2) { return Math.pow(p1, p2); } },\n    \"pi\": { priority: 0, type: \"const\", value: Math.PI },\n    \"e\": { priority: 0, type: \"const\", value: Math.E },\n    \"\\%\": { priority: 0, type: \"func\", back: true, calc: function (p) { return p * 0.01; } },\n    \"_-\": { priority: 0, type: \"func\", back: true, calc: function (p) { return -p; } },\n    \"sin\": { priority: 0, type: \"func\", back: true, calc: function (p) { return Math.sin(p[0]); } },\n    \"cos\": { priority: 0, type: \"func\", back: true, calc: function (p) { return Math.cos(p[0]); } },\n    \"tan\": { priority: 0, type: \"func\", back: true, calc: function (p) { return Math.tan(p[0]); } },\n    \"arcsin\": { priority: 0, type: \"func\", back: true, calc: function (p) { return Math.asin(p[0]); } },\n    \"arccos\": { priority: 0, type: \"func\", back: true, calc: function (p) { return Math.acos(p[0]); } },\n    \"arctan\": { priority: 0, type: \"func\", back: true, calc: function (p) { return Math.atan(p[0]); } },\n    \"sin^\": { priority: 0, type: \"func\", back: true, param: 2, calc: function (p) { return Math.pow(Math.sin(p[0]), p[1]); } },\n    \"cos^\": { priority: 0, type: \"func\", back: true, param: 2, calc: function (p) { return Math.pow(Math.cos(p[0]), p[1]); } },\n    \"tan^\": { priority: 0, type: \"func\", back: true, param: 2, calc: function (p) { return Math.pow(Math.tan(p[0]), p[1]); } },\n    \"log_\": { priority: 0, type: \"func\", back: true, param: 2, calc: function (p) { return Math.log(p[0]) / Math.log(p[1]); } },\n    \"log\": { priority: 0, type: \"func\", back: true, calc: function (p) { return Math.log(p[0]); } },\n    \"log2\": { priority: 0, type: \"func\", back: true, calc: function (p) { return Math.log(p[0]) / Math.log(2.0); } },\n    \"log10\": { priority: 0, type: \"func\", back: true, calc: function (p) { return Math.log(p[0]) / Math.log(10.0); } },\n    \"(\": { priority: 0, type: \"brackets\" },\n    \")\": { priority: 0, type: \"brackets\" }\n};\nvar Parse = /** @class */ (function () {\n    function Parse() {\n    }\n    Parse.parse = function (str) {\n        var data = this.split(str);\n        data = this.sort_by_priority(data);\n        return data;\n    };\n    Parse.sort_by_priority = function (data, s, e) {\n        if (s === void 0) { s = 0; }\n        if (e === void 0) { e = data.length; }\n        var r = [], ope = [];\n        for (var i = s; i < e; i++) {\n            if (data[i] === \"(\") {\n                var nest = 1, i2 = void 0;\n                for (i2 = i + 1; i2 < e; i2++) {\n                    if (data[i2] === \"(\")\n                        nest++;\n                    if (data[i2] === \")\") {\n                        nest--;\n                        if (nest == 0)\n                            break;\n                    }\n                }\n                var add = this.sort_by_priority(data, i + 1, i2);\n                add.forEach(function (e) { return r.push(e); });\n                i = i2;\n                continue;\n            }\n            if (!this.reserved[data[i]] || this.reserved[data[i]] && this.reserved[data[i]].type === \"const\") {\n                r.push(data[i]);\n            }\n            else {\n                while (ope.length > 0 && this.reserved[ope[ope.length - 1]].priority <= this.reserved[data[i]].priority) {\n                    if (this.reserved[ope[ope.length - 1]].priority == this.reserved[data[i]].priority && this.reserved[ope[ope.length - 1]].back)\n                        break;\n                    r.push(ope.pop());\n                }\n                ope.push(data[i]);\n            }\n        }\n        ope = ope.reverse();\n        return r.concat(ope);\n    };\n    Parse.str_check = function (str, offset, str2) {\n        if (str.length - offset < str2.length)\n            return 0;\n        for (var i = 0; i < str2.length; i++) {\n            if (str[i + offset] !== str2[i])\n                return 0;\n        }\n        return str2.length;\n    };\n    Parse.split = function (str, s, e) {\n        if (s === void 0) { s = 0; }\n        if (e === void 0) { e = str.length; }\n        var data = [];\n        var c = 0, M = 0, k = \"\", n, pr_num = 0, minus = 0, dot = 0;\n        for (var i = s; i < e; i++) {\n            if (str[i] == \" \" || str[i] == \"\\\\\") {\n                continue;\n            }\n            c = 0;\n            minus = 0;\n            if (pr_num <= 0 && str[i] === \"-\")\n                minus = 1, i++;\n            while ('0' <= str[i + c] && str[i + c] <= '9' || str[i + c] == '.')\n                c++;\n            if (c) {\n                k = (minus ? \"-\" : \"\") + str.slice(i, i + c);\n                if (pr_num > 0)\n                    data.push(\".\");\n                else\n                    pr_num++;\n                data.push(k);\n                console.log(k + \" \" + pr_num);\n                k = \"\";\n                i += c - 1;\n                continue;\n            }\n            else if (minus)\n                data.push(\"_-\");\n            M = 0;\n            for (var key in this.reserved) {\n                var temp = this.str_check(str, i, key);\n                if (M < temp) {\n                    M = temp;\n                    k = key;\n                }\n            }\n            if (!k || k && this.reserved[k].type === \"const\") {\n                if (!k)\n                    k = str[i];\n                if (pr_num > 0)\n                    data.push(\".\");\n                else\n                    pr_num++;\n            }\n            else if (k === ')') {\n            }\n            else {\n                if (pr_num > 0 && (this.reserved[k].type === \"func\" || this.reserved[k].type === \"brackets\")) {\n                    data.push(\".\");\n                }\n                if (this.reserved[k].param)\n                    pr_num = -this.reserved[k].param + 1;\n                else\n                    pr_num = 0;\n            }\n            console.log(k + \" \" + pr_num);\n            data.push(k);\n            i += k.length - 1;\n            k = \"\";\n        }\n        console.log(data);\n        return data;\n    };\n    Parse.calc = function (formula, x) {\n        var stack = [];\n        for (var i = 0; i < formula.length; i++) {\n            if (formula[i] === \"x\")\n                stack.push(x);\n            else {\n                var word = this.reserved[formula[i]];\n                if (!word) { //数値\n                    stack.push(parseFloat(formula[i]));\n                    continue;\n                }\n                switch (word.type) {\n                    case \"const\":\n                        stack.push(word.value);\n                        break;\n                    case \"ope\":\n                        var p1 = stack.pop();\n                        var p2 = stack.pop();\n                        stack.push(word.calc(p2, p1));\n                        break;\n                    case \"func\":\n                        var p = [];\n                        var num = word.param ? word.param : 1;\n                        for (var i_1 = 0; i_1 < num; i_1++)\n                            p.push(stack.pop());\n                        stack.push(word.calc(p));\n                        break;\n                }\n            }\n        }\n        return stack.pop();\n    };\n    Parse.reserved = default_reserved;\n    return Parse;\n}());\n\n\n\n//# sourceURL=webpack:///./src/parse.ts?");

/***/ })

/******/ });