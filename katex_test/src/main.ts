import { Output } from '../../common/output'
//console.warn = (e) => { }

const form = document["form"]
const text_form = getRuleBySelector('.textform')
const katex_rule = getRuleBySelector('.katex')

const menu = document.getElementById("floating_menu")
const range = menu.children["move"]
const auto_update: any = menu.children["auto_update"]
const font_size = menu.children["font_size"]

setTimeout(() => setup(), 200)

function setup() {
    auto_update.onclick = () => onclick()
    font_size.addEventListener('change', () => { change_fontsize(), onclick() })
    range.addEventListener('input', () => change_range())

    change_fontsize()
    form.onkeyup = () => {
        let pos = form.text.selectionStart
        let len = form.text.value.length
        change_fontsize()
        form.text.value = henkan(form.text.value)
        if (form.text.value.length != len) pos++
        form.text.selectionEnd = form.text.selectionStart = pos
        if (auto_update.checked) onclick()
    }
    form.text.value = "a+b+c"
    onclick()
}

function onclick() {
    Output.clear()
    let text = henkan2(form.text.value)
    Output.print("$" + text + "\\ \\\\\n \\ \\\\\n$")
    Output.renderKaTeX()
}
function change_fontsize() {
    katex_rule.style.cssText = "font-size : " + font_size.value + "em"
}
function henkan(str) {
    str = str.replace(/_([^{]|$)/g, '_{}$1')
    str = str.replace(/\^([^{]|$)/g, '^{}$1')
    str = str.replace(/([^\\])sum/g, '$1\\sum')
    str = str.replace(/([^\\|d])frac/g, '$1\\frac{}{}')
    str = str.replace(/([^\\])dfrac/g, '$1\\dfrac{}{}')
    str = str.replace(/([^\\])int/g, '$1\\int')
    str = str.replace(/([^\\])infty/g, '$1\\infty')
    str = str.replace(/([^\\])iint/g, '$1\\iint')
    str = str.replace(/([^\\])oint/g, '$1\\oint')
    str = str.replace(/([^\\])sin/g, '$1\\sin')
    str = str.replace(/([^\\])cos/g, '$1\\cos')
    str = str.replace(/([^\\])tan/g, '$1\\tan')
    str = str.replace(/([^\\])log/g, '$1\\log')
    str = str.replace(/([^\\])lim/g, '$1\\lim')
    str = str.replace(/([^\\])prod/g, '$1\\prod')
    str = str.replace(/([^\\])vec/g, '$1\\vec{}')
    str = str.replace(/([^\\])alpha/g, '$1\\alpha')
    str = str.replace(/([^\\])beta/g, '$1\\beta')
    str = str.replace(/([^\\])gamma/g, '$1\\gamma')
    str = str.replace(/([^\\])pi/g, '$1\\pi')
    str = str.replace(/([^\\])theta/g, '$1\\theta')
    str = str.replace(/([^\\])cdot/g, '$1\\cdot')
    str = str.replace(/([^\\])left\(/g, '$1\\left\(\\right\)')
    str = str.replace(/([^\\])left\[/g, '$1\\left\[\\right\]')
    str = str.replace(/([^{])case/g, '$1\\begin{cases}\n\n\\end{cases}')
    str = str.replace(/([^{])align/g, '$1\\begin{aligned}\n\n\\end{aligned}')
    return str;
}
function henkan2(str) {
    str = str.replace(/\\$/, '')
    str = str.replace(/{cases}\n/g, '{cases}')
    str = str.replace(/{aligned}\n/g, '{aligned}')
    str = str.replace(/\.\n/g, '')
    str = str.replace(/\n/g, '\\ \\\\\n')
    str = str.replace(/>=/g, '\\geqq')
    str = str.replace(/<=/g, '\\leqq')
    str = str.replace(/\\vec2/g, '\\overrightarrow')
    return str;
}
function getRuleBySelector(sele) {
    var i, j, sheets, rules, rule = null;

    // stylesheetのリストを取得
    sheets = document.styleSheets;
    for (i = 0; i < sheets.length; i++) {
        // そのstylesheetが持つCSSルールのリストを取得
        rules = sheets[i].cssRules;
        for (j = 0; j < rules.length; j++) {
            // セレクタが一致するか調べる
            if (sele === rules[j].selectorText) {
                rule = rules[j];
                break;
            }
        }
    }
    return rule;
}
function change_range() {
    let v = parseInt(range.value) / 100
    let left = 30 * (1 - v) + 80 * v
    text_form.style.cssText = "\
    position: fixed;\
    top: 20px;\
    left: " + left + "%;\
    width: 50%;\
    height: 80%;\
";
}