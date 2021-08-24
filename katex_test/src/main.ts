import html2canvas from 'html2canvas'

let form, text_form, katex_rule, menu, range, auto_update, font_size, text_area, group, error_cnt = 0
let cur_canvas, cur_context, canvas_list = [], erase_canvas_list = []

window.addEventListener('load', () => {
    setup();
    initEventHandler();
});
const textcanvas: any = document.getElementById("textcanvas")

function setup() {
    console.log("setup")
    form = document["form"]
    text_form = getRuleBySelector('.textform')
    katex_rule = getRuleBySelector('.katex')

    group = document.getElementById("draw-area")
    text_area = document.getElementById("text")
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
    auto_update.onclick = () => onClick()
    font_size.addEventListener('change', () => { change_fontsize(), onClick() })
    range.addEventListener('input', () => change_range())

    change_fontsize()
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

    document.getElementById("pen_mode").onclick = () => pen_modeClick()
    document.getElementById("pen_undo").onclick = () => pen_undo()
    document.getElementById("pen_do").onclick = () => pen_do()
}
function add_str(str1, str2 = "", flag = false) {
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
function pen_modeClick() {
    if (text_area.innerHTML == "") return
    window.scrollTo(0, 0);
    html2canvas(text_area, { scale: font_size.value / 2 }).then((canvas) => {
        {
            const context = canvas.getContext("2d")
            const canvas2: any = document.getElementById("textcanvas")
            const context2 = canvas2.getContext("2d")
            const image = context.getImageData(0, 0, canvas.width, canvas.height);
            const x = text_area.getBoundingClientRect().left
            const y = text_area.getBoundingClientRect().top
            const W = window.innerWidth
            const H = window.innerHeight
            canvas2.width = Math.max(canvas.width + x + 200, W - 20)
            canvas2.height = Math.max(canvas.height + y, H - 10)
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
function pen_undo() {
    if (canvas_list.length > 0) {
        const target = canvas_list.pop()
        group.removeChild(target)
        erase_canvas_list.push(target)
    }
}
function pen_do() {
    if (erase_canvas_list.length > 0) {
        const target = erase_canvas_list.pop()
        group.appendChild(target)
        canvas_list.push(target)
    }
}
function create_new_canvas() {
    const text_canvas: any = document.getElementById("textcanvas")
    if (cur_canvas) {
        canvas_list.push(cur_canvas)
        erase_canvas_list.length = 0
    }
    cur_canvas = document.createElement("canvas")
    cur_canvas.classList.add("canvas");
    cur_canvas.width = text_canvas.width;
    cur_canvas.height = text_canvas.height;
    cur_canvas.style.zIndex = 11;
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


// 絵を書く
function draw(x, y) {
    // マウスがドラッグされていなかったら処理を中断する。
    // ドラッグしながらしか絵を書くことが出来ない。
    if (!isDrag) {
        return;
    }
    if (lastPosition.x === null || lastPosition.y === null) {
        // ドラッグ開始時の線の開始位置
        cur_context.beginPath();
        lastPosition.x = x
        lastPosition.y = y
    }
    cur_context.lineCap = 'round'; // 丸みを帯びた線にする
    cur_context.lineJoin = 'round'; // 丸みを帯びた線にする
    cur_context.lineWidth = 5; // 線の太さ
    cur_context.strokeStyle = 'black'; // 線の色

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
    if (isDrag) create_new_canvas(0, 0)
    isDrag = false;
}

// マウス操作やボタンクリック時のイベント処理を定義する
function initEventHandler() {
    const clearButton = document.getElementById('button_clearpen');

    if (clearButton) clearButton.addEventListener('click', clearCanvas);
}