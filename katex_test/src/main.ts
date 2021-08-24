import { Output } from '../../common/output'

let form, text_form, katex_rule, menu, range, auto_update, font_size, error_cnt = 0
let text_temp = ""
setTimeout(() => setup(), 200)

function setup() {
    console.log("setup")
    form = document["form"]
    text_form = getRuleBySelector('.textform')
    katex_rule = getRuleBySelector('.katex')

    menu = document.getElementById("floating_menu")
    range = menu.children["move"]
    auto_update = menu.children["auto_update"]
    font_size = menu.children["font_size"]
    if (text_form == null || katex_rule == null) {
        console.log("error")
        setTimeout(() => setup(), 200)
        if (error_cnt == 10) alert("error ページをリロードしてください。")
        error_cnt++
        return
    }

    set_button_option()
    auto_update.onclick = () => onclick()
    font_size.addEventListener('change', () => { change_fontsize(), onclick() })
    range.addEventListener('input', () => change_range())

    change_fontsize()
    document.getElementById("button_menu").onclick = form.onkeyup = () => {
        let pos = form.text.selectionStart
        let len = form.text.value.length
        change_fontsize()
        if (form.text.value.length != len) pos++
        form.text.selectionEnd = form.text.selectionStart = pos
        if (auto_update.checked) onclick()
    }
    form.text.value = "a+b+c"
    onclick()
}

function set_button_option() {
    document.getElementById("button_clear").onclick = () => { if (window.confirm("本当にテキストを全て削除しますか？")) form.text.value = "" }
    document.getElementById("button_cases").onclick = () => add_str("\n\\begin{cases}\n", "\n\\end{cases}")
    document.getElementById("button_align").onclick = () => add_str("\n\\begin{aligned}\n", "\n\\end{aligned}", true)
    document.getElementById("button_frac").onclick = () => add_str("\\frac{a}{b}")
    document.getElementById("button_dfrac").onclick = () => add_str("\\dfrac{a}{b}")
}
function add_str(str1, str2 = "", flag = false) {
    let pos = form.text.selectionStart
    let pos2 = form.text.selectionEnd
    let pre = form.text.value.slice(0, pos)
    let middle = form.text.value.slice(pos, pos2)
    let after = form.text.value.slice(pos2)
    middle = middle.replace(/=/g, '&=')
    pre += str1
    middle += str2
    form.text.value = pre + middle + after
    form.text.focus()
    form.text.selectionEnd = form.text.selectionStart = pre.length + middle.length
}
function onclick() {
    let text = henkan2(form.text.value)
    let flag = false
    try {
        katex.render(text, document.getElementById("text"), {});
    }
    catch (error) {
        flag = true
        katex.render(text_temp, document.getElementById("text"), {});
    }
    if (!flag) text_temp = text
}
function change_fontsize() {
    katex_rule.style.cssText = "font-size : " + font_size.value + "em"
}
function henkan2(str) {
    str = str.replace(/\\$/, '')
    str = str.replace(/\*/g, '\\times ')
    str = str.replace(/\//g, '\\div ')
    str = str.replace(/\\begin{cases}\n/g, '\\begin{cases}')
    str = str.replace(/\\begin{aligned}\n/g, '\\begin{aligned}')
    str = str.replace(/\\begin{matrix}\n/g, '\\left\(\\begin{array}{}')
    str = str.replace(/\\end{matrix}/g, '\\end{array}\\right\)')
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