import { RGBColor } from './rgbcolor'
import html2canvas from 'html2canvas'

const GRID_W = 20

window.addEventListener('load', () => {
    let cur_canvas, cur_context, canvas_list = [], canvas_history = [[]], history_id = 0, canvas_written = false
    let line_thickness = 5, line_color = "black", base_color = "black", line_bright = 1, line_alpha = 1
    let mode: "text" | "paint" = "text"
    let line_mode = "default", grid_mode = "no-grid"
    let mobile_canvas, mobile_ctx, mobile_canvas_ope, mobile_canvas_img, prev_img_w, mobile_img_x, mobile_img_y

    const reader = new FileReader()
    const form = document["form"]
    const katex_rule = getRuleBySelector('.katex')

    const text_form = document.getElementById("textform")
    const group = document.getElementById("draw_canvas")
    const text_area = document.getElementById("text")
    const menu = document.getElementById("floating_menu")
    const range = menu.children["move"]
    const thickness: any = document.getElementById("thickness")
    const thickness_label: any = document.getElementById("thickness_label")
    const bright: any = document.getElementById("bright")
    const bright_label: any = document.getElementById("bright_label")
    const auto_update = menu.children["auto_update"]
    const font_size = menu.children["font_size"]
    const colorcircle2 = document.getElementsByName("colorcircle")
    const line_mode_button: any = document.getElementById("line_mode_button")
    const grid_mode_button: any = document.getElementById("grid_mode_button")
    const sub_canvas: any = document.getElementById("sub_canvas")
    const upload_form: any = document.getElementById("upload_button")
    const is_PC = !isSmartPhone()
    let sub_ctx = sub_canvas.getContext("2d")
    setup()

    function setup() {
        set_button_option()
        auto_update.onclick = () => onClick()
        font_size.addEventListener('change', () => { change_fontsize(), onClick() })
        range.addEventListener('input', () => change_range())
        thickness.addEventListener('input', () => change_thickness())
        bright.addEventListener('input', () => change_bright())
        colorcircle2.forEach((e: any) => {
            e.addEventListener('input', () => change_color(e.value))
        })
        line_mode_button.onchange = function () {
            line_mode = line_mode_button.options[line_mode_button.selectedIndex].value
        }
        grid_mode_button.onchange = function () {
            grid_mode = grid_mode_button.options[grid_mode_button.selectedIndex].value
            draw_grid()
        }
        upload_form.onchange = function () {
            if (upload_form.files[0]) reader.readAsDataURL(upload_form.files[0])
        }
        reader.onload = () => {
            load_img_from_url(reader.result)
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
        set_textarea_size()
        set_keyEvent()
        set_cur_canvas()
        group.style.pointerEvents = "none"
        onClick()
    }
    function set_textarea_size() {
        const textarea: any = document.getElementById("textarea")
        if (is_PC) {
            textarea.rows = Math.floor(document.documentElement.clientHeight - 70)
            textarea.style.width = Math.floor(document.documentElement.clientWidth * (1 - parseInt(text_form.style.left) / 100 - 0.01) - 200) + "px"
        }
        else {
            textarea.style.fontSize = "30px"
            textarea.style.borderWidth = "2px"
            textarea.rows = Math.floor(document.documentElement.clientHeight - 70)
            textarea.style.width = Math.floor(document.documentElement.clientWidth * (1 - parseInt(text_form.style.left) / 100 - 0.01) - 10) + "px"
        }
    }
    function set_keyEvent() {
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
    }

    function set_button_option() {
        document.getElementById("button_clear").addEventListener("click", () => { if (window.confirm("本当にテキストを全て削除しますか？")) { form.text.value = ""; onClick() } })
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
        document.getElementById("paint_chara").addEventListener("click", () => paint_chara())
        document.getElementById("paint_upload").addEventListener("click", () => paint_upload())
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
    function load_img_from_url(url) {
        const img = new Image()
        img.src = url
        img.onload = () => create_mobile_canvas(img, 300)
    }
    function create_mobile_canvas(img, width) {
        if (mobile_canvas) transfer_mobile_canvase_to_cur_canvas()
        let canvas = document.createElement("canvas")
        canvas.classList.add("canvas");
        canvas.width = document.documentElement.scrollWidth - 30
        canvas.height = document.documentElement.scrollHeight
        canvas.style.zIndex = "1";
        let context = canvas.getContext("2d")

        group.appendChild(canvas)
        set_pointer_evens(canvas)
        context.setLineDash([3, 3]);
        context.lineCap = 'round'; // 丸みを帯びた線にする
        context.lineJoin = 'round'; // 丸みを帯びた線にする
        context.lineWidth = 1; // 線の太さ
        context.strokeStyle = "black"; // 線の色
        mobile_canvas = canvas
        mobile_ctx = context
        mobile_canvas_img = img
        prev_img_w = width

        let scale = prev_img_w / img.width
        disp_mobile_img(img, mobile_img_x = 0, mobile_img_y = 0, scale)
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
    function change_text_mode() {
        if (mode == "text") return
        mode = "text"
        menu.style.bottom = "0px"
        change_range()
        text_form.style.transition = "1s"
        group.style.pointerEvents = "none"
        onClick()
    }
    function change_paint_mode() {
        if (mode == "paint") return
        mode = "paint"
        menu.style.bottom = "-50px"
        text_form.style.transition = "1s"
        text_form.style.left = "100%"
        group.style.pointerEvents = "auto"
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
        text_form.style.transition = "0s"
        text_form.style.left = left + "%"
    }
    function change_thickness() {
        const thick_table = [1, 2, 3, 5, 7, 9, 10, 20, 30, 50]
        line_thickness = thick_table[thickness.value - 1]
        thickness_label.innerHTML = "線の太さ：" + line_thickness
    }
    function change_bright() {
        line_bright = bright.value / 10
        bright_label.innerHTML = "明度：" + line_bright
        update_linecolor()
    }
    function change_color(color) {
        base_color = color
        update_linecolor()
    }
    function toHex(val) {
        val = Math.round(val)
        return ("0" + val.toString(16)).slice(-2)
    }
    function calc_color(val, k) {
        if (k <= 1) return Math.round(val * k)
        else return Math.round(255 * (k - 1) + val * (2 - k))
    }
    function update_linecolor() {
        if (base_color == "erase") {
            line_color = "erase"
            return
        }
        let c = RGBColor(base_color)
        c[0] = calc_color(c[0], line_bright)
        c[1] = calc_color(c[1], line_bright)
        c[2] = calc_color(c[2], line_bright)
        line_color = "#" + toHex(c[0]) + toHex(c[1]) + toHex(c[2]) + toHex(255)
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
    function paint_chara() {
        const ret = window.prompt("表示したい文字を入力してください。")
        if (ret == "" || ret == null) return
        let html
        try {
            html = katex.renderToString(ret)
        }
        catch (error) {
            alert(error.message)
            return
        }
        const element = document.createElement("div")
        element.innerHTML = html
        group.appendChild(element)
        html2canvas(element, { scale: font_size.value / 2 * window.devicePixelRatio }).then((canvas) => {
            const ctx = canvas.getContext("2d")
            const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const W = img.width
            const H = img.height
            for (let i = 0; i < W * H; i++) {
                let v = Math.floor((img.data[4 * i] + img.data[4 * i + 1] + img.data[4 * i + 2]) / 3)
                img.data[4 * i + 3] = Math.min((Math.round(255 - v) * 1.5), 255)
            }
            ctx.putImageData(img, 0, 0)
            create_mobile_canvas(canvas, canvas.width / window.devicePixelRatio)
            group.removeChild(element)
        })
    }
    function paint_upload() {
        upload_form.click()
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
        sub_canvas.width = document.documentElement.scrollWidth - 30;
        sub_canvas.height = document.documentElement.scrollHeight;
        sub_canvas.style["pointer-events"] = "none"
        sub_ctx = sub_canvas.getContext("2d")
        draw_grid()
    }
    function set_cur_canvas() {
        cur_canvas = document.createElement("canvas")
        cur_canvas.classList.add("canvas");
        cur_canvas.width = document.documentElement.scrollWidth - 30;
        cur_canvas.height = document.documentElement.scrollHeight;
        cur_canvas.style.zIndex = 1;
        cur_context = cur_canvas.getContext("2d")
        group.appendChild(cur_canvas)
        set_pointer_evens(cur_canvas)
    }
    function set_pointer_evens(element) {
        if (is_PC) {
            element.addEventListener('mousedown', mouse_dragStart, false);
            element.addEventListener('mouseup', mouse_dragEnd, false);
            element.addEventListener('mouseout', mouse_dragEnd, false);
            element.addEventListener('mousemove', mouse_dragging, false);
        }
        else {
            element.addEventListener('touchstart', touch_start, false);
            element.addEventListener('touchend', touch_end, false);
            element.addEventListener('touchmove', touch_move, false)
        }
    }
    function mouse_dragStart(event) {
        const px = event.layerX, py = event.layerY
        if (mobile_canvas) mobile_canvas_dragStart(px, py)
        else dragStart(px, py)
    }
    function mouse_dragEnd(event) {
        const px = event.layerX, py = event.layerY
        if (mobile_canvas) mobile_canvas_dragEnd(px, py)
        else dragEnd(px, py)
    }
    function mouse_dragging(event) {
        const px = event.layerX, py = event.layerY
        if (mobile_canvas) mobile_canvas_move(px, py)
        else dragmove(px, py)
    }
    function touch_start(event) {
        const px = event.changedTouches[0].pageX, py = event.changedTouches[0].pageY
        if (mobile_canvas) mobile_canvas_dragStart(px, py)
        else dragStart(px, py)
    }
    function touch_end(event) {
        const px = event.changedTouches[0].pageX, py = event.changedTouches[0].pageY
        if (mobile_canvas) mobile_canvas_dragEnd(px, py)
        else dragEnd(px, py)
    }
    function touch_move(event) {
        event.preventDefault();
        const px = event.changedTouches[0].pageX, py = event.changedTouches[0].pageY
        if (mobile_canvas) mobile_canvas_move(px, py)
        else dragmove(px, py)
    }
    function create_new_canvas() {
        if (!canvas_written) return
        canvas_list.push(cur_canvas)
        history_id++
        canvas_written = false
        canvas_history.length = history_id + 1
        canvas_history[history_id] = canvas_list.concat()
        set_cur_canvas()
    }
    function draw_grid() {
        sub_ctx.clearRect(0, 0, sub_canvas.width, sub_canvas.height)
        sub_ctx.beginPath()
        sub_ctx.lineCap = 'butt'; // 丸みを帯びた線にする
        sub_ctx.lineJoin = 'butt'; // 丸みを帯びた線にする
        sub_canvas.zIndex = -1
        switch (grid_mode) {
            case "no-grid":
                sub_ctx.setLineDash([3, 3]);
                sub_ctx.lineWidth = 1; // 線の太さ
                sub_ctx.strokeStyle = "black"; // 線の色
                sub_canvas.zIndex = 10
                break
            case "grid":
                sub_ctx.setLineDash([]);
                sub_ctx.lineWidth = 3; // 線の太さ
                sub_ctx.strokeStyle = "#cccccc"; // 線の色
                for (let x = 0; x <= sub_canvas.width; x += GRID_W * 5) {
                    sub_ctx.moveTo(x, 0)
                    sub_ctx.lineTo(x, sub_canvas.height)
                }
                for (let y = 0; y <= sub_canvas.height; y += GRID_W * 5) {
                    sub_ctx.moveTo(0, y)
                    sub_ctx.lineTo(sub_canvas.width, y)
                }
                sub_ctx.stroke()
                sub_ctx.beginPath()
                sub_ctx.lineWidth = 1; // 線の太さ
                for (let x = 0; x <= sub_canvas.width; x += GRID_W) {
                    if (x % (GRID_W * 5) == 0) continue
                    sub_ctx.moveTo(x, 0)
                    sub_ctx.lineTo(x, sub_canvas.height)
                }
                for (let y = 0; y <= sub_canvas.height; y += GRID_W) {
                    if (y % (GRID_W * 5) == 0) continue
                    sub_ctx.moveTo(0, y)
                    sub_ctx.lineTo(sub_canvas.width, y)
                }
                break
            case "dotted-grid":
                sub_ctx.setLineDash([]);
                sub_ctx.lineWidth = 1; // 線の太さ
                sub_ctx.strokeStyle = "gray"; // 線の色
                for (let x = 0; x <= sub_canvas.width; x += GRID_W * 5) {
                    sub_ctx.moveTo(x, 0)
                    sub_ctx.lineTo(x, sub_canvas.height)
                }
                for (let y = 0; y <= sub_canvas.height; y += GRID_W * 5) {
                    sub_ctx.moveTo(0, y)
                    sub_ctx.lineTo(sub_canvas.width, y)
                }
                sub_ctx.stroke()
                sub_ctx.beginPath()
                sub_ctx.setLineDash([3, 3]);
                for (let x = 0; x <= sub_canvas.width; x += GRID_W) {
                    if (x % (GRID_W * 5) == 0) continue
                    sub_ctx.moveTo(x, 0)
                    sub_ctx.lineTo(x, sub_canvas.height)
                }
                for (let y = 0; y <= sub_canvas.height; y += GRID_W) {
                    if (y % (GRID_W * 5) == 0) continue
                    sub_ctx.moveTo(0, y)
                    sub_ctx.lineTo(sub_canvas.width, y)
                }
                break
        }
        sub_ctx.stroke()
    }
    // 直前のマウスのcanvas上のx座標とy座標を記録する
    const prevPosition = { x: null, y: null };
    const firstPosition = { x: null, y: null };

    // マウスがドラッグされているか(クリックされたままか)判断するためのフラグ
    let isDrag = false;

    function erase(x, y) {
        if (!isDrag) {
            return;
        }
        const k = 2
        const dx = [0, k, 0, -k, 0], dy = [0, 0, k, 0, -k]
        for (let i = canvas_list.length - 1; i >= 0; i--) {
            const context = canvas_list[i].getContext("2d")
            for (let j = 0; j < 5; j++) {
                const color = context.getImageData(x + dx[j], y + dy[j], 1, 1).data
                if (color[0] != 0 || color[1] != 0 || color[2] != 0 || color[3] != 0) {
                    erase_canvas([i])
                    return
                }
            }
        }
    }

    function round(v) {
        return Math.floor((v + GRID_W / 2) / GRID_W) * GRID_W
    }
    // 絵を書く
    function dragmove(px, py) {
        if (!isDrag) {
            return;
        }
        if (line_color == "erase") {
            erase(px, py)
            return
        }
        if (line_mode == "fill") {
            if (firstPosition.x === null || firstPosition.y === null) my_fill(px, py)
            firstPosition.x = px
            firstPosition.y = py
            return
        }
        if (firstPosition.x === null || firstPosition.y === null) {
            // ドラッグ開始時の線の開始位置
            firstPosition.x = prevPosition.x = px
            firstPosition.y = prevPosition.y = py
            cur_context.lineCap = 'round'; // 丸みを帯びた線にする
            cur_context.lineJoin = 'round'; // 丸みを帯びた線にする
            cur_context.lineWidth = line_thickness; // 線の太さ
            cur_context.strokeStyle = line_color; // 線の色
            cur_context.fillStyle = line_color; // 線の色
            if (line_mode == "default") {
                cur_context.beginPath();
            }
            if (line_mode == "alpha_rectangle") {
                cur_context.fillStyle = cur_context.fillStyle.substring(0, 7) + "50"
            }
        }
        if (line_mode == "default") {
            cur_context.moveTo(prevPosition.x, prevPosition.y);
            cur_context.lineTo(px, py);
            cur_context.stroke();
            canvas_written = true
        }
        else {
            let first_x, first_y, cur_x, cur_y, prev_x, prev_y
            first_x = round(firstPosition.x), first_y = round(firstPosition.y)
            prev_x = round(prevPosition.x), prev_y = round(prevPosition.y)
            cur_x = round(px), cur_y = round(py)
            if (prev_x == cur_x && prev_y == cur_y) return
            switch (line_mode) {
                case "straight":
                    cur_context.clearRect(0, 0, cur_canvas.width, cur_canvas.height)
                    if (first_x == cur_x && first_y == cur_y) { canvas_written = false; return }
                    else canvas_written = true
                    cur_context.beginPath();
                    cur_context.moveTo(first_x, first_y);
                    cur_context.lineTo(cur_x, cur_y);
                    cur_context.stroke();

                    if (grid_mode == "no-grid") sub_ctx.clearRect(0, 0, sub_canvas.width, sub_canvas.height)
                    if ((first_x == cur_x || first_y == cur_y || Math.abs(first_x - cur_x) == Math.abs(first_y - cur_y))
                        && grid_mode == "no-grid") {
                        const k = Math.max(sub_canvas.width, sub_canvas.height)
                        sub_ctx.beginPath();
                        sub_ctx.moveTo(cur_x, cur_y);
                        sub_ctx.lineTo((cur_x - first_x) * k + first_x, (cur_y - first_y) * k + first_y);
                        sub_ctx.stroke();
                    }
                    break
                case "rectangle":
                case "fill_rectangle":
                case "alpha_rectangle":
                    cur_context.clearRect(0, 0, cur_canvas.width, cur_canvas.height)
                    if (first_x == cur_x || first_y == cur_y) { canvas_written = false; return }
                    else canvas_written = true
                    cur_context.beginPath();
                    cur_context.moveTo(first_x, first_y)
                    cur_context.lineTo(first_x, cur_y)
                    cur_context.lineTo(cur_x, cur_y)
                    cur_context.lineTo(cur_x, first_y)
                    cur_context.closePath()
                    if (line_mode == "rectangle") cur_context.stroke()
                    else cur_context.fillRect(first_x, first_y, cur_x - first_x, cur_y - first_y);
                    break
                case "circle":
                case "fill_circle":
                    cur_context.clearRect(0, 0, cur_canvas.width, cur_canvas.height)
                    let radius = Math.sqrt((first_x - cur_x) * (first_x - cur_x) + (first_y - cur_y) * (first_y - cur_y))
                    if (first_x == cur_x && first_y == cur_y || radius == 0) { canvas_written = false; return }
                    else canvas_written = true
                    cur_context.beginPath();
                    cur_context.arc(first_x, first_y, radius,
                        0, 2 * Math.PI, false)
                    cur_context.moveTo(first_x, first_y + 1)
                    cur_context.arc(first_x, first_y, 1,
                        0, 2 * Math.PI, false)
                    if (line_mode == "fill_circle") cur_context.fill()
                    else cur_context.stroke()
                    break
                case "arrow":
                    cur_context.clearRect(0, 0, cur_canvas.width, cur_canvas.height)
                    if (first_x == cur_x && first_y == cur_y) { canvas_written = false; return }
                    else canvas_written = true
                    cur_context.beginPath();
                    let w = cur_x - first_x, h = cur_y - first_y, aw = 0, ah = 0
                    const k = [3, 8, 13, 25, 50, 80]
                    if (Math.abs(first_x - cur_x) >= Math.abs(first_y - cur_y)) {
                        h = k[Math.min(Math.floor(Math.abs(h) / 10), k.length - 1)]
                        aw = h + 10
                        ah = (Math.abs(aw) + 10) * (w / Math.abs(w))
                        cur_context.moveTo(first_x + w, first_y)
                        cur_context.lineTo(first_x + w - ah / 2, first_y - aw / 2)
                        cur_context.lineTo(first_x + w - ah / 2, first_y - h / 3)
                        cur_context.lineTo(first_x, first_y - h / 3)
                        cur_context.lineTo(first_x, first_y + h / 3)
                        cur_context.lineTo(first_x + w - ah / 2, first_y + h / 3)
                        cur_context.lineTo(first_x + w - ah / 2, first_y + aw / 2)
                        cur_context.closePath()
                    }
                    else {
                        w = k[Math.min(Math.floor(Math.abs(w) / 10), k.length - 1)]
                        aw = w + 10
                        ah = (Math.abs(aw) + 10) * (h / Math.abs(h))
                        cur_context.moveTo(first_x, first_y + h)
                        cur_context.lineTo(first_x - aw / 2, first_y + h - ah / 2)
                        cur_context.lineTo(first_x - w / 3, first_y + h - ah / 2)
                        cur_context.lineTo(first_x - w / 3, first_y)
                        cur_context.lineTo(first_x + w / 3, first_y)
                        cur_context.lineTo(first_x + w / 3, first_y + h - ah / 2)
                        cur_context.lineTo(first_x + aw / 2, first_y + h - ah / 2)
                        cur_context.closePath()
                    }
                    cur_context.fill()
                    break
            }
        }
        prevPosition.x = px;
        prevPosition.y = py;
    }

    // マウスのドラッグを開始したらisDragのフラグをtrueにしてdraw関数内で
    // お絵かき処理が途中で止まらないようにする
    function dragStart(px, py) {
        isDrag = true;
        dragmove(px, py);
    }
    // マウスのドラッグが終了したら、もしくはマウスがcanvas外に移動したら
    // isDragのフラグをfalseにしてdraw関数内でお絵かき処理が中断されるようにする
    function dragEnd(px, py) {
        if (!cur_context) return
        if (grid_mode == "no-grid") sub_ctx.clearRect(0, 0, sub_canvas.width, sub_canvas.height)

        firstPosition.x = null;
        firstPosition.y = null;
        if (isDrag && line_color != "erase") create_new_canvas()
        isDrag = false;
    }
    function flood_fill(img, dist, px, py, rep_color) {
        const W = img.width
        const H = img.height
        const tr = img.data[(W * py + px) * 4]
        const tg = img.data[(W * py + px) * 4 + 1]
        const tb = img.data[(W * py + px) * 4 + 2]
        const ta = img.data[(W * py + px) * 4 + 3]
        const dx = [1, 0, -1, 0], dy = [0, 1, 0, -1]
        const pixel = img.data
        if (tr == rep_color[0] && tg == rep_color[1] && tb == rep_color[2] && ta == rep_color[3]) {
            canvas_written = false
            return
        }
        canvas_written = true
        let cell = [W * py + px]
        while (cell.length) {
            let p = cell.pop()
            pixel[p * 4] = rep_color[0]
            pixel[p * 4 + 1] = rep_color[1]
            pixel[p * 4 + 2] = rep_color[2]
            pixel[p * 4 + 3] = rep_color[3]
            dist.data[p * 4] = rep_color[0]
            dist.data[p * 4 + 1] = rep_color[1]
            dist.data[p * 4 + 2] = rep_color[2]
            dist.data[p * 4 + 3] = rep_color[3]
            for (let i = 0; i < 4; i++) {
                let ty = Math.floor(p / W) + dy[i], tx = p % W + dx[i]
                if (ty < 0 || ty >= H || tx < 0 || tx >= W) continue
                let nxp = W * ty + tx
                if (pixel[nxp * 4] != tr || pixel[nxp * 4 + 1] != tg
                    || pixel[nxp * 4 + 2] != tb || pixel[nxp * 4 + 3] != ta) continue
                cell.push(nxp)
            }
        }
    }
    function get_colorValue() {
        return [line_color.slice(1, 3), line_color.slice(3, 5), line_color.slice(5, 7), line_color.slice(7, 9)].map(function (str) {
            return parseInt(str, 16);
        });
    }
    function my_fill(px, py) {
        px = Math.round(px), py = Math.round(py)
        const img = get_current_img()
        const dist = cur_context.getImageData(0, 0, cur_canvas.width, cur_canvas.height)
        flood_fill(img, dist, px, py, get_colorValue())
        cur_context.putImageData(dist, 0, 0)
    }
    function get_current_img() {
        let new_canvas = document.createElement("canvas")
        new_canvas.width = cur_canvas.width;
        new_canvas.height = cur_canvas.height;
        let ctx = new_canvas.getContext("2d")
        canvas_history[history_id].forEach((c) => {
            ctx.drawImage(c, 0, 0, c.width, c.height);
        })
        return ctx.getImageData(0, 0, cur_canvas.width, cur_canvas.height)
    }
    function mobile_canvas_dragStart(px, py) {
        isDrag = true
        let img = mobile_canvas_img
        const k = Math.min(prev_img_w / 5, 15)
        if (mobile_img_x + k < px && px < prev_img_w + mobile_img_x - k
            && mobile_img_y + k < py && py < img.height * prev_img_w / img.width + mobile_img_y - k) {
            mobile_canvas_ope = "move"
        }
        else if (prev_img_w + mobile_img_x - k < px && px < prev_img_w + mobile_img_x + k
            && mobile_img_y - k < py && py < img.height * prev_img_w / img.width + mobile_img_y + k) {
            mobile_canvas_ope = "ch_scale_right"
        }
        else if (mobile_img_x - k < px && px < mobile_img_x + k
            && mobile_img_y - k < py && py < img.height * prev_img_w / img.width + mobile_img_y + k) {
            mobile_canvas_ope = "ch_scale_left"
        }
        else if (mobile_img_x < px && px < prev_img_w + mobile_img_x
            && mobile_img_y - k < py && py < mobile_img_y + k) {
            mobile_canvas_ope = "ch_scale_top"
        }
        else if (mobile_img_x < px && px < prev_img_w + mobile_img_x
            && img.height * prev_img_w / img.width + mobile_img_y - k < py
            && py < img.height * prev_img_w / img.width + mobile_img_y + k) {
            mobile_canvas_ope = "ch_scale_bottom"
        }
        else {
            mobile_canvas_ope = "set"
            transfer_mobile_canvase_to_cur_canvas()
        }
        firstPosition.x = px
        firstPosition.y = py
    }
    function mobile_canvas_dragEnd(px, py) {
        if (!isDrag) return
        isDrag = false
        let dx = px - firstPosition.x
        let dy = py - firstPosition.y
        let img = mobile_canvas_img
        switch (mobile_canvas_ope) {
            case "ch_scale_left":
                prev_img_w -= dx
                mobile_img_x += dx
                break
            case "ch_scale_right":
                prev_img_w += dx
                break
            case "ch_scale_top":
                prev_img_w -= dy * img.width / img.height
                mobile_img_y += dy
                break
            case "ch_scale_bottom":
                prev_img_w += dy * img.width / img.height
                break
            case "move":
                mobile_img_x += dx
                mobile_img_y += dy
                break
            case "set":
                break
        }
        firstPosition.x = null;
        firstPosition.y = null;
    }
    function mobile_canvas_move(px, py) {
        if (isDrag == false) {
            let img = mobile_canvas_img
            const k = Math.min(prev_img_w / 5, 15)
            if (mobile_img_x + k < px && px < prev_img_w + mobile_img_x - k
                && mobile_img_y + k < py && py < img.height * prev_img_w / img.width + mobile_img_y - k) {
                mobile_canvas.style.cursor = "move"
            }
            else if (prev_img_w + mobile_img_x - k < px && px < prev_img_w + mobile_img_x + k
                && mobile_img_y - k < py && py < img.height * prev_img_w / img.width + mobile_img_y + k) {
                mobile_canvas.style.cursor = "ew-resize"
            }
            else if (mobile_img_x - k < px && px < mobile_img_x + k
                && mobile_img_y - k < py && py < img.height * prev_img_w / img.width + mobile_img_y + k) {
                mobile_canvas.style.cursor = "ew-resize"
            }
            else if (mobile_img_x < px && px < prev_img_w + mobile_img_x
                && mobile_img_y - k < py && py < mobile_img_y + k) {
                mobile_canvas.style.cursor = "ns-resize"
            }
            else if (mobile_img_x < px && px < prev_img_w + mobile_img_x
                && img.height * prev_img_w / img.width + mobile_img_y - k < py
                && py < img.height * prev_img_w / img.width + mobile_img_y + k) {
                mobile_canvas.style.cursor = "ns-resize"
            }
            else {
                mobile_canvas_ope = "set"
                mobile_canvas.style.cursor = "default"
            }
        }
        else {
            let img = mobile_canvas_img
            let dx = px - firstPosition.x
            let dy = py - firstPosition.y
            let scale
            switch (mobile_canvas_ope) {
                case "ch_scale_left":
                    scale = (prev_img_w - dx) / img.width
                    disp_mobile_img(img, mobile_img_x + dx, mobile_img_y, scale)
                    break
                case "ch_scale_right":
                    scale = (prev_img_w + dx) / img.width
                    disp_mobile_img(img, mobile_img_x, mobile_img_y, scale)
                    break
                case "ch_scale_top":
                    scale = (prev_img_w * img.height / img.width - dy) / img.height
                    disp_mobile_img(img, mobile_img_x, mobile_img_y + dy, scale)
                    break
                case "ch_scale_bottom":
                    scale = (prev_img_w * img.height / img.width + dy) / img.height
                    disp_mobile_img(img, mobile_img_x, mobile_img_y, scale)
                    break
                case "move":
                    disp_mobile_img(img, mobile_img_x + dx, mobile_img_y + dy)
                    break
            }
        }
    }
    function transfer_mobile_canvase_to_cur_canvas() {
        let img = mobile_canvas_img
        cur_context.drawImage(img, mobile_img_x, mobile_img_y,
            prev_img_w, img.height * prev_img_w / img.width)
        remove_mobile_canvas()
        canvas_written = true
        create_new_canvas()
    }
    function remove_mobile_canvas() {
        group.removeChild(mobile_canvas)
        mobile_canvas = null
        mobile_ctx = null
        mobile_canvas_img = null
    }
    function disp_mobile_img(img, x, y, scale = prev_img_w / img.width) {
        let w = Math.floor(img.width * scale), h = Math.floor(img.height * scale)
        mobile_ctx.clearRect(0, 0, mobile_canvas.width, mobile_canvas.height)
        x = Math.floor(x), y = Math.floor(y)
        mobile_ctx.drawImage(img, x, y, w, h)
        mobile_ctx.beginPath()
        mobile_ctx.moveTo(x, y)
        mobile_ctx.lineTo(x + w, y)
        mobile_ctx.lineTo(x + w, y + h)
        mobile_ctx.lineTo(x, y + h)
        mobile_ctx.lineTo(x, y)
        mobile_ctx.stroke()
        mobile_ctx.closePath()
    }
});

function isSmartPhone() {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
        return true;
    } else {
        return false;
    }
}