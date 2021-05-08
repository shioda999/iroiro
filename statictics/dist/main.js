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
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return Output; });
var Output = /** @class */ (function () {
    function Output() {
    }
    Output.print = function (str, type) {
        if (type === void 0) { type = "normal"; }
        var head, end;
        str = this.escapeHtml(str);
        if (type === "raw") {
            head = "";
            end = "";
        }
        else {
            head = "<p class = \"" + type + "\">";
            end = "</p>";
        }
        document.getElementById("text").innerHTML += head + str + end;
    };
    Output.clear = function () {
        document.getElementById("text").innerHTML = "";
    };
    Output.renderKaTeX = function () {
        if (typeof renderMathInElement === 'undefined')
            return;
        renderMathInElement(document.body, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false }
            ]
        });
    };
    Output.escapeHtml = function (str) {
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#39;');
        str = str.replace(/'/g, '&#39;');
        return str;
    };
    return Output;
}());



/***/ }),

/***/ "./src/Cross.ts":
/*!**********************!*\
  !*** ./src/Cross.ts ***!
  \**********************/
/*! exports provided: Cross */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cross", function() { return Cross; });
var Cross = /** @class */ (function () {
    function Cross(data) {
        this.load_and_check(data);
    }
    Cross.prototype.load_and_check = function (data) {
        this.cross = data.cross;
        if (data.class) {
            if (this.cross.length == this.cross[0].length)
                this.class = data.class;
            else {
                //警告
            }
        }
    };
    return Cross;
}());



/***/ }),

/***/ "./src/calc.ts":
/*!*********************!*\
  !*** ./src/calc.ts ***!
  \*********************/
/*! exports provided: Calc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Calc", function() { return Calc; });
/* harmony import */ var _value__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./value */ "./src/value.ts");
/* harmony import */ var _common_output__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/output */ "../common/output.ts");


