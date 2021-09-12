import { Global, is_PC, katex_instance, katex_option } from "./global";

export class TextMode {
    private subject = "math"
    private katex_rule = this.getRuleBySelector('.katex')
    private form = document["form"]
    private html_text = document.getElementById("text")
    private text_form = document.getElementById("textform")
    private textarea: any = document.getElementById("textarea")
    private menu = document.getElementById("floating_menu")
    private range = this.menu.children["move"]
    private auto_update = this.menu.children["auto_update"]
    private font_size: any = document.getElementById("font_size")
    private subject_button: any = document.getElementById("subject_button")
    constructor() {
        this.form.text.value = "a+b+c"
        this.set_buttonEvents()
        this.set_floatingmenuEvents()
        this.change_fontsize()
        this.change_range()
        this.set_textarea_size()
        this.render_text()
    }
    private set_buttonEvents() {
        this.subject_button.onchange = () => {
            this.subject = this.subject_button.options[this.subject_button.selectedIndex].value
            this.render_text()
        }
        this.textarea.addEventListener("input", () => this.render_text())
        document.getElementById("button_clear").addEventListener("click", () => { if (window.confirm("本当にテキストを全て削除しますか？")) { this.form.text.value = ""; this.render_text() } })
        document.getElementById("button_cases").addEventListener("click", () => this.add_str("\n\\begin{cases}\n", "\n\\end{cases}"))
        document.getElementById("button_align").addEventListener("click", () => this.add_str("\n\\begin{aligned}\n", "\n\\end{aligned}", true))
        document.getElementById("button_hspace").addEventListener("click", () => this.add_str("\\hspace{3em} "))
        document.getElementById("button_frac").addEventListener("click", () => this.add_str("\\frac{a}{b}"))
        document.getElementById("button_dfrac").addEventListener("click", () => this.add_str("\\dfrac{a}{b}"))
        document.getElementById("button_mathrm").addEventListener("click", () => this.add_str("\\mathrm{", "}"))
        document.getElementById("button_rightarrow").addEventListener("click", () => this.add_str("\\rightarrow "))
        document.getElementById("syntax_checker").addEventListener("click", () => this.syntax_check())
        window.addEventListener("my_event_render_text", () => this.render_text())
    }
    private set_floatingmenuEvents() {
        this.auto_update.onclick = () => this.render_text()
        this.font_size.addEventListener('change', () => { this.change_fontsize(), this.render_text() })
        this.range.addEventListener('input', () => this.change_range())
    }
    private set_textarea_size() {
        const H = Math.min(document.documentElement.clientHeight, screen.availHeight) / 1.5
        const textarea = this.textarea
        const rate = 1 - parseInt(this.text_form.style.left) / 100 - 0.01
        if (is_PC) {
            textarea.rows = Math.floor((H - 70) / parseInt(textarea.style.fontSize))
            textarea.style.width = Math.floor(document.documentElement.clientWidth * rate - 200) + "px"
        }
        else {
            textarea.style.fontSize = "20px"
            textarea.style.borderWidth = "2px"
            textarea.rows = Math.floor((H - 70) / parseInt(textarea.style.fontSize))
            textarea.style.width = Math.floor(document.documentElement.clientWidth * rate - 10) + "px"
        }
    }
    private add_str(str1, str2 = "", flag = false) {
        const form = this.form
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
        this.render_text()
    }
    private syntax_check() {
        let html, ok = true
        const form = this.form
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
    public change_mode() {
        if (Global.mode == "text") {
            this.menu.style.bottom = "0px"
            this.change_range()
            this.text_form.style.transition = "1s"
            this.render_text()
        }
        else {
            this.menu.style.bottom = "-50px"
            this.text_form.style.transition = "1s"
            this.text_form.style.left = "100%"
        }
    }
    private change_range() {
        let v = parseInt(this.range.value) / 100
        let left = 30 * (1 - v) + 80 * v
        this.text_form.style.transition = "0s"
        this.text_form.style.left = left + "%"
    }
    private change_fontsize() {
        this.katex_rule.style.cssText = "font-size : " + this.font_size.value + "em"
    }
    private render_text() {
        if (!this.auto_update.checked) return
        let text = this.henkan2(this.form.text.value)
        let html, ok = true
        try {
            html = katex_instance.renderToString(text, katex_option) + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
        }
        catch (error) {
            ok = false
        }
        if (ok) {
            this.html_text.innerHTML = html
        }
    }
    private henkan2(str) {
        switch (this.subject) {
            case "math":
                str = str.replace(/(\\\w*) /g, '$1\\___temp')
                str = str.replace(/ /g, '\\hspace{0.5em}')
                str = str.replace(/\\___temp/g, ' ')
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
                str = str.replace(/(\\\w*) /g, '$1\\___temp')
                str = str.replace(/ /g, '\\hspace{0.5em}')
                str = str.replace(/\\___temp/g, ' ')
                str = str.replace(/([^\n]+)/g, '\\mathrm{$1}')
                str = str.replace(/\n/g, '\\ \\\\\n')
                break
        }
        return str
    }
    private getRuleBySelector(sele) {
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
}