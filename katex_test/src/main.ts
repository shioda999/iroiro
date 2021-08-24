import html2canvas from 'html2canvas'

let form, text_form, katex_rule, menu, range, auto_update, font_size, text_area, error_cnt = 0
let image_list = [], image_id = -1
setTimeout(() => setup(), 200)

function setup() {
    console.log("setup")
    form = document["form"]
    text_form = getRuleBySelector('.textform')
    katex_rule = getRuleBySelector('.katex')

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
        console.log(html)
        text_area.innerHTML = html
    }
}
function pen_modeClick() {
    if (text_area.innerHTML == "") return
    window.scrollTo(0, 0);
    html2canvas(text_area).then((canvas) => {
        {
            const canvas2: any = document.getElementById("text-area")
            const draw_canvas: any = document.getElementById("draw-area")
            const context = canvas.getContext("2d")
            const context2 = canvas2.getContext("2d")
            let image = context.getImageData(0, 0, canvas.width, canvas.height);
            const x = text_area.getBoundingClientRect().left
            const y = text_area.getBoundingClientRect().top
            const W = document.body.getBoundingClientRect().width
            draw_canvas.width = canvas2.width = Math.max(canvas.width + x + 200, W - 20)
            draw_canvas.height = canvas2.height = canvas.height + y
            context2.putImageData(image, x, y);
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
function renderImage(image) {
    const text_canvas: any = document.getElementById("text-area")
    const canvas: any = document.getElementById("draw-area")
    const context = canvas.getContext("2d")
    context.putImageData(image, 0, 0);
}
function push_current_canvasImage() {
    const canvas: any = document.getElementById("draw-area")
    const context = canvas.getContext("2d")
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    image_id++
    if (image_list.length == image_id) image_list.push(image)
    else {
        image_list[image_id] = image
        image_list.length = image_id + 1
    }
    console.log("push:" + image_id)
    console.log("length:" + image_list.length)
}
function pen_undo() {
    image_id--
    if (image_id < 0) {
        image_id = -1
        const canvas: any = document.getElementById("draw-area")
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    else renderImage(image_list[image_id])
    console.log("undo:" + image_id)
    console.log("length:" + image_list.length)
}
function pen_do() {
    if (image_list.length - 1 <= image_id) image_id = image_list.length - 1
    else {
        image_id++
        renderImage(image_list[image_id])
        console.log("do:" + image_id)
        console.log("length:" + image_list.length)
    }
}
window.addEventListener('load', () => {
    const canvas: any = document.querySelector('#draw-area');
    // contextを使ってcanvasに絵を書いていく
    const context = canvas.getContext('2d');

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

        // 「context.beginPath()」と「context.closePath()」を都度draw関数内で実行するよりも、
        // 線の描き始め(dragStart関数)と線の描き終わり(dragEnd)で1回ずつ読んだほうがより綺麗に線画書ける

        // 線の状態を定義する
        // MDN CanvasRenderingContext2D: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
        context.lineCap = 'round'; // 丸みを帯びた線にする
        context.lineJoin = 'round'; // 丸みを帯びた線にする
        context.lineWidth = 5; // 線の太さ
        context.strokeStyle = 'black'; // 線の色

        // 書き始めは lastPosition.x, lastPosition.y の値はnullとなっているため、
        // クリックしたところを開始点としている。
        // この関数(draw関数内)の最後の2行で lastPosition.xとlastPosition.yに
        // 現在のx, y座標を記録することで、次にマウスを動かした時に、
        // 前回の位置から現在のマウスの位置まで線を引くようになる。
        if (lastPosition.x === null || lastPosition.y === null) {
            // ドラッグ開始時の線の開始位置
            context.moveTo(x, y);
        } else {
            // ドラッグ中の線の開始位置
            context.moveTo(lastPosition.x, lastPosition.y);
        }
        // context.moveToで設定した位置から、context.lineToで設定した位置までの線を引く。
        // - 開始時はmoveToとlineToの値が同じであるためただの点となる。
        // - ドラッグ中はlastPosition変数で前回のマウス位置を記録しているため、
        //   前回の位置から現在の位置までの線(点のつながり)となる
        context.lineTo(x, y);

        // context.moveTo, context.lineToの値を元に実際に線を引く
        context.stroke();

        // 現在のマウス位置を記録して、次回線を書くときの開始点に使う
        lastPosition.x = x;
        lastPosition.y = y;
    }

    // canvas上に書いた絵を全部消す
    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        push_current_canvasImage()
    }

    // マウスのドラッグを開始したらisDragのフラグをtrueにしてdraw関数内で
    // お絵かき処理が途中で止まらないようにする
    function dragStart(event) {
        console.log("start")
        // これから新しい線を書き始めることを宣言する
        // 一連の線を書く処理が終了したらdragEnd関数内のclosePathで終了を宣言する
        context.beginPath();

        isDrag = true;
    }
    // マウスのドラッグが終了したら、もしくはマウスがcanvas外に移動したら
    // isDragのフラグをfalseにしてdraw関数内でお絵かき処理が中断されるようにする
    function dragEnd(event) {
        // 線を書く処理の終了を宣言する
        context.closePath();

        // 描画中に記録していた値をリセットする
        lastPosition.x = null;
        lastPosition.y = null;
        if (isDrag) push_current_canvasImage()
        isDrag = false;
    }

    // マウス操作やボタンクリック時のイベント処理を定義する
    function initEventHandler() {
        const clearButton = document.getElementById('button_clearpen');

        if (clearButton) clearButton.addEventListener('click', clearCanvas);

        canvas.addEventListener('mousedown', dragStart);
        canvas.addEventListener('mouseup', dragEnd);
        canvas.addEventListener('mouseout', dragEnd);
        canvas.addEventListener('mousemove', (event) => {
            // eventの中の値を見たい場合は以下のようにconsole.log(event)で、
            // デベロッパーツールのコンソールに出力させると良い
            // console.log(event);

            draw(event.layerX, event.layerY);
        });
    }

    // イベント処理を初期化する
    initEventHandler();
});