var Calc = /** @class */ (function () {
    function Calc(data) {
        this.load_and_check(data); //データの格納
        this.test(); //実際にこのような標本を抽出できる確率
        this.mu_estimate(); //母平均の推定
        this.sigma_estimate(); //母分散の推定
    }
    Calc.prototype.load_and_check = function (data) {
        var i;
        this.n = data.n;
        this.S = data.S;
        this.S2 = data.S2;
        this.sigma = data.sigma;
        this.sigma2 = data.sigma2;
        this.mu = data.mu;
        this.X = data.X;
        this.percent = data.percent / 100;
        this.sample = data.sample;
        this.two_side = data.two_side;
        this.decimal_place = data.decimal_place;
        this.bin_p = data.bin_p;
        if (this.decimal_place)
            this.decimal_place = Math.floor(this.decimal_place);
        if (!this.sample && !this.n)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("標本数を入力してください。", "error");
        if (this.bin_p) {
            if (this.sample)
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("sampleは無視されます。", "error");
            if (this.sigma)
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("sigmaは無視されます。", "error");
            if (this.sigma2)
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("sigma2は無視されます。", "error");
            if (this.mu)
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("muは無視されます。", "error");
        }
        if (data.sigma && data.sigma2)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("sigma or sigma2のどちらか片方のみにしてください。", "error");
        else {
            if (data.sigma)
                this.sigma2 = Math.pow(data.sigma, 2);
            if (data.sigma2)
                this.sigma = Math.sqrt(data.sigma2);
        }
        if (data.S && data.S2)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("S or S2のどちらか片方のみにしてください。", "error");
        else {
            if (data.S)
                this.S2 = Math.pow(data.S, 2);
            if (data.S2)
                this.S = Math.sqrt(data.S2);
        }
        if (this.bin_p) {
            this.sigma2 = this.bin_p * (1 - this.bin_p) / this.n;
            this.sigma = Math.sqrt(this.sigma2);
            this.mu = this.bin_p * this.n;
        }
        else if (data.sample) {
            if (data.n)
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("サンプルがあるのでnは不要です。", "error");
            if (data.S)
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("サンプルがあるのでSは不要です。", "error");
            if (data.S2)
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("サンプルがあるのでS2は不要です。", "error");
            if (data.X)
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("サンプルがあるのでXは不要です。", "error");
            this.n = data.sample.length;
            this.X = this.S2 = 0;
            for (i = 0; i < this.n; i++) {
                this.X += data.sample[i] / this.n;
            }
            for (i = 0; i < this.n; i++) {
                this.S2 += Math.pow(this.X - data.sample[i], 2) / this.n;
            }
            this.S = Math.sqrt(this.S2);
        }
        _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("・入力データ", "headline");
        if (!this.decimal_place) {
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("※小数点が指定されなかったので、小数第3位まで表示。");
            this.decimal_place = 3;
        }
        if (this.bin_p)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("二項分布");
        else
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("小数第" + this.decimal_place + "位まで表示。");
        if (this.n)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("標本数   n = " + this.n);
        if (this.mu)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("母平均   μ = " + this.Round(this.mu));
        if (this.X)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("標本平均 X = " + this.Round(this.X));
        if (this.sigma)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("母標準偏差   σ = " + this.Round(this.sigma));
        if (this.sigma2)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("母分散   σ^2 = " + this.Round(this.sigma2));
        if (this.S)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("標準偏差 S = " + this.Round(this.S));
        if (this.S2)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("標本の分散 S^2 = " + this.Round(this.S2));
        if (this.S2 && this.n && !this.sigma)
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("不偏分散σ^2 = " + this.Round((this.S2 * this.n / (this.n - 1))));
        var str = this.two_side ? "(必ず両側検定)" : "";
        if (!this.percent) {
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("※危険率が指定されなかったので、危険率5%で検定。" + str);
            this.percent = 0.05;
        }
        else
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("危険率" + this.percent * 100 + "%" + str);
    };
    Calc.prototype.test = function () {
        if (this.n && this.X && this.mu && (this.sigma || this.S)) {
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("・標本平均が今以上になる確率", "headline");
            if (this.sigma) {
                var v = Math.sqrt(this.n) * (this.X - this.mu) / this.sigma;
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("Z = √n(X - μ)/σ = " + this.Round(v));
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("確率は" + this.Round((Object(_value__WEBPACK_IMPORTED_MODULE_0__["Phi"])(v) * 100)) + "%");
                //Output.print("Z = " + Math.sqrt(n) * (X ))
            }
            else {
                var v = Math.sqrt(this.n - 1) * (this.X - this.mu) / this.S;
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("母分散が不明なので、あくまで参考。");
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("Z = √n-1)(X - μ)/S = " + this.Round(v));
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("確率は" + this.Round((Object(_value__WEBPACK_IMPORTED_MODULE_0__["Phi"])(v) * 100)) + "%");
            }
        }
    };
    Calc.prototype.mu_estimate = function () {
        if (this.n && this.X && (this.sigma || this.S)) {
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("・母平均μの" + (this.mu ? "検定" : "区間推定"), "headline");
            if (this.sigma) {
                if (this.mu && !this.two_side) { //片側検定
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("Z = √n(X - μ)/σはN(0,1)に従う。");
                    var v = Object(_value__WEBPACK_IMPORTED_MODULE_0__["inv_Phi"])(this.percent), r = v * this.sigma / Math.sqrt(this.n);
                    if (this.X > this.mu) {
                        _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(" Z < " + this.Round(v));
                        this.conclusion("μ", this.Round(this.X - r), undefined, this.mu);
                    }
                    else {
                        _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(-this.Round(v) + " < Z ");
                        this.conclusion("μ", undefined, this.Round(this.X + r), this.mu);
                    }
                }
                else { //両側検定
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("Z = √n(X - μ)/σはN(0,1)に従う。");
                    var v = Object(_value__WEBPACK_IMPORTED_MODULE_0__["inv_Phi"])(this.percent / 2), r = v * this.sigma / Math.sqrt(this.n);
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(-this.Round(v) + " < Z < " + this.Round(v));
                    this.conclusion("μ", this.Round(this.X - r), this.Round(this.X + r), this.mu);
                }
            }
            else {
                if (this.mu && !this.two_side) { //片側検定
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("(1)nが小さいとき、");
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("T = √n - 1)(X - μ) / Sは自由度n - 1のt分布に従う。");
                    var v = Object(_value__WEBPACK_IMPORTED_MODULE_0__["T"])(this.percent, this.n - 1), r = void 0;
                    if (v == _value__WEBPACK_IMPORTED_MODULE_0__["Error"])
                        _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("数値は表に乗っていませんでした。", "error");
                    else {
                        r = v * this.S / Math.sqrt(this.n - 1);
                        if (this.X > this.mu) {
                            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(" T < " + this.Round(v));
                            this.conclusion("μ", this.Round(this.X - r), undefined, this.mu);
                        }
                        else {
                            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(-this.Round(v) + " < T ");
                            this.conclusion("μ", undefined, this.Round(this.X + r), this.mu);
                        }
                    }
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("(2)nが大きいとき、");
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("Z = √n-1)(X - μ)/SはN(0,1)に従う。");
                    v = Object(_value__WEBPACK_IMPORTED_MODULE_0__["inv_Phi"])(this.percent), r = v * this.S / Math.sqrt(this.n - 1);
                    if (this.X > this.mu) {
                        _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(" Z < " + this.Round(v));
                        this.conclusion("μ", this.Round(this.X - r), undefined, this.mu);
                    }
                    else {
                        _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(-this.Round(v) + " < Z ");
                        this.conclusion("μ", undefined, this.Round(this.X + r), this.mu);
                    }
                }
                else { //両側検定
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("(1)nが小さいとき、");
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("T = √n - 1)(X - μ) / Sは自由度n - 1のt分布に従う。");
                    var v = Object(_value__WEBPACK_IMPORTED_MODULE_0__["T"])(this.percent / 2, this.n - 1), r = void 0;
                    if (v == _value__WEBPACK_IMPORTED_MODULE_0__["Error"])
                        _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("数値は表に乗っていませんでした。", "error");
                    else {
                        r = v * this.S / Math.sqrt(this.n - 1);
                        _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(-this.Round(v) + " < T < " + this.Round(v));
                        this.conclusion("μ", this.Round(this.X - r), this.Round(this.X + r), this.mu);
                    }
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("(2)nが大きいとき、");
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("Z = √n-1)(X - μ)/SはN(0,1)に従う。");
                    v = Object(_value__WEBPACK_IMPORTED_MODULE_0__["inv_Phi"])(this.percent / 2), r = v * this.S / Math.sqrt(this.n - 1);
                    _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(-this.Round(v) + " < Z < " + this.Round(v));
                    this.conclusion("μ", this.Round(this.X - r), this.Round(this.X + r), this.mu);
                }
            }
        }
    };
    Calc.prototype.sigma_estimate = function () {
        var i;
        if (this.n && this.S) {
            var x = 0, free = void 0;
            _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("・母分散σ^2の" + (this.sigma ? "検定" : "区間推定"), "headline");
            if (this.mu && this.sample) {
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("Z = (1/σ^2)*Σ(sample_i - μ)^2が自由度nのχ^2分布に従う。");
                for (i = 0; i < this.n; i++)
                    x += Math.pow(this.mu - this.sample[i], 2) / this.n;
                free = this.n;
            }
            else {
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("Z = nS^2/σ^2が自由度n-1のχ^2分布に従う。");
                x = this.n * this.S2;
                free = this.n - 1;
            }
            var v1 = Object(_value__WEBPACK_IMPORTED_MODULE_0__["Kai"])(this.percent / 2, free), v2 = Object(_value__WEBPACK_IMPORTED_MODULE_0__["Kai"])(1 - this.percent / 2, free);
            if (v1 == _value__WEBPACK_IMPORTED_MODULE_0__["Error"] || v2 == _value__WEBPACK_IMPORTED_MODULE_0__["Error"])
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print("数値は表に乗っていませんでした。", "error");
            else {
                _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(this.Round(v2) + " < Z < " + this.Round(v1));
                this.conclusion("σ^2", this.Round(x / v1), this.Round(x / v2), this.sigma2);
            }
        }
    };
    Calc.prototype.Round = function (v) {
        var k = Math.pow(10, this.decimal_place);
        return Math.round(v * k) / k;
    };
    Calc.prototype.conclusion = function (param_name, l, r, v) {
        var str = "";
        if (l)
            str += l + " < ";
        str += param_name;
        if (r)
            str += " < " + r;
        var flag = (!l || l && l < v) && (!r || r && v < r);
        if (v)
            str += flag ? "(信頼区間内)" : "(信頼区間外)";
        _common_output__WEBPACK_IMPORTED_MODULE_1__["Output"].print(str, flag ? "normal" : "error");
    };
    return Calc;
}());



