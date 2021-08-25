import html2canvas from 'html2canvas'

window.addEventListener('load', () => {
    let cur_canvas, cur_context, canvas_list = [], erase_canvas_data = [], line_thickness = 5, line_color = "black"
    let operation_list = []
    const form = document["form"]
    const text_form = getRuleBySelector('.textform')
    const katex_rule = getRuleBySelector('.katex')

    const group = document.getElementById("draw-area")
    const text_area = document.getElementById("text")
    const menu = document.getElementById("floating_menu")
    const range = menu.children["move"]
    const thickness: any = document.getElementById("thickness")
    const thickness_label: any = document.getElementById("thickness_label")
    const auto_update = menu.children["auto_update"]
    const font_size = menu.children["font_size"]
    const colorcircle2 = document.getElementsByName("colorcircle")
    const textcanvas: any = document.getElementById("textcanvas")
    setup();
    initEventHandler();

    function setup() {
        set_button_option()
        auto_update.onclick = () => onClick()
        font_size.addEventListener('change', () => { change_fontsize(), onClick() })
        range.addEventListener('input', () => change_range())
        thickness.addEventListener('input', () => change_thickness())
        colorcircle2.forEach((e) => {
            e.addEventListener('input', () => change_color(e.value))
        })

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
        onClick()
    }

    function set_button_option() {
        document.getElementById("button_clear").onclick = () => { if (window.confirm("本当にテキストを全て削除しますか？")) form.text.value = "" }
        document.getElementById("button_cases").onclick = () => add_str("\n\\begin{cases}\n", "\n\\end{cases}")
        document.getElementById("button_align").onclick = () => add_str("\n\\begin{aligned}\n", "\n\\end{aligned}", true)
        document.getElementById("button_frac").onclick = () => add_str("\\frac{a}{b}")
        document.getElementById("button_dfrac").onclick = () => add_str("\\dfrac{a}{b}")
        document.getElementById("button_mathrm").onclick = () => add_str("\\mathrm{", "}")
        document.getElementById("button_rightarrow").onclick = () => add_str("\\rightarrow ")
        document.getElementById("syntax_checker").onclick = () => syntax_check()

        document.getElementById("paint_mode").addEventListener("input", () => paint_modeClick())
        document.getElementById("paint_undo").onclick = () => paint_undo()
        document.getElementById("paint_do").onclick = () => paint_do()
    }
    function add_str(str1, str2 = "") {
        let pos = form.text.selectionStart
        let pos2 = form.text.selectionEnd
        let pre = form.text.value.slice(0, pos)
        let middle = form.text.value.slice(pos, pos2)
        let after = form.text.value.slice(pos2)
        middle = middle.replace(/(^|[^&])=/g, '$1&=')
        pre += str1
        middle += str2
        form.text.value = pre + middle + after
        form.text.focus()
        form.text.selectionEnd = form.text.selectionStart = pre.length + middle.length
    }
    function syntax_check() {
        let html, ok = true
        try {
            html = katex.renderToString(form.text.value, {})
        }
        catch (error) {
            alert(error.message)
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
    function paint_modeClick() {
        if (text_area.innerHTML == "") return
        window.scrollTo(0, 0);
        html2canvas(text_area, { scale: font_size.value / 2 }).then((canvas) => {
            {
                const context = canvas.getContext("2d")
                const context2 = textcanvas.getContext("2d")
                const image = context.getImageData(0, 0, canvas.width, canvas.height);
                const x = text_area.getBoundingClientRect().left
                const y = text_area.getBoundingClientRect().top
                const W = window.innerWidth
                const H = window.innerHeight
                textcanvas.width = Math.max(canvas.width + x + 200, W - 40)
                textcanvas.height = Math.max(canvas.height + y, H - 20)
                context2.putImageData(image, x, y);
                //if (image_list[image_id]) draw_context.putImageData(image_list[image_id], 0, 0);
                text_area.innerHTML = ""
                create_new_canvas()
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
        console.log(color)
        line_color = color
    }
    function erase_canvas(index: number[]) {
        const data = []
        index.forEach((i) => {
            data.push({ index: i, canvas: canvas_list[i] })
            group.removeChild(canvas_list[i])
            canvas_list.splice(i, 1)
        })
        erase_canvas_data.push(data)
    }
    function paint_undo() {
        if (canvas_list.length > 0) {
            erase_canvas([canvas_list.length - 1])
        }
    }
    function paint_do() {
        if (erase_canvas_data.length > 0) {
            const target = erase_canvas_data.pop()
            target.forEach((e) => {
                group.appendChild(e.canvas)
                canvas_list.splice(e.index, 0, e.canvas)
            })
        }
    }
    function create_new_canvas() {
        if (cur_canvas) {
            canvas_list.push(cur_canvas)
            erase_canvas_data.length = 0
        }
        cur_canvas = document.createElement("canvas")
        cur_canvas.classList.add("canvas");
        cur_canvas.width = textcanvas.width;
        cur_canvas.height = textcanvas.height;
        cur_canvas.style.zIndex = 1;
        cur_canvas.style.border = "4px solid";
        cur_context = cur_canvas.getContext("2d")
        group.appendChild(cur_canvas)
        cur_canvas.addEventListener('mousedown', dragStart);
        cur_canvas.addEventListener('mouseup', dragEnd);
        cur_canvas.addEventListener('mouseout', dragEnd);
        cur_canvas.addEventListener('mousemove', (event) => {
            draw(event.layerX, event.layerY);
        });
    }
    // 直前のマウスのcanvas上のx座標とy座標を記録する
    const lastPosition = { x: null, y: null };

    // マウスがドラッグされているか(クリックされたままか)判断するためのフラグ
    let isDrag = false;

    function erase(x, y) {
        if (!isDrag) {
            return;
        }
        for (let i = 0; i < canvas_list.length; i++) {
            const context = canvas_list[i].getContext("2d")
            if (context.isPointInStroke(x, y)) {
                erase_canvas([i])
            }
        }
    }

    // 絵を書く
    function draw(x, y) {
        if (!isDrag) {
            return;
        }
        if (line_color == "erase") {
            erase(x, y)
            return
        }
        if (lastPosition.x === null || lastPosition.y === null) {
            // ドラッグ開始時の線の開始位置
            cur_context.beginPath();
            lastPosition.x = x
            lastPosition.y = y
        }
        cur_context.lineCap = 'round'; // 丸みを帯びた線にする
        cur_context.lineJoin = 'round'; // 丸みを帯びた線にする
        cur_context.lineWidth = line_thickness; // 線の太さ
        cur_context.strokeStyle = line_color; // 線の色

        cur_context.moveTo(lastPosition.x, lastPosition.y);
        cur_context.lineTo(x, y);
        cur_context.stroke();

        // 現在のマウス位置を記録して、次回線を書くときの開始点に使う
        lastPosition.x = x;
        lastPosition.y = y;
    }

    // canvas上に書いた絵を全部消す
    function clearCanvas() {
        if (!cur_context) return
        cur_context.clearRect(0, 0, textcanvas.width, textcanvas.height);
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

        // 描画中に記録していた値をリセットする
        lastPosition.x = null;
        lastPosition.y = null;
        if (isDrag && line_color != "erase") create_new_canvas()
        isDrag = false;
    }

    // マウス操作やボタンクリック時のイベント処理を定義する
    function initEventHandler() {
        const clearButton = document.getElementById('button_clearpaint');

        if (clearButton) clearButton.addEventListener('click', clearCanvas);
    }
});