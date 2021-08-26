import html2canvas from 'html2canvas'

window.addEventListener('load', () => {
    let cur_canvas, cur_context, canvas_list = [], canvas_history = [], history_id = 0, line_thickness = 5, line_color = "black"
    let mode: "text" | "paint" = "text"
    let line_mode = "default"
    const form = document["form"]
    const text_form = getRuleBySelector('.textform')
    const katex_rule = getRuleBySelector('.katex')

    const group = document.getElementById("draw_canvas")
    const text_area = document.getElementById("text")
    const menu = document.getElementById("floating_menu")
    const range = menu.children["move"]
    const thickness: any = document.getElementById("thickness")
    const thickness_label: any = document.getElementById("thickness_label")
    const auto_update = menu.children["auto_update"]
    const font_size = menu.children["font_size"]
    const colorcircle2 = document.getElementsByName("colorcircle")
    const line_mode_button = document.getElementById("line_mode_button")
    const sub_canvas: any = document.getElementById("sub_canvas")
    let sub_ctx = sub_canvas.getContext("2d")
    setup()

    function setup() {
        set_button_option()
        auto_update.onclick = () => onClick()
        font_size.addEventListener('change', () => { change_fontsize(), onClick() })
        range.addEventListener('input', () => change_range())
        thickness.addEventListener('input', () => change_thickness())
        colorcircle2.forEach((e) => {
            e.addEventListener('input', () => change_color(e.value))
        })
        line_mode_button.onchange = function () {
            line_mode = this.options[this.selectedIndex].value
        }

        thickness.value = 3
        change_fontsize()
        change_range()
        change_thickness()
        change_color("black")
        document.getElementById("button_menu").onclick = form.onkeyup = () => {
            let pos = form.text.selectionStart
            let len = form.text.value.length
            change_fontsize()
            if (form.text.value.length != len) pos++
            form.text.selectionEnd = form.text.selectionStart = pos
            if (auto_update.checked) onClick()
        }
        form.text.value = "a+b+c"
        window.onresize = () => { set_cur_canvas(); resize_sub_canvas(); }
        resize_sub_canvas()
        set_keyEvent()
        onClick()
    }

    function set_keyEvent() {
        document.addEventListener("keydown", event => {
            //console.log(event.key)
            if (event.key == "Shift") line_mode = "straight"
        })
        document.addEventListener("keyup", event => {
            //console.log(event.key)
            if (event.key == "Shift") line_mode = "default"
        })
    }

    function set_button_option() {
        document.getElementById("button_clear").addEventListener("click", () => { if (window.confirm("本当にテキストを全て削除しますか？")) { form.text.value = ""; onClick() } })
        document.getElementById("button_cases").addEventListener("click", () => add_str("\n\\begin{cases}\n", "\n\\end{cases}"))
        document.getElementById("button_align").addEventListener("click", () => add_str("\n\\begin{aligned}\n", "\n\\end{aligned}", true))
        document.getElementById("button_frac").addEventListener("click", () => add_str("\\frac{a}{b}"))
        document.getElementById("button_dfrac").addEventListener("click", () => add_str("\\dfrac{a}{b}"))
        document.getElementById("button_mathrm").addEventListener("click", () => add_str("\\mathrm{", "}"))
        document.getElementById("button_rightarrow").addEventListener("click", () => add_str("\\rightarrow "))
        document.getElementById("syntax_checker").addEventListener("click", () => syntax_check())

        document.getElementById("text_mode").addEventListener("click", () => text_modeClick())
        document.getElementById("paint_mode").addEventListener("click", () => paint_modeClick())
        document.getElementById("paint_undo").addEventListener("click", () => paint_undo())
        document.getElementById("paint_do").addEventListener("click", () => paint_do())
        document.getElementById("paint_clear").addEventListener("click", () => { if (window.confirm("本当にペイントを全て削除しますか？")) erase_all_canvas() })
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
        onClick()
    }
    function syntax_check() {
        let html, ok = true
        try {
            html = katex.renderToString(form.text.value, {})
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
    function onClick() {
        let text = henkan2(form.text.value)
        let html, ok = true
        try {
            html = katex.renderToString(text, {}) + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
        }
        catch (error) {
            ok = false
        }
        if (ok) {
            text_area.innerHTML = html
        }
    }
    function text_modeClick() {
        if (mode == "text") return
        mode = "text"
        document.getElementById("text_canvas").hidden = true
        group.hidden = true
        onClick()
    }
    function paint_modeClick() {
        if (mode == "paint") return
        mode = "paint"
        group.hidden = false
        window.scrollTo(0, 0);
        html2canvas(text_area, { scale: font_size.value / 2 }).then((canvas) => {
            {
                const x = text_area.getBoundingClientRect().left
                const y = text_area.getBoundingClientRect().top
                const prev_canvas = document.getElementById("text_canvas")
                if (prev_canvas) document.body.removeChild(prev_canvas)
                document.body.appendChild(canvas)
                canvas.setAttribute("style", "position: absolute;left:" + round(x) + "px;top:" + round(y) + "px;")
                canvas.setAttribute("id", "text_canvas")
                create_new_canvas()
                text_area.innerHTML = ""
            });
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
    function change_thickness() {
        const thick_table = [1, 2, 3, 5, 7, 9, 10, 20, 30, 50]
        line_thickness = thick_table[thickness.value - 1]
        thickness_label.innerHTML = "線の太さ：" + line_thickness
    }
    function change_color(color) {
        line_color = color
    }
    function erase_all_canvas() {
        set_canvases([])
        canvas_history.push(canvas_list.concat())
        history_id++
    }
    function erase_canvas(i) {
        group.removeChild(canvas_list[i])
        canvas_list.splice(i, 1)
        canvas_history.push(canvas_list.concat())
        history_id++
    }
    function set_canvases(new_a) {
        let rm = canvas_list.filter(i => new_a.indexOf(i) == -1)
        let ad = new_a.filter(i => canvas_list.indexOf(i) == -1)
        rm.forEach((e) => group.removeChild(e))
        ad.forEach((e) => group.appendChild(e))
        canvas_list = new_a.concat()
    }
    function paint_undo() {
        if (history_id <= 0) return
        set_canvases(canvas_history[history_id - 1])
        history_id--
    }
    function paint_do() {
        if (history_id >= canvas_history.length - 1) return
        set_canvases(canvas_history[history_id + 1])
        history_id++
    }
    function resize_sub_canvas() {
        sub_canvas.width = window.innerWidth;
        sub_canvas.height = window.innerHeight;
        sub_canvas.style.zIndex = 10;
        sub_canvas.style["pointer-events"] = "none"
        sub_ctx = sub_canvas.getContext("2d")
        sub_ctx.setLineDash([3, 3]);
        sub_ctx.lineCap = 'round'; // 丸みを帯びた線にする
        sub_ctx.lineJoin = 'round'; // 丸みを帯びた線にする
        sub_ctx.lineWidth = 1; // 線の太さ
        sub_ctx.strokeStyle = "black"; // 線の色
    }
    function set_cur_canvas() {
        cur_canvas = document.createElement("canvas")
        cur_canvas.classList.add("canvas");
        cur_canvas.width = window.innerWidth;
        cur_canvas.height = window.innerHeight;
        cur_canvas.style.zIndex = 1;
        cur_context = cur_canvas.getContext("2d")
        group.appendChild(cur_canvas)
        cur_canvas.addEventListener('pointerdown', dragStart);
        cur_canvas.addEventListener('pointerup', dragEnd);
        cur_canvas.addEventListener('pointerout', dragEnd);
        cur_canvas.addEventListener('pointermove', (event) => {
            draw(event.layerX, event.layerY);
        });
    }
    function create_new_canvas() {
        if (cur_canvas) {
            canvas_list.push(cur_canvas)
            history_id++
        }
        canvas_history.length = history_id + 1
        canvas_history[history_id] = canvas_list.concat()
        set_cur_canvas()
    }
    // 直前のマウスのcanvas上のx座標とy座標を記録する
    const lastPosition = { x: null, y: null };

    // マウスがドラッグされているか(クリックされたままか)判断するためのフラグ
    let isDrag = false;

    function erase(x, y) {
        if (!isDrag) {
            return;
        }
        const k = 2
        const dx = [0, k, 0, -k, 0], dy = [0, 0, k, 0, -k]
        for (let i = 0; i < canvas_list.length; i++) {
            const context = canvas_list[i].getContext("2d")
            for (let j = 0; j < 5; j++) {
                if (context.isPointInStroke(x + dx[j], y + dy[j])) {
                    erase_canvas([i])
                    break
                }
            }
        }
    }

    function round(v) {
        return Math.round(v / 20) * 20
    }
    // 絵を書く
    function draw(px, py) {
        let prev_x, prev_y, next_x, next_y
        if (!isDrag) {
            return;
        }
        if (line_color == "erase") {
            erase(px, py)
            return
        }
        if (lastPosition.x === null || lastPosition.y === null) {
            // ドラッグ開始時の線の開始位置
            cur_context.beginPath();
            lastPosition.x = px
            lastPosition.y = py
            cur_context.lineCap = 'round'; // 丸みを帯びた線にする
            cur_context.lineJoin = 'round'; // 丸みを帯びた線にする
            cur_context.lineWidth = line_thickness; // 線の太さ
            cur_context.strokeStyle = line_color; // 線の色
            cur_context.fillStyle = line_color; // 線の色
        }
        switch (line_mode) {
            case "default":
                cur_context.moveTo(lastPosition.x, lastPosition.y);
                cur_context.lineTo(px, py);
                cur_context.stroke();
                lastPosition.x = px;
                lastPosition.y = py;
                break
            case "straight":
                prev_x = round(lastPosition.x), prev_y = round(lastPosition.y)
                next_x = round(px), next_y = round(py)
                if (prev_x == next_x && prev_y == next_y) return
                cur_context.closePath();
                cur_context.clearRect(0, 0, cur_canvas.width, cur_canvas.height)
                cur_context.beginPath();
                cur_context.moveTo(prev_x, prev_y);
                cur_context.lineTo(next_x, next_y);
                cur_context.stroke();

                sub_ctx.clearRect(0, 0, sub_canvas.width, sub_canvas.height)
                if (prev_x == next_x || prev_y == next_y || Math.abs(prev_x - next_x) == Math.abs(prev_y - next_y)) {
                    const k = Math.max(sub_canvas.width, sub_canvas.height)
                    sub_ctx.beginPath();
                    sub_ctx.moveTo(next_x, next_y);
                    sub_ctx.lineTo((next_x - prev_x) * k + prev_x, (next_y - prev_y) * k + prev_y);
                    sub_ctx.stroke();
                    sub_ctx.closePath();
                }
                break
            case "rectangle":
            case "fill_rectangle":
                prev_x = round(lastPosition.x), prev_y = round(lastPosition.y)
                next_x = round(px), next_y = round(py)
                if (prev_x == next_x && prev_y == next_y) return
                cur_context.closePath();
                cur_context.clearRect(0, 0, cur_canvas.width, cur_canvas.height)
                cur_context.beginPath();
                if (line_mode == "rectangle") cur_context.strokeRect(prev_x, prev_y, next_x - prev_x, next_y - prev_y);
                if (line_mode == "fill_rectangle") cur_context.fillRect(prev_x, prev_y, next_x - prev_x, next_y - prev_y);
                break
            case "circle":
            case "fill_circle":
                prev_x = round(lastPosition.x), prev_y = round(lastPosition.y)
                next_x = round(px), next_y = round(py)
                if (prev_x == next_x && prev_y == next_y) return
                cur_context.closePath();
                cur_context.clearRect(0, 0, cur_canvas.width, cur_canvas.height)
                cur_context.beginPath();
                cur_context.arc(prev_x, prev_y, Math.sqrt((prev_x - next_x) * (prev_x - next_x) + (prev_y - next_y) * (prev_y - next_y)),
                    0, 2 * Math.PI, false)
                cur_context.stroke();
                if (line_mode == "fill_circle") cur_context.fill();
                break
        }
    }

    // マウスのドラッグを開始したらisDragのフラグをtrueにしてdraw関数内で
    // お絵かき処理が途中で止まらないようにする
    function dragStart(event) {
        isDrag = true;
        draw(event.layerX, event.layerY);
    }
    // マウスのドラッグが終了したら、もしくはマウスがcanvas外に移動したら
    // isDragのフラグをfalseにしてdraw関数内でお絵かき処理が中断されるようにする
    function dragEnd(event) {
        if (!cur_context) return
        // 線を書く処理の終了を宣言する
        cur_context.closePath();
        sub_ctx.clearRect(0, 0, sub_canvas.width, sub_canvas.height)

        // 描画中に記録していた値をリセットする
        lastPosition.x = null;
        lastPosition.y = null;
        if (isDrag && line_color != "erase") create_new_canvas()
        isDrag = false;
    }
});