/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _calc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./calc */ "./src/calc.ts");
/* harmony import */ var _Cross__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Cross */ "./src/Cross.ts");
/* harmony import */ var _common_output__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/output */ "../common/output.ts");



var input = document.createElement("input");
var reader = new FileReader();
var changeFile = function (ev) {
    var file = ev.target.files[0];
    var type = file.type;
    var size = file.size;
    input.value = '';
    if (type !== 'application/json') {
        alert('選択できるファイルはJSONファイルだけです。');
        return;
    }
    reader.readAsText(file);
};
var switch_inst = function (data) {
    _common_output__WEBPACK_IMPORTED_MODULE_2__["Output"].clear();
    if (data.cross) {
        var inst = new _Cross__WEBPACK_IMPORTED_MODULE_1__["Cross"](data);
    }
    else {
        var inst = new _calc__WEBPACK_IMPORTED_MODULE_0__["Calc"](data);
    }
};
var readFile = function () {
    if (typeof (reader.result) !== "string")
        return;
    var data = JSON.parse(reader.result);
    switch_inst(data);
};
var readForm = function () {
    var data = {}, temp;
    var form = document.form;
    var sample = form.form_sample.value;
    if (temp = form.form_n.value)
        data.n = parseFloat(temp);
    if (temp = form.form_mu.value)
        data.mu = parseFloat(temp);
    if (temp = form.form_sigma.value)
        data.sigma = parseFloat(temp);
    if (temp = form.form_sigma2.value)
        data.sigma2 = parseFloat(temp);
    if (temp = form.form_X.value)
        data.X = parseFloat(temp);
    if (temp = form.form_S.value)
        data.S = parseFloat(temp);
    if (temp = form.form_S2.value)
        data.S2 = parseFloat(temp);
    if (temp = form.form_decimal_place.value)
        data.decimal_place = parseFloat(temp);
    if (temp = form.form_percent.value)
        data.percent = parseFloat(temp);
    if (form.side.value == "two")
        data.two_side = true;
    if (sample) {
        var numbers = sample.split(",");
        data.sample = [];
        numbers.forEach(function (v) { return data.sample.push(parseFloat(v)); });
    }
    switch_inst(data);
};
input.type = "file";
input.hidden = true;
input.onchange = changeFile;
reader.onload = readFile;
var button = document.getElementById("readFilebutton");
if (button)
    button.onclick = function () { return input.click(); };
