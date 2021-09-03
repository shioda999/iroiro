import { katex_option, katex_instance, is_PC, Global } from './global'
import { Paint } from './paint'

window.addEventListener('load', () => {
    let subject = "math"

    const form = document["form"]
    const katex_rule = getRuleBySelector('.katex')

    const canvas_parent = document.getElementById("canvas_parent")
    const text_form = document.getElementById("textform")
    const textarea: any = document.getElementById("textarea")
    const html_text = document.getElementById("text")
    const menu = document.getElementById("floating_menu")
    const range = menu.children["move"]
    const auto_update = menu.children["auto_update"]
    const font_size: any = document.getElementById("font_size")
    const subject_button: any = document.getElementById("subject_button")

    const paint = new Paint()
    setup()

    function setup() {
        set_button_option()
        auto_update.onclick = () => render_text()
        font_size.addEventListener('change', () => { change_fontsize(), render_text() })
        range.addEventListener('input', () => change_range())
        subject_button.onchange = function () {
            subject = subject_button.options[subject_button.selectedIndex].value
            render_text()
        }
        textarea.addEventListener("input", () => render_text())

        change_fontsize()
        change_range()
        form.text.value = "a+b+c"
        window.onresize = paint.onresize
        set_textarea_size()
        //set_keyEvent()
        canvas_parent.style.pointerEvents = "none"
        render_text()
        document.getElementById("loading-icon").remove()
    }
    function set_textarea_size() {
        const H = Math.min(document.documentElement.clientHeight, screen.availHeight) / 1.5
        if (is_PC) {
            textarea.rows = Math.floor((H - 70) / parseInt(textarea.style.fontSize))
            textarea.style.width = Math.floor(document.documentElement.clientWidth * (1 - parseInt(text_form.style.left) / 100 - 0.01) - 200) + "px"
        }
        else {
            textarea.style.fontSize = "20px"
            textarea.style.borderWidth = "2px"
            textarea.rows = Math.floor((H - 70) / parseInt(textarea.style.fontSize))
            textarea.style.width = Math.floor(document.documentElement.clientWidth * (1 - parseInt(text_form.style.left) / 100 - 0.01) - 10) + "px"
        }
    }
    /*function set_keyEvent() {
        document.addEventListener("keydown", event => {
            //console.log("down" + event.key)
            switch (event.key) {
                case "ArrowRight":
                    disp_mobile_img(mobile_canvas_img, ++mobile_img_x, mobile_img_y)
                    break
                case "ArrowLeft":
                    disp_mobile_img(mobile_canvas_img, --mobile_img_x, mobile_img_y)
                    break
                case "ArrowUp":
                    disp_mobile_img(mobile_canvas_img, mobile_img_x, --mobile_img_y)
                    break
                case "ArrowDown":
                    disp_mobile_img(mobile_canvas_img, mobile_img_x, ++mobile_img_y)
                    break
            }
        })
        document.addEventListener("keyup", event => {
            //console.log("up:" + event.key)
            switch (event.key) {
                case "Shift":
                    if (line_mode == "default") line_mode = "straight"
                    else if (line_mode == "straight") line_mode = "default"
                    break
                case "Backspace":
                    if (mobile_canvas) remove_mobile_canvas()
                    break
            }
        })
    }*/

    function set_button_option() {
        document.getElementById("button_clear").addEventListener("click", () => { if (window.confirm("本当にテキストを全て削除しますか？")) { form.text.value = ""; render_text() } })
        document.getElementById("button_cases").addEventListener("click", () => add_str("\n\\begin{cases}\n", "\n\\end{cases}"))
        document.getElementById("button_align").addEventListener("click", () => add_str("\n\\begin{aligned}\n", "\n\\end{aligned}", true))
        document.getElementById("button_hspace").addEventListener("click", () => add_str("\\hspace{3em} "))
        document.getElementById("button_frac").addEventListener("click", () => add_str("\\frac{a}{b}"))
        document.getElementById("button_dfrac").addEventListener("click", () => add_str("\\dfrac{a}{b}"))
        document.getElementById("button_mathrm").addEventListener("click", () => add_str("\\mathrm{", "}"))
        document.getElementById("button_rightarrow").addEventListener("click", () => add_str("\\rightarrow "))
        document.getElementById("syntax_checker").addEventListener("click", () => syntax_check())

        document.getElementById("text_mode").addEventListener("click", () => change_text_mode())
        document.getElementById("paint_mode").addEventListener("click", () => change_paint_mode())
    }
    function add_str(str1, str2 = "", flag = false) {
        let pos = form.text.selectionStart
        let pos2 = form.text.selectionEnd
        let pre = form.text.value.slice(0, pos)
        let middle = form.text.value.slice(pos, pos2)
        let after = form.text.value.slice(pos2)
        if (flag) middle = middle.replace(/(^|[^&])=/g, '$1&=')
        pre += str1
        middle += str2
        form.text.value = pre + middle + after
        form.text.focus()
        form.text.selectionEnd = form.text.selectionStart = pre.length + middle.length
        render_text()
    }
    function syntax_check() {
        let html, ok = true
        try {
            html = katex_instance.renderToString(form.text.value, katex_option)
        }
        catch (error) {
            alert(error.message)
            ok = false
            const list = error.message.split(':')
            if (list[0] === "KaTeX parse error") {
                const list2 = list[2].split(' ')
                const len = list2[1].length
                const pos = parseInt(list2[4], 10)
                form.text.focus()
                form.text.selectionStart = pos - 1
                form.text.selectionEnd = pos + len
            }
        }
        if (ok) alert("構文エラーはありませんでした。")
    }
    function render_text() {
        let text = henkan2(form.text.value)
        let html, ok = true
        try {
            html = katex_instance.renderToString(text, katex_option) + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
        }
        catch (error) {
            ok = false
        }
        if (ok) {
            html_text.innerHTML = html
        }
    }
    function change_text_mode() {
        if (Global.mode == "text") return
        Global.mode = "text"
        menu.style.bottom = "0px"
        change_range()
        text_form.style.transition = "1s"
        canvas_parent.style.pointerEvents = "none"
        render_text()
    }
    function change_paint_mode() {
        if (Global.mode == "paint") return
        Global.mode = "paint"
        menu.style.bottom = "-50px"
        text_form.style.transition = "1s"
        text_form.style.left = "100%"
        canvas_parent.style.pointerEvents = "auto"
    }
    function change_fontsize() {
        katex_rule.style.cssText = "font-size : " + font_size.value + "em"
    }
    function henkan2(str) {
        switch (subject) {
            case "math":
                str = str.replace(/ /g, '\\hspace{0.5em}')
                str = str.replace(/\*/g, '\\times ')
                str = str.replace(/\//g, '\\div ')
                str = str.replace(/\\begin{([^}]+)}\n/g, '\\begin{$1}')
                str = str.replace(/\.\n/g, '')
                str = str.replace(/\n/g, '\\ \\\\\n')
                str = str.replace(/>=/g, '\\geqq')
                str = str.replace(/<=/g, '\\leqq')
                str = str.replace(/\\vec2/g, '\\overrightarrow')
                break
            case "english":
                str = str.replace(/([^\n]+)/g, '\\text{$1}')
                str = str.replace(/\n/g, '\\ \\\\\n')
                break
            case "chemistry":
                str = str.replace(/ /g, '\\hspace{0.5em}')
                str = str.replace(/([^\n]+)/g, '\\mathrm{$1}')
                str = str.replace(/\n/g, '\\ \\\\\n')
                break
        }
        return str
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
        text_form.style.transition = "0s"
        text_form.style.left = left + "%"
    }
});
