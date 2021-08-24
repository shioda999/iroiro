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

eval("var form, text_form, katex_rule, menu, range, auto_update, font_size, text_area, error_cnt = 0;\nsetTimeout(function () { return setup(); }, 200);\nfunction setup() {\n    console.log(\"setup\");\n    form = document[\"form\"];\n    text_form = getRuleBySelector('.textform');\n    katex_rule = getRuleBySelector('.katex');\n    text_area = document.getElementById(\"text\");\n    menu = document.getElementById(\"floating_menu\");\n    range = menu.children[\"move\"];\n    auto_update = menu.children[\"auto_update\"];\n    font_size = menu.children[\"font_size\"];\n    if (text_form == null || katex_rule == null) {\n        console.log(\"error\");\n        setTimeout(function () { return setup(); }, 200);\n        if (error_cnt == 10)\n            alert(\"error ページをリロードしてください。\");\n        error_cnt++;\n        return;\n    }\n    set_button_option();\n    auto_update.onclick = function () { return onClick(); };\n    font_size.addEventListener('change', function () { change_fontsize(), onClick(); });\n    range.addEventListener('input', function () { return change_range(); });\n    change_fontsize();\n    document.getElementById(\"button_menu\").onclick = form.onkeyup = function () {\n        var pos = form.text.selectionStart;\n        var len = form.text.value.length;\n        change_fontsize();\n        if (form.text.value.length != len)\n            pos++;\n        form.text.selectionEnd = form.text.selectionStart = pos;\n        if (auto_update.checked)\n            onClick();\n    };\n    form.text.value = \"a+b+c\";\n    onClick();\n}\nfunction set_button_option() {\n    document.getElementById(\"button_clear\").onclick = function () { if (window.confirm(\"本当にテキストを全て削除しますか？\"))\n        form.text.value = \"\"; };\n    document.getElementById(\"button_cases\").onclick = function () { return add_str(\"\\n\\\\begin{cases}\\n\", \"\\n\\\\end{cases}\"); };\n    document.getElementById(\"button_align\").onclick = function () { return add_str(\"\\n\\\\begin{aligned}\\n\", \"\\n\\\\end{aligned}\", true); };\n    document.getElementById(\"button_frac\").onclick = function () { return add_str(\"\\\\frac{a}{b}\"); };\n    document.getElementById(\"button_dfrac\").onclick = function () { return add_str(\"\\\\dfrac{a}{b}\"); };\n    document.getElementById(\"button_mathrm\").onclick = function () { return add_str(\"\\\\mathrm{\", \"}\"); };\n    document.getElementById(\"button_rightarrow\").onclick = function () { return add_str(\"\\\\rightarrow \"); };\n    document.getElementById(\"syntax_checker\").onclick = function () { return syntax_check(); };\n    document.getElementById(\"pen_mode\").onclick = function () { return pen_modeClick(); };\n}\nfunction add_str(str1, str2, flag) {\n    if (str2 === void 0) { str2 = \"\"; }\n    if (flag === void 0) { flag = false; }\n    var pos = form.text.selectionStart;\n    var pos2 = form.text.selectionEnd;\n    var pre = form.text.value.slice(0, pos);\n    var middle = form.text.value.slice(pos, pos2);\n    var after = form.text.value.slice(pos2);\n    middle = middle.replace(/(^|[^&])=/g, '$1&=');\n    pre += str1;\n    middle += str2;\n    form.text.value = pre + middle + after;\n    form.text.focus();\n    form.text.selectionEnd = form.text.selectionStart = pre.length + middle.length;\n}\nfunction syntax_check() {\n    var html, ok = true;\n    try {\n        html = katex.renderToString(form.text.value, {});\n    }\n    catch (error) {\n        alert(error.message);\n        var list = error.message.split(':');\n        if (list[0] === \"KaTeX parse error\") {\n            var list2 = list[2].split(' ');\n            var len = list2[1].length;\n            var pos = parseInt(list2[4], 10);\n            form.text.focus();\n            form.text.selectionStart = pos - 1;\n            form.text.selectionEnd = pos + len;\n        }\n    }\n}\nfunction onClick() {\n    var text = henkan2(form.text.value);\n    var html, ok = true;\n    try {\n        html = katex.renderToString(text, {}) + \"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>\";\n    }\n    catch (error) {\n        ok = false;\n    }\n    if (ok) {\n        console.log(html);\n        text_area.innerHTML = html;\n    }\n}\nfunction pen_modeClick() {\n    if (text_area.innerHTML == \"\")\n        return;\n    html2canvas(text_area).then(function (canvas) {\n        {\n            var canvas2 = document.getElementById(\"draw-area\");\n            var context = canvas.getContext(\"2d\");\n            var context2 = canvas2.getContext(\"2d\");\n            var image = context.getImageData(0, 0, canvas.width, canvas.height);\n            var x = text_area.getBoundingClientRect().left;\n            var y = text_area.getBoundingClientRect().top;\n            var W = document.body.getBoundingClientRect().width;\n            canvas2.width = Math.max(canvas.width + x + 200, W - 10);\n            canvas2.height = canvas.height + y;\n            context2.putImageData(image, x, y);\n            text_area.innerHTML = \"\";\n        }\n    });\n}\nfunction change_fontsize() {\n    katex_rule.style.cssText = \"font-size : \" + font_size.value + \"em\";\n}\nfunction henkan2(str) {\n    str = str.replace(/\\\\$/, '');\n    str = str.replace(/\\*/g, '\\\\times ');\n    str = str.replace(/\\//g, '\\\\div ');\n    str = str.replace(/\\\\begin{cases}\\n/g, '\\\\begin{cases}');\n    str = str.replace(/\\\\begin{aligned}\\n/g, '\\\\begin{aligned}');\n    str = str.replace(/\\\\begin{matrix}\\n/g, '\\\\left\\(\\\\begin{array}{}');\n    str = str.replace(/\\\\end{matrix}/g, '\\\\end{array}\\\\right\\)');\n    str = str.replace(/\\.\\n/g, '');\n    str = str.replace(/\\n/g, '\\\\ \\\\\\\\\\n');\n    str = str.replace(/>=/g, '\\\\geqq');\n    str = str.replace(/<=/g, '\\\\leqq');\n    str = str.replace(/\\\\vec2/g, '\\\\overrightarrow');\n    return str;\n}\nfunction getRuleBySelector(sele) {\n    var i, j, sheets, rules, rule = null;\n    // stylesheetのリストを取得\n    sheets = document.styleSheets;\n    for (i = 0; i < sheets.length; i++) {\n        // そのstylesheetが持つCSSルールのリストを取得\n        rules = sheets[i].cssRules;\n        for (j = 0; j < rules.length; j++) {\n            // セレクタが一致するか調べる\n            if (sele === rules[j].selectorText) {\n                rule = rules[j];\n                break;\n            }\n        }\n    }\n    return rule;\n}\nfunction change_range() {\n    var v = parseInt(range.value) / 100;\n    var left = 30 * (1 - v) + 80 * v;\n    text_form.style.cssText = \"\\\r\n    position: fixed;\\\r\n    top: 20px;\\\r\n    left: \" + left + \"%;\\\r\n    width: 50%;\\\r\n    height: 80%;\\\r\n\";\n}\nwindow.addEventListener('load', function () {\n    var canvas = document.querySelector('#draw-area');\n    // contextを使ってcanvasに絵を書いていく\n    var context = canvas.getContext('2d');\n    // 直前のマウスのcanvas上のx座標とy座標を記録する\n    var lastPosition = { x: null, y: null };\n    // マウスがドラッグされているか(クリックされたままか)判断するためのフラグ\n    var isDrag = false;\n    // 絵を書く\n    function draw(x, y) {\n        // マウスがドラッグされていなかったら処理を中断する。\n        // ドラッグしながらしか絵を書くことが出来ない。\n        if (!isDrag) {\n            return;\n        }\n        // 「context.beginPath()」と「context.closePath()」を都度draw関数内で実行するよりも、\n        // 線の描き始め(dragStart関数)と線の描き終わり(dragEnd)で1回ずつ読んだほうがより綺麗に線画書ける\n        // 線の状態を定義する\n        // MDN CanvasRenderingContext2D: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin\n        context.lineCap = 'round'; // 丸みを帯びた線にする\n        context.lineJoin = 'round'; // 丸みを帯びた線にする\n        context.lineWidth = 5; // 線の太さ\n        context.strokeStyle = 'black'; // 線の色\n        // 書き始めは lastPosition.x, lastPosition.y の値はnullとなっているため、\n        // クリックしたところを開始点としている。\n        // この関数(draw関数内)の最後の2行で lastPosition.xとlastPosition.yに\n        // 現在のx, y座標を記録することで、次にマウスを動かした時に、\n        // 前回の位置から現在のマウスの位置まで線を引くようになる。\n        if (lastPosition.x === null || lastPosition.y === null) {\n            // ドラッグ開始時の線の開始位置\n            context.moveTo(x, y);\n        }\n        else {\n            // ドラッグ中の線の開始位置\n            context.moveTo(lastPosition.x, lastPosition.y);\n        }\n        // context.moveToで設定した位置から、context.lineToで設定した位置までの線を引く。\n        // - 開始時はmoveToとlineToの値が同じであるためただの点となる。\n        // - ドラッグ中はlastPosition変数で前回のマウス位置を記録しているため、\n        //   前回の位置から現在の位置までの線(点のつながり)となる\n        context.lineTo(x, y);\n        // context.moveTo, context.lineToの値を元に実際に線を引く\n        context.stroke();\n        // 現在のマウス位置を記録して、次回線を書くときの開始点に使う\n        lastPosition.x = x;\n        lastPosition.y = y;\n    }\n    // canvas上に書いた絵を全部消す\n    function clearCanvas() {\n        context.clearRect(0, 0, canvas.width, canvas.height);\n    }\n    // マウスのドラッグを開始したらisDragのフラグをtrueにしてdraw関数内で\n    // お絵かき処理が途中で止まらないようにする\n    function dragStart(event) {\n        console.log(\"start\");\n        // これから新しい線を書き始めることを宣言する\n        // 一連の線を書く処理が終了したらdragEnd関数内のclosePathで終了を宣言する\n        context.beginPath();\n        isDrag = true;\n    }\n    // マウスのドラッグが終了したら、もしくはマウスがcanvas外に移動したら\n    // isDragのフラグをfalseにしてdraw関数内でお絵かき処理が中断されるようにする\n    function dragEnd(event) {\n        // 線を書く処理の終了を宣言する\n        context.closePath();\n        isDrag = false;\n        // 描画中に記録していた値をリセットする\n        lastPosition.x = null;\n        lastPosition.y = null;\n    }\n    // マウス操作やボタンクリック時のイベント処理を定義する\n    function initEventHandler() {\n        var clearButton = document.getElementById('button_clearpen');\n        if (clearButton)\n            clearButton.addEventListener('click', clearCanvas);\n        canvas.addEventListener('mousedown', dragStart);\n        canvas.addEventListener('mouseup', dragEnd);\n        canvas.addEventListener('mouseout', dragEnd);\n        canvas.addEventListener('mousemove', function (event) {\n            // eventの中の値を見たい場合は以下のようにconsole.log(event)で、\n            // デベロッパーツールのコンソールに出力させると良い\n            // console.log(event);\n            draw(event.layerX, event.layerY);\n        });\n    }\n    // イベント処理を初期化する\n    initEventHandler();\n});\n\n\n//# sourceURL=webpack:///./src/main.ts?");

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