var button2 = document.getElementById("readFormbutton");
if (button2)
    button2.onclick = function () { return readForm(); };


/***/ }),

/***/ "./src/value.ts":
/*!**********************!*\
  !*** ./src/value.ts ***!
  \**********************/
/*! exports provided: Error, Phi, inv_Phi, Kai, T */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Error", function() { return Error; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Phi", function() { return Phi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inv_Phi", function() { return inv_Phi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Kai", function() { return Kai; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "T", function() { return T; });
var Error = -999;
function Phi(z) {
    var v = Math.abs(z * 100);
    var a = Math.floor(v);
    var r;
    if (a < phi.length - 1) {
        var rate = v - a;
        r = rate * phi[a + 1] + (1 - rate) * phi[a];
    }
    else
        r = 0;
    return z > 0 ? r : 1 - r;
}
function inv_Phi(p) {
    var flag = p > 0.5;
    if (flag)
        p = 1 - p;
    var i = binary_search(phi, p);
    if (i == phi.length)
        return Infinity;
    var w = phi[i - 1] - phi[i], x = p - phi[i];
    if (w == 0)
        return i / 100;
    return (flag ? -i + x / w : i - x / w) / 100;
}
function Kai(alpha, free) {
    var a = kai_alpha.indexOf(alpha), f = kai_free.indexOf(free);
    if (a == -1 || f == -1)
        return Error;
    return kai[f][a];
}
function T(alpha, free) {
    var a = t_alpha.indexOf(alpha), f = t_free.indexOf(free);
    if (a == -1 || f == -1)
        return Error;
    return t[f][a];
}
function binary_search(data, key) {
    var left = -1, right = data.length, mid;
    while (right - left > 1) {
        mid = Math.floor((left + right) / 2);
        //console.log("left:" + left + " right:" + right + " mid:" + mid + " data:" + data[mid])
        if (data[mid] < key)
            right = mid;
        else
            left = mid;
    }
    return right;
}
//正規分布　phi[i] = Φ(0.01 * i)
var phi = [
    0.5000000, 0.4960110, 0.4920220, 0.4880330, 0.4840470, 0.4800610, 0.4760780, 0.4720970, 0.4681190, 0.4641440,
    0.4601720, 0.4562050, 0.4522420, 0.4482830, 0.4443300, 0.4403820, 0.4364410, 0.4325050, 0.4285760, 0.4246550,
    0.4207400, 0.4168340, 0.4129360, 0.4090460, 0.4051650, 0.4012940, 0.3974320, 0.3935800, 0.3897390, 0.3859080,
    0.3820890, 0.3782810, 0.3744840, 0.3707000, 0.3669280, 0.3631690, 0.3594240, 0.3556910, 0.3519730, 0.3482680,
    0.3445780, 0.3409030, 0.3372430, 0.3335980, 0.3299690, 0.3263550, 0.3227580, 0.3191780, 0.3156140, 0.3120670,
    0.3085380, 0.3050260, 0.3015320, 0.2980560, 0.2945980, 0.2911600, 0.2877400, 0.2843390, 0.2809570, 0.2775950,
    0.2742530, 0.2709310, 0.2676290, 0.2643470, 0.2610860, 0.2578460, 0.2546270, 0.2514290, 0.2482520, 0.2450970,
    0.2419640, 0.2388520, 0.2357620, 0.2326950, 0.2296500, 0.2266270, 0.2236270, 0.2206500, 0.2176950, 0.2147640,
    0.2118550, 0.2089700, 0.2061080, 0.2032690, 0.2004540, 0.1976620, 0.1948940, 0.1921500, 0.1894300, 0.1867330,
    0.1840600, 0.1814110, 0.1787860, 0.1761860, 0.1736090, 0.1710560, 0.1685280, 0.1660230, 0.1635430, 0.1610870,
    0.1586550, 0.1562480, 0.1538640, 0.1515050, 0.1491700, 0.1468590, 0.1445720, 0.1423100, 0.1400710, 0.1378570,
    0.1356660, 0.1335000, 0.1313570, 0.1292380, 0.1271430, 0.1250720, 0.1230240, 0.1210010, 0.1190000, 0.1170230,
    0.1150700, 0.1131400, 0.1112330, 0.1093490, 0.1074880, 0.1056500, 0.1038350, 0.1020420, 0.1002730, 0.0985250,
    0.0968010, 0.0950980, 0.0934180, 0.0917590, 0.0901230, 0.0885080, 0.0869150, 0.0853440, 0.0837930, 0.0822640,
    0.0807570, 0.0792700, 0.0778040, 0.0763590, 0.0749340, 0.0735290, 0.0721450, 0.0707810, 0.0694370, 0.0681120,
    0.0668070, 0.0655220, 0.0642560, 0.0630080, 0.0617800, 0.0605710, 0.0593800, 0.0582080, 0.0570530, 0.0559170,
    0.0547990, 0.0536990, 0.0526160, 0.0515510, 0.0505030, 0.0494710, 0.0484570, 0.0474600, 0.0464790, 0.0455140,
    0.0445650, 0.0436330, 0.0427160, 0.0418150, 0.0409290, 0.0400590, 0.0392040, 0.0383640, 0.0375380, 0.0367270,
    0.0359300, 0.0351480, 0.0343790, 0.0336250, 0.0328840, 0.0321570, 0.0314430, 0.0307420, 0.0300540, 0.0293790,
    0.0287160, 0.0280670, 0.0274290, 0.0268030, 0.0261900, 0.0255880, 0.0249980, 0.0244190, 0.0238520, 0.0232950,
    0.0227500, 0.0222160, 0.0216920, 0.0211780, 0.0206750, 0.0201820, 0.0196990, 0.0192260, 0.0187630, 0.0183090,
    0.0178640, 0.0174290, 0.0170030, 0.0165860, 0.0161770, 0.0157780, 0.0153860, 0.0150030, 0.0146290, 0.0142620,
    0.0139030, 0.0135530, 0.0132090, 0.0128740, 0.0125450, 0.0122240, 0.0119110, 0.0116040, 0.0113040, 0.0110110,
    0.0107240, 0.0104440, 0.0101700, 0.0099030, 0.0096420, 0.0093870, 0.0091370, 0.0088940, 0.0086560, 0.0084240,
    0.0081980, 0.0079760, 0.0077600, 0.0075490, 0.0073440, 0.0071430, 0.0069470, 0.0067560, 0.0065690, 0.0063870,
    0.0062100, 0.0060370, 0.0058680, 0.0057030, 0.0055430, 0.0053860, 0.0052340, 0.0050850, 0.0049400, 0.0047990,
    0.0046610, 0.0045270, 0.0043970, 0.0042690, 0.0041450, 0.0040250, 0.0039070, 0.0037930, 0.0036810, 0.0035730,
    0.0034670, 0.0033640, 0.0032640, 0.0031670, 0.0030720, 0.0029800, 0.0028900, 0.0028030, 0.0027180, 0.0026350,
    0.0025550, 0.0024770, 0.0024010, 0.0023270, 0.0022560, 0.0021860, 0.0021180, 0.0020520, 0.0019880, 0.0019260,
    0.0018660, 0.0018070, 0.0017500, 0.0016950, 0.0016410, 0.0015890, 0.0015380, 0.0014890, 0.0014410, 0.0013950,
    0.0013500, 0.0013060, 0.0012640, 0.0012230, 0.0011830, 0.0011440, 0.0011070, 0.0010700, 0.0010350, 0.0010010,
    0.0009680, 0.0009360, 0.0009040, 0.0008740, 0.0008450, 0.0008160, 0.0007890, 0.0007620, 0.0007360, 0.0007110,
    0.0006870, 0.0006640, 0.0006410, 0.0006190, 0.0005980, 0.0005770, 0.0005570, 0.0005380, 0.0005190, 0.0005010,
    0.0004830, 0.0004670, 0.0004500, 0.0004340, 0.0004190, 0.0004040, 0.0003900, 0.0003760, 0.0003620, 0.0003500,
    0.0003370, 0.0003250, 0.0003130, 0.0003020, 0.0002910, 0.0002800, 0.0002700, 0.0002600, 0.0002510, 0.0002420,
    0.0002330, 0.0002240, 0.0002160, 0.0002080, 0.0002000, 0.0001930, 0.0001850, 0.0001790, 0.0001720, 0.0001650,
    0.0001590, 0.0001530, 0.0001470, 0.0001420, 0.0001360, 0.0001310, 0.0001260, 0.0001210, 0.0001170, 0.0001120,
    0.0001080, 0.0001040, 0.0000996, 0.0000958, 0.0000920, 0.0000884, 0.0000850, 0.0000816, 0.0000784, 0.0000753,
    0.0000724, 0.0000695, 0.0000667, 0.0000641, 0.0000615, 0.0000591, 0.0000567, 0.0000544, 0.0000522, 0.0000501,
    0.0000481, 0.0000462, 0.0000443, 0.0000425, 0.0000408, 0.0000391, 0.0000375, 0.0000360, 0.0000345, 0.0000331,
    0.0000317, 0.0000304, 0.0000291, 0.0000279, 0.0000267, 0.0000256, 0.0000245, 0.0000235, 0.0000225, 0.0000216,
    0.0000207, 0.0000198, 0.0000190, 0.0000181, 0.0000174, 0.0000166, 0.0000159, 0.0000152, 0.0000146, 0.0000140,
    0.0000134, 0.0000128, 0.0000122, 0.0000117, 0.0000112, 0.0000107, 0.0000102, 0.0000098, 0.0000094, 0.0000089,
    0.0000085, 0.0000082, 0.0000078, 0.0000075, 0.0000071, 0.0000068, 0.0000065, 0.0000062, 0.0000059, 0.0000057,
    0.0000054, 0.0000052, 0.0000049, 0.0000047, 0.0000045, 0.0000043, 0.0000041, 0.0000039, 0.0000037, 0.0000036,
    0.0000034, 0.0000032, 0.0000031, 0.0000030, 0.0000028, 0.0000027, 0.0000026, 0.0000024, 0.0000023, 0.0000022,
    0.0000021, 0.0000020, 0.0000019, 0.0000018, 0.0000017, 0.0000017, 0.0000016, 0.0000015, 0.0000014, 0.0000014,
    0.0000013, 0.0000012, 0.0000012, 0.0000011, 0.0000011, 0.0000010, 0.0000010, 0.0000009, 0.0000009, 0.0000008,
    0.0000008, 0.0000008, 0.0000007, 0.0000007, 0.0000007, 0.0000006, 0.0000006, 0.0000006, 0.0000005, 0.0000005,
    0.0000005, 0.0000005, 0.0000004, 0.0000004, 0.0000004, 0.0000004, 0.0000004, 0.0000003, 0.0000003, 0.0000003,
    0.0000003, 0.0000003, 0.0000003, 0.0000002, 0.0000002, 0.0000002, 0.0000002, 0.0000002, 0.0000002, 0.0000002
];
//χ^2分布表
//左から0.99, 0.975, 0.95, 0.05, 0.025, 0.01
//自由度は1~50へ連続、60, 70, 80, 90, 100
var kai_alpha = [0.99, 0.975, 0.95, 0.05, 0.025, 0.01];
var kai_free = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 60, 70, 80, 90, 100
];
var kai = [
    [0.00016, 0.00098, 0.0039, 3.840, 5.020, 6.630],
    [0.02010, 0.0506, 0.1026, 5.990, 7.380, 9.210],
    [0.1148, 0.2158, 0.352, 7.810, 9.350, 11.340],
    [0.2971, 0.484, 0.711, 9.490, 11.140, 13.280],
    [0.554, 0.831, 1.150, 11.070, 12.830, 15.090],
    [0.872, 1.240, 1.640, 12.590, 14.450, 16.810],
    [1.240, 1.690, 2.170, 14.070, 16.010, 18.480],
    [1.650, 2.180, 2.730, 15.510, 17.530, 20.090],
    [2.090, 2.700, 3.330, 16.920, 19.020, 21.670],
    [2.560, 3.250, 3.940, 18.310, 20.480, 23.210],
    [3.050, 3.820, 4.570, 19.680, 21.920, 24.720],
    [3.570, 4.400, 5.230, 21.030, 23.340, 26.220],
    [4.110, 5.010, 5.890, 22.360, 24.740, 27.690],
    [4.660, 5.630, 6.570, 23.680, 26.120, 29.140],
    [5.230, 6.260, 7.260, 25.000, 27.490, 30.580],
    [5.810, 6.910, 7.960, 26.300, 28.850, 32.000],
    [6.410, 7.560, 8.670, 27.590, 30.190, 33.410],
    [7.010, 8.230, 9.390, 28.870, 31.530, 34.810],
    [7.630, 8.910, 10.120, 30.140, 32.850, 36.190],
    [8.260, 9.590, 10.850, 31.410, 34.170, 37.570],
    [8.900, 10.280, 11.590, 32.670, 35.480, 38.930],
    [9.540, 10.980, 12.340, 33.920, 36.780, 40.290],
    [10.200, 11.690, 13.090, 35.170, 38.080, 41.640],
    [10.860, 12.400, 13.850, 36.420, 39.360, 42.980],
    [11.520, 13.120, 14.610, 37.650, 40.650, 44.310],
    [12.200, 13.840, 15.380, 38.890, 41.920, 45.640],
    [12.880, 14.570, 16.150, 40.110, 43.190, 46.960],
    [13.560, 15.310, 16.930, 41.340, 44.460, 48.280],
    [14.260, 16.050, 17.710, 42.560, 45.720, 49.590],
    [14.950, 16.790, 18.490, 43.770, 46.980, 50.890],
    [15.660, 17.540, 19.280, 44.990, 48.230, 52.190],
    [16.360, 18.290, 20.070, 46.190, 49.480, 53.490],
    [17.070, 19.050, 20.870, 47.400, 50.730, 54.780],
    [17.790, 19.810, 21.660, 48.600, 51.970, 56.060],
    [18.510, 20.570, 22.470, 49.800, 53.200, 57.340],
    [19.230, 21.340, 23.270, 51.000, 54.440, 58.620],
    [19.960, 22.110, 24.070, 52.190, 55.670, 59.890],
    [20.690, 22.880, 24.880, 53.380, 56.900, 61.160],
    [21.430, 23.650, 25.700, 54.570, 58.120, 62.430],
    [22.160, 24.430, 26.510, 55.760, 59.340, 63.690],
    [22.910, 25.210, 27.330, 56.940, 60.560, 64.950],
    [23.650, 26.000, 28.140, 58.120, 61.780, 66.210],
    [24.400, 26.790, 28.960, 59.300, 62.990, 67.460],
    [25.150, 27.570, 29.790, 60.480, 64.200, 68.710],
    [25.900, 28.370, 30.610, 61.660, 65.410, 69.960],
    [26.660, 29.160, 31.440, 62.830, 66.620, 71.200],
    [27.420, 29.960, 32.270, 64.000, 67.820, 72.440],
    [28.180, 30.750, 33.100, 65.170, 69.020, 73.680],
    [28.940, 31.550, 33.930, 66.340, 70.220, 74.920],
    [29.710, 32.360, 34.760, 67.500, 71.420, 76.150],
    [37.480, 40.480, 43.190, 79.080, 83.300, 88.380],
    [45.440, 48.760, 51.740, 90.530, 95.020, 100.430],
    [53.540, 57.150, 60.390, 101.880, 106.630, 112.330],
    [61.750, 65.650, 69.130, 113.150, 118.140, 124.120],
    [70.060, 74.220, 77.930, 124.340, 129.560, 135.800]
];
//t分布
// 片側確率なので注意（両側検定5%なら0.025を使う）
//確率は左から 0.25, 0.1, 0.05, 0.025, 0.01, 0.005
//自由度は1から45まで連続、50, 60, 80, 120, ∞
var t_alpha = [0.25, 0.1, 0.05, 0.025, 0.01, 0.005];
var t_free = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 336, 37, 38, 39, 40, 41, 42, 43, 44, 45,
    50, 60, 80, 120
];
var t = [
    [1.000, 3.078, 6.314, 12.706, 31.821, 63.657],
    [0.816, 1.886, 2.920, 4.303, 6.965, 9.925],
    [0.765, 1.638, 2.353, 3.182, 4.541, 5.841],
    [0.741, 1.533, 2.132, 2.776, 3.747, 4.604],
    [0.727, 1.476, 2.015, 2.571, 3.365, 4.032],
    [0.718, 1.440, 1.943, 2.447, 3.143, 3.707],
    [0.711, 1.415, 1.895, 2.365, 2.998, 3.499],
    [0.706, 1.397, 1.860, 2.306, 2.896, 3.355],
    [0.703, 1.383, 1.833, 2.262, 2.821, 3.250],
    [0.700, 1.372, 1.812, 2.228, 2.764, 3.169],
    [0.697, 1.363, 1.796, 2.201, 2.718, 3.106],
    [0.695, 1.356, 1.782, 2.179, 2.681, 3.055],
    [0.694, 1.350, 1.771, 2.160, 2.650, 3.012],
    [0.692, 1.345, 1.761, 2.145, 2.624, 2.977],
    [0.691, 1.341, 1.753, 2.131, 2.602, 2.947],
    [0.690, 1.337, 1.746, 2.120, 2.583, 2.921],
    [0.689, 1.333, 1.740, 2.110, 2.567, 2.898],
    [0.688, 1.330, 1.734, 2.101, 2.552, 2.878],
    [0.688, 1.328, 1.729, 2.093, 2.539, 2.861],
    [0.687, 1.325, 1.725, 2.086, 2.528, 2.845],
    [0.686, 1.323, 1.721, 2.080, 2.518, 2.831],
    [0.686, 1.321, 1.717, 2.074, 2.508, 2.819],
    [0.685, 1.319, 1.714, 2.069, 2.500, 2.807],
    [0.685, 1.318, 1.711, 2.064, 2.492, 2.797],
    [0.684, 1.316, 1.708, 2.060, 2.485, 2.787],
    [0.684, 1.315, 1.706, 2.056, 2.479, 2.779],
    [0.684, 1.314, 1.703, 2.052, 2.473, 2.771],
    [0.683, 1.313, 1.701, 2.048, 2.467, 2.763],
    [0.683, 1.311, 1.699, 2.045, 2.462, 2.756],
    [0.683, 1.310, 1.697, 2.042, 2.457, 2.750],
    [0.682, 1.309, 1.696, 2.040, 2.453, 2.744],
    [0.682, 1.309, 1.694, 2.037, 2.449, 2.738],
    [0.682, 1.308, 1.692, 2.035, 2.445, 2.733],
    [0.682, 1.307, 1.691, 2.032, 2.441, 2.728],
    [0.682, 1.306, 1.690, 2.030, 2.438, 2.724],
    [0.681, 1.306, 1.688, 2.028, 2.434, 2.719],
    [0.681, 1.305, 1.687, 2.026, 2.431, 2.715],
    [0.681, 1.304, 1.686, 2.024, 2.429, 2.712],
    [0.681, 1.304, 1.685, 2.023, 2.426, 2.708],
    [0.681, 1.303, 1.684, 2.021, 2.423, 2.704],
    [0.681, 1.303, 1.683, 2.020, 2.421, 2.701],
    [0.680, 1.302, 1.682, 2.018, 2.418, 2.698],
    [0.680, 1.302, 1.681, 2.017, 2.416, 2.695],
    [0.680, 1.301, 1.680, 2.015, 2.414, 2.692],
    [0.680, 1.301, 1.679, 2.014, 2.412, 2.690],
    [0.679, 1.299, 1.676, 2.009, 2.403, 2.678],
    [0.679, 1.296, 1.671, 2.000, 2.390, 2.660],
    [0.678, 1.292, 1.664, 1.990, 2.374, 2.639],
    [0.677, 1.289, 1.658, 1.980, 2.358, 2.617],
    [0.674, 1.282, 1.645, 1.960, 2.326, 2.576]
];
/*
//付表作成用コード
#include<vector>
#include<iostream>
#include<string>
#include<stdio.h>
#include<stdlib.h>
#define rep(i,a,b) for(auto i=a;i<b;i++)
int main(void) {
    vector<double> v;
    double a;
    int i = 0;
    string s;
    while (1) {
        cin >> s;
        if (s.find("σ") != std::string::npos)continue;
        if (s.find("end") != std::string::npos)break;
        a = atof(s.c_str());
        int x = i % 7;
        i++;
        if (x == 0)continue;
        v.push_back(a);
    }
    int len = v.size();
    printf("len:%d\n", len);
    rep(i, 0, len) {
        if(i%6 == 0)printf("[");
        printf(i % 6 == 5 ? "%8.3f],\n" : "%8.3f,", v[i]);
    }
    return 0;
}
*/ 


/***/ })

/******/ });
//# sourceMappingURL=main.js.map