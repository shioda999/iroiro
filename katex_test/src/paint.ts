import { GRID_W, katex_option, katex_instance, is_PC, Global } from './global'
import { ManageHistory } from "./managehistory"
import html2canvas from 'html2canvas'
import { RGBColor } from './rgbcolor'

function round(v) {
    return Math.floor((v + GRID_W / 2) / GRID_W) * GRID_W
}
export class Paint {
    private reader = new FileReader()
    private parent = document.getElementById("draw_canvas")
    private font_size: any = document.getElementById("font_size")
    private sub_canvas: any = document.getElementById("sub_canvas")
    private thickness: any = document.getElementById("thickness")
    private thickness_label: any = document.getElementById("thickness_label")
    private bright: any = document.getElementById("bright")
    private bright_label: any = document.getElementById("bright_label")
    private colorcircle2 = document.getElementsByName("colorcircle")
    private line_mode_button: any = document.getElementById("line_mode_button")
    private grid_mode_button: any = document.getElementById("grid_mode_button")
    private upload_form: any = document.getElementById("upload_button")

    private sub_ctx = this.sub_canvas.getContext("2d")
    private canvas: any
    private context: any
    private canvas_written: boolean = false
    private canvas_history: ManageHistory
    private line_thickness = 5
    private line_color = "black"
    private base_color = "black"
    private line_bright = 1
    private line_alpha = 1
    private line_mode = "default"
    private grid_mode = "no-grid"
    private mobile_canvas: any
    private mobile_ctx: any
    private mobile_canvas_ope
    private mobile_canvas_img
    private prev_img_w
    private mobile_img_x
    private mobile_img_y
    private prevPosition = { x: null, y: null };
    private firstPosition = { x: null, y: null };
    private isDrag: boolean = false;

    constructor() {
        this.canvas_history = new ManageHistory(this.update_canvases)
        this.thickness.addEventListener('input', () => this.change_thickness())
        this.bright.addEventListener('input', () => this.change_bright())
        this.colorcircle2.forEach((e: any) => {
            e.addEventListener('input', () => this.change_color(e.value))
        })
        this.line_mode_button.onchange = () => {
            this.line_mode = this.line_mode_button.options[this.line_mode_button.selectedIndex].value
        }
        this.grid_mode_button.onchange = () => {
            this.grid_mode = this.grid_mode_button.options[this.grid_mode_button.selectedIndex].value
            this.draw_grid()
        }
        this.upload_form.onchange = () => {
            if (this.upload_form.files[0]) this.reader.readAsDataURL(this.upload_form.files[0])
        }
        this.reader.onload = () => {
            this.load_img_from_url(this.reader.result)
        }
        document.getElementById("paint_chara").addEventListener("click", () => this.paint_chara())
        document.getElementById("paint_upload").addEventListener("click", () => this.paint_upload())
        document.getElementById("paint_undo").addEventListener("click", () => this.paint_undo())
        document.getElementById("paint_do").addEventListener("click", () => this.paint_redo())
        document.getElementById("paint_clear").addEventListener("click", () => { if (window.confirm("本当にペイントを全て削除しますか？")) this.erase_all_canvas() })

        this.set_initial_value()
    }
    public onresize = () => {
        this.set_canvas()
        this.resize_sub_canvas()
    }
    private set_initial_value() {
        this.thickness.value = 3
        this.change_thickness()
        this.change_color("black")
        this.resize_sub_canvas()
        this.set_canvas()
    }
    private set_pointer_evens(element) {
        if (is_PC) {
            element.addEventListener('mousedown', this.mouse_dragStart, false);
            element.addEventListener('mouseup', this.mouse_dragEnd, false);
            element.addEventListener('mouseout', this.mouse_dragEnd, false);
            element.addEventListener('mousemove', this.mouse_dragging, false);
        }
        else {
            element.addEventListener('touchstart', this.touch_start, false);
            element.addEventListener('touchend', this.touch_end, false);
            element.addEventListener('touchmove', this.touch_move, false)
        }
    }
    private set_canvas() {
        const canvas: any = document.createElement("canvas")
        canvas.classList.add("canvas");
        canvas.width = document.documentElement.scrollWidth - 30;
        canvas.height = document.documentElement.scrollHeight;
        canvas.style.zIndex = 1;
        this.parent.appendChild(canvas)
        this.set_pointer_evens(canvas)
        this.canvas = canvas
        this.context = canvas.getContext("2d")
    }
    private create_new_canvas() {
        if (!this.canvas_written) return
        this.canvas_written = false
        this.canvas_history.push(this.canvas)
        this.set_canvas()
    }

    private create_mobile_canvas(img, width) {
        if (this.mobile_canvas) this.transfer_mobile_canvase_to_canvas()
        let canvas = document.createElement("canvas")
        canvas.classList.add("canvas");
        canvas.width = document.documentElement.scrollWidth - 30
        canvas.height = document.documentElement.scrollHeight
        canvas.style.zIndex = "1";
        let context = canvas.getContext("2d")

        this.parent.appendChild(canvas)
        this.set_pointer_evens(canvas)
        context.setLineDash([3, 3]);
        context.lineCap = 'round'; // 丸みを帯びた線にする
        context.lineJoin = 'round'; // 丸みを帯びた線にする
        context.lineWidth = 1; // 線の太さ
        context.strokeStyle = "black"; // 線の色
        this.mobile_canvas = canvas
        this.mobile_ctx = context
        this.mobile_canvas_img = img
        this.prev_img_w = width

        let scale = this.prev_img_w / img.width
        this.disp_mobile_img(img, this.mobile_img_x = 0, this.mobile_img_y = 0, scale)
    }
    private load_img_from_url(url) {
        const img = new Image()
        img.src = url
        img.onload = () => this.create_mobile_canvas(img, 300)
    }
    private erase_all_canvas() {
        this.canvas_history.erase_all()
    }
    private erase_canvas(i) {
        this.canvas_history.erase_byid(i)
    }
    private paint_undo() {
        this.canvas_history.undo()
    }
    private paint_redo() {
        this.canvas_history.redo()
    }
    private update_canvases = (prev, now) => {
        let rm = prev.filter(i => now.indexOf(i) == -1)
        let ad = now.filter(i => prev.indexOf(i) == -1)
        rm.forEach((e) => this.parent.removeChild(e))
        ad.forEach((e) => this.parent.appendChild(e))
    }

    private paint_chara() {
        const ret = window.prompt("表示したい文字を入力してください。")
        if (ret == "" || ret == null) return
        let html
        try {
            html = katex_instance.renderToString(ret, katex_option)
        }
        catch (error) {
            alert(error.message)
            return
        }
        const element = document.createElement("div")
        element.innerHTML = html
        this.parent.appendChild(element)
        html2canvas(element, { scale: this.font_size.value / 2 * window.devicePixelRatio }).then((canvas) => {
            const ctx = canvas.getContext("2d")
            const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const W = img.width
            const H = img.height
            for (let i = 0; i < W * H; i++) {
                let v = Math.floor((img.data[4 * i] + img.data[4 * i + 1] + img.data[4 * i + 2]) / 3)
                img.data[4 * i + 3] = Math.min((Math.round(255 - v) * 1.5), 255)
            }
            ctx.putImageData(img, 0, 0)
            this.create_mobile_canvas(canvas, canvas.width / window.devicePixelRatio)
            this.parent.removeChild(element)
        })
    }
    private paint_upload() {
        document.getElementById("upload_button").click()
    }
    private resize_sub_canvas() {
        this.sub_canvas.width = document.documentElement.scrollWidth - 30;
        this.sub_canvas.height = document.documentElement.scrollHeight;
        this.sub_canvas.style["pointer-events"] = "none"
        this.sub_ctx = this.sub_canvas.getContext("2d")
        this.draw_grid()
    }
    private mouse_dragStart = (event) => {
        const px = event.layerX, py = event.layerY
        if (this.mobile_canvas) this.mobile_canvas_dragStart(px, py)
        else this.dragStart(px, py)
    }
    private mouse_dragEnd = (event) => {
        const px = event.layerX, py = event.layerY
        if (this.mobile_canvas) this.mobile_canvas_dragEnd(px, py)
        else this.dragEnd(px, py)
    }
    private mouse_dragging = (event) => {
        const px = event.layerX, py = event.layerY
        if (this.mobile_canvas) this.mobile_canvas_move(px, py)
        else this.dragmove(px, py)
    }
    private touch_start = (event) => {
        const px = event.changedTouches[0].pageX, py = event.changedTouches[0].pageY
        if (this.mobile_canvas) this.mobile_canvas_dragStart(px, py)
        else this.dragStart(px, py)
    }
    private touch_end = (event) => {
        const px = event.changedTouches[0].pageX, py = event.changedTouches[0].pageY
        if (this.mobile_canvas) this.mobile_canvas_dragEnd(px, py)
        else this.dragEnd(px, py)
    }
    private touch_move = (event) => {
        event.preventDefault();
        const px = event.changedTouches[0].pageX, py = event.changedTouches[0].pageY
        if (this.mobile_canvas) this.mobile_canvas_move(px, py)
        else this.dragmove(px, py)
    }
    private draw_grid() {
        this.sub_ctx.clearRect(0, 0, this.sub_canvas.width, this.sub_canvas.height)
        this.sub_ctx.beginPath()
        this.sub_ctx.lineCap = 'butt'; // 丸みを帯びた線にする
        this.sub_ctx.lineJoin = 'butt'; // 丸みを帯びた線にする
        this.sub_canvas.zIndex = -1
        switch (this.grid_mode) {
            case "no-grid":
                this.sub_ctx.setLineDash([3, 3]);
                this.sub_ctx.lineWidth = 1; // 線の太さ
                this.sub_ctx.strokeStyle = "black"; // 線の色
                this.sub_canvas.zIndex = 10
                break
            case "grid":
                this.sub_ctx.setLineDash([]);
                this.sub_ctx.lineWidth = 3; // 線の太さ
                this.sub_ctx.strokeStyle = "#cccccc"; // 線の色
                for (let x = 0; x <= this.sub_canvas.width; x += GRID_W * 5) {
                    this.sub_ctx.moveTo(x, 0)
                    this.sub_ctx.lineTo(x, this.sub_canvas.height)
                }
                for (let y = 0; y <= this.sub_canvas.height; y += GRID_W * 5) {
                    this.sub_ctx.moveTo(0, y)
                    this.sub_ctx.lineTo(this.sub_canvas.width, y)
                }
                this.sub_ctx.stroke()
                this.sub_ctx.beginPath()
                this.sub_ctx.lineWidth = 1; // 線の太さ
                for (let x = 0; x <= this.sub_canvas.width; x += GRID_W) {
                    if (x % (GRID_W * 5) == 0) continue
                    this.sub_ctx.moveTo(x, 0)
                    this.sub_ctx.lineTo(x, this.sub_canvas.height)
                }
                for (let y = 0; y <= this.sub_canvas.height; y += GRID_W) {
                    if (y % (GRID_W * 5) == 0) continue
                    this.sub_ctx.moveTo(0, y)
                    this.sub_ctx.lineTo(this.sub_canvas.width, y)
                }
                break
            case "dotted-grid":
                this.sub_ctx.setLineDash([]);
                this.sub_ctx.lineWidth = 1; // 線の太さ
                this.sub_ctx.strokeStyle = "gray"; // 線の色
                for (let x = 0; x <= this.sub_canvas.width; x += GRID_W * 5) {
                    this.sub_ctx.moveTo(x, 0)
                    this.sub_ctx.lineTo(x, this.sub_canvas.height)
                }
                for (let y = 0; y <= this.sub_canvas.height; y += GRID_W * 5) {
                    this.sub_ctx.moveTo(0, y)
                    this.sub_ctx.lineTo(this.sub_canvas.width, y)
                }
                this.sub_ctx.stroke()
                this.sub_ctx.beginPath()
                this.sub_ctx.setLineDash([3, 3]);
                for (let x = 0; x <= this.sub_canvas.width; x += GRID_W) {
                    if (x % (GRID_W * 5) == 0) continue
                    this.sub_ctx.moveTo(x, 0)
                    this.sub_ctx.lineTo(x, this.sub_canvas.height)
                }
                for (let y = 0; y <= this.sub_canvas.height; y += GRID_W) {
                    if (y % (GRID_W * 5) == 0) continue
                    this.sub_ctx.moveTo(0, y)
                    this.sub_ctx.lineTo(this.sub_canvas.width, y)
                }
                break
        }
        this.sub_ctx.stroke()
    }
    private erase(x, y) {
        if (!this.isDrag) {
            return;
        }
        const k = 2
        const dx = [0, k, 0, -k, 0], dy = [0, 0, k, 0, -k]
        const canvases = this.canvas_history.get()
        for (let i = canvases.length - 1; i >= 0; i--) {
            const context = canvases[i].getContext("2d")
            for (let j = 0; j < 5; j++) {
                const color = context.getImageData(x + dx[j], y + dy[j], 1, 1).data
                if (color[0] != 0 || color[1] != 0 || color[2] != 0 || color[3] != 0) {
                    this.erase_canvas([i])
                    return
                }
            }
        }
    }
    // 絵を書く
    private dragmove(px, py) {
        if (!this.isDrag) {
            return;
        }
        if (this.line_color == "erase") {
            this.erase(px, py)
            return
        }
        if (this.line_mode == "fill") {
            if (this.firstPosition.x === null || this.firstPosition.y === null) this.my_fill(px, py)
            this.firstPosition.x = px
            this.firstPosition.y = py
            return
        }
        if (this.firstPosition.x === null || this.firstPosition.y === null) {
            // ドラッグ開始時の線の開始位置
            this.firstPosition.x = this.prevPosition.x = px
            this.firstPosition.y = this.prevPosition.y = py
            this.context.lineCap = 'round'; // 丸みを帯びた線にする
            this.context.lineJoin = 'round'; // 丸みを帯びた線にする
            this.context.lineWidth = this.line_thickness; // 線の太さ
            this.context.strokeStyle = this.line_color; // 線の色
            this.context.fillStyle = this.line_color; // 線の色
            if (this.line_mode == "default") {
                this.context.beginPath();
            }
            if (this.line_mode == "alpha_rectangle") {
                this.context.fillStyle = this.context.fillStyle.substring(0, 7) + "50"
            }
        }
        if (this.line_mode == "default") {
            this.context.moveTo(this.prevPosition.x, this.prevPosition.y);
            this.context.lineTo(px, py);
            this.context.stroke();
            this.canvas_written = true
        }
        else {
            let first_x, first_y, cur_x, cur_y, prev_x, prev_y
            first_x = round(this.firstPosition.x), first_y = round(this.firstPosition.y)
            prev_x = round(this.prevPosition.x), prev_y = round(this.prevPosition.y)
            cur_x = round(px), cur_y = round(py)
            if (prev_x == cur_x && prev_y == cur_y) return
            switch (this.line_mode) {
                case "straight":
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    if (first_x == cur_x && first_y == cur_y) { this.canvas_written = false; return }
                    else this.canvas_written = true
                    this.context.beginPath();
                    this.context.moveTo(first_x, first_y);
                    this.context.lineTo(cur_x, cur_y);
                    this.context.stroke();

                    if (this.grid_mode == "no-grid") this.sub_ctx.clearRect(0, 0, this.sub_canvas.width, this.sub_canvas.height)
                    if ((first_x == cur_x || first_y == cur_y || Math.abs(first_x - cur_x) == Math.abs(first_y - cur_y))
                        && this.grid_mode == "no-grid") {
                        const k = Math.max(this.sub_canvas.width, this.sub_canvas.height)
                        this.sub_ctx.beginPath();
                        this.sub_ctx.moveTo(cur_x, cur_y);
                        this.sub_ctx.lineTo((cur_x - first_x) * k + first_x, (cur_y - first_y) * k + first_y);
                        this.sub_ctx.stroke();
                    }
                    break
                case "rectangle":
                case "fill_rectangle":
                case "alpha_rectangle":
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    if (first_x == cur_x || first_y == cur_y) { this.canvas_written = false; return }
                    else this.canvas_written = true
                    this.context.beginPath();
                    this.context.moveTo(first_x, first_y)
                    this.context.lineTo(first_x, cur_y)
                    this.context.lineTo(cur_x, cur_y)
                    this.context.lineTo(cur_x, first_y)
                    this.context.closePath()
                    if (this.line_mode == "rectangle") this.context.stroke()
                    else this.context.fillRect(first_x, first_y, cur_x - first_x, cur_y - first_y);
                    break
                case "circle":
                case "fill_circle":
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    let radius = Math.sqrt((first_x - cur_x) * (first_x - cur_x) + (first_y - cur_y) * (first_y - cur_y))
                    if (first_x == cur_x && first_y == cur_y || radius == 0) { this.canvas_written = false; return }
                    else this.canvas_written = true
                    this.context.beginPath();
                    this.context.arc(first_x, first_y, radius,
                        0, 2 * Math.PI, false)
                    this.context.moveTo(first_x, first_y + 1)
                    this.context.arc(first_x, first_y, 1,
                        0, 2 * Math.PI, false)
                    if (this.line_mode == "fill_circle") this.context.fill()
                    else this.context.stroke()
                    break
                case "arrow":
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    if (first_x == cur_x && first_y == cur_y) { this.canvas_written = false; return }
                    else this.canvas_written = true
                    this.context.beginPath();
                    let w = cur_x - first_x, h = cur_y - first_y, aw = 0, ah = 0
                    const k = [3, 8, 13, 25, 50, 80]
                    if (Math.abs(first_x - cur_x) >= Math.abs(first_y - cur_y)) {
                        h = k[Math.min(Math.floor(Math.abs(h) / 10), k.length - 1)]
                        aw = h + 10
                        ah = (Math.abs(aw) + 10) * (w / Math.abs(w))
                        this.context.moveTo(first_x + w, first_y)
                        this.context.lineTo(first_x + w - ah / 2, first_y - aw / 2)
                        this.context.lineTo(first_x + w - ah / 2, first_y - h / 3)
                        this.context.lineTo(first_x, first_y - h / 3)
                        this.context.lineTo(first_x, first_y + h / 3)
                        this.context.lineTo(first_x + w - ah / 2, first_y + h / 3)
                        this.context.lineTo(first_x + w - ah / 2, first_y + aw / 2)
                        this.context.closePath()
                    }
                    else {
                        w = k[Math.min(Math.floor(Math.abs(w) / 10), k.length - 1)]
                        aw = w + 10
                        ah = (Math.abs(aw) + 10) * (h / Math.abs(h))
                        this.context.moveTo(first_x, first_y + h)
                        this.context.lineTo(first_x - aw / 2, first_y + h - ah / 2)
                        this.context.lineTo(first_x - w / 3, first_y + h - ah / 2)
                        this.context.lineTo(first_x - w / 3, first_y)
                        this.context.lineTo(first_x + w / 3, first_y)
                        this.context.lineTo(first_x + w / 3, first_y + h - ah / 2)
                        this.context.lineTo(first_x + aw / 2, first_y + h - ah / 2)
                        this.context.closePath()
                    }
                    this.context.fill()
                    break
            }
        }
        this.prevPosition.x = px;
        this.prevPosition.y = py;
    }

    // マウスのドラッグを開始したらthis.isDragのフラグをtrueにしてdraw関数内で
    // お絵かき処理が途中で止まらないようにする
    private dragStart(px, py) {
        this.isDrag = true;
        this.dragmove(px, py);
    }
    // マウスのドラッグが終了したら、もしくはマウスがcanvas外に移動したら
    // this.isDragのフラグをfalseにしてdraw関数内でお絵かき処理が中断されるようにする
    private dragEnd(px, py) {
        if (!this.context) return
        if (this.grid_mode == "no-grid") this.sub_ctx.clearRect(0, 0, this.sub_canvas.width, this.sub_canvas.height)

        this.firstPosition.x = null;
        this.firstPosition.y = null;
        if (this.isDrag && this.line_color != "erase") this.create_new_canvas()
        this.isDrag = false;
    }
    private flood_fill(img, dist, px, py, rep_color) {
        const W = img.width
        const H = img.height
        const tr = img.data[(W * py + px) * 4]
        const tg = img.data[(W * py + px) * 4 + 1]
        const tb = img.data[(W * py + px) * 4 + 2]
        const ta = img.data[(W * py + px) * 4 + 3]
        const dx = [1, 0, -1, 0], dy = [0, 1, 0, -1]
        const pixel = img.data
        if (tr == rep_color[0] && tg == rep_color[1] && tb == rep_color[2] && ta == rep_color[3]) {
            this.canvas_written = false
            return
        }
        this.canvas_written = true
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
    private get_colorValue() {
        const c = this.line_color
        return [c.slice(1, 3), c.slice(3, 5), c.slice(5, 7), c.slice(7, 9)].map(function (str) {
            return parseInt(str, 16);
        });
    }
    private my_fill(px, py) {
        px = Math.round(px), py = Math.round(py)
        const img = this.get_current_img()
        const dist = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        this.flood_fill(img, dist, px, py, this.get_colorValue())
        this.context.putImageData(dist, 0, 0)
    }
    private get_current_img() {
        let new_canvas = document.createElement("canvas")
        new_canvas.width = this.canvas.width;
        new_canvas.height = this.canvas.height;
        let ctx = new_canvas.getContext("2d")
        this.canvas_history.get().forEach((c) => {
            ctx.drawImage(c, 0, 0, c.width, c.height);
        })
        return ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    }
    private mobile_canvas_dragStart(px, py) {
        this.isDrag = true
        let img = this.mobile_canvas_img
        const k = Math.min(this.prev_img_w / 5, 15)
        if (this.mobile_img_x + k < px && px < this.prev_img_w + this.mobile_img_x - k
            && this.mobile_img_y + k < py && py < img.height * this.prev_img_w / img.width + this.mobile_img_y - k) {
            this.mobile_canvas_ope = "move"
        }
        else if (this.prev_img_w + this.mobile_img_x - k < px && px < this.prev_img_w + this.mobile_img_x + k
            && this.mobile_img_y - k < py && py < img.height * this.prev_img_w / img.width + this.mobile_img_y + k) {
            this.mobile_canvas_ope = "ch_scale_right"
        }
        else if (this.mobile_img_x - k < px && px < this.mobile_img_x + k
            && this.mobile_img_y - k < py && py < img.height * this.prev_img_w / img.width + this.mobile_img_y + k) {
            this.mobile_canvas_ope = "ch_scale_left"
        }
        else if (this.mobile_img_x < px && px < this.prev_img_w + this.mobile_img_x
            && this.mobile_img_y - k < py && py < this.mobile_img_y + k) {
            this.mobile_canvas_ope = "ch_scale_top"
        }
        else if (this.mobile_img_x < px && px < this.prev_img_w + this.mobile_img_x
            && img.height * this.prev_img_w / img.width + this.mobile_img_y - k < py
            && py < img.height * this.prev_img_w / img.width + this.mobile_img_y + k) {
            this.mobile_canvas_ope = "ch_scale_bottom"
        }
        else {
            this.mobile_canvas_ope = "set"
            this.transfer_mobile_canvase_to_canvas()
        }
        this.firstPosition.x = px
        this.firstPosition.y = py
    }
    private mobile_canvas_dragEnd(px, py) {
        if (!this.isDrag) return
        this.isDrag = false
        let dx = px - this.firstPosition.x
        let dy = py - this.firstPosition.y
        let img = this.mobile_canvas_img
        switch (this.mobile_canvas_ope) {
            case "ch_scale_left":
                this.prev_img_w -= dx
                this.mobile_img_x += dx
                break
            case "ch_scale_right":
                this.prev_img_w += dx
                break
            case "ch_scale_top":
                this.prev_img_w -= dy * img.width / img.height
                this.mobile_img_y += dy
                break
            case "ch_scale_bottom":
                this.prev_img_w += dy * img.width / img.height
                break
            case "move":
                this.mobile_img_x += dx
                this.mobile_img_y += dy
                break
            case "set":
                break
        }
        this.firstPosition.x = null;
        this.firstPosition.y = null;
    }
    private mobile_canvas_move(px, py) {
        if (this.isDrag == false) {
            let img = this.mobile_canvas_img
            const k = Math.min(this.prev_img_w / 5, 15)
            if (this.mobile_img_x + k < px && px < this.prev_img_w + this.mobile_img_x - k
                && this.mobile_img_y + k < py && py < img.height * this.prev_img_w / img.width + this.mobile_img_y - k) {
                this.mobile_canvas.style.cursor = "move"
            }
            else if (this.prev_img_w + this.mobile_img_x - k < px && px < this.prev_img_w + this.mobile_img_x + k
                && this.mobile_img_y - k < py && py < img.height * this.prev_img_w / img.width + this.mobile_img_y + k) {
                this.mobile_canvas.style.cursor = "ew-resize"
            }
            else if (this.mobile_img_x - k < px && px < this.mobile_img_x + k
                && this.mobile_img_y - k < py && py < img.height * this.prev_img_w / img.width + this.mobile_img_y + k) {
                this.mobile_canvas.style.cursor = "ew-resize"
            }
            else if (this.mobile_img_x < px && px < this.prev_img_w + this.mobile_img_x
                && this.mobile_img_y - k < py && py < this.mobile_img_y + k) {
                this.mobile_canvas.style.cursor = "ns-resize"
            }
            else if (this.mobile_img_x < px && px < this.prev_img_w + this.mobile_img_x
                && img.height * this.prev_img_w / img.width + this.mobile_img_y - k < py
                && py < img.height * this.prev_img_w / img.width + this.mobile_img_y + k) {
                this.mobile_canvas.style.cursor = "ns-resize"
            }
            else {
                this.mobile_canvas_ope = "set"
                this.mobile_canvas.style.cursor = "default"
            }
        }
        else {
            let img = this.mobile_canvas_img
            let dx = px - this.firstPosition.x
            let dy = py - this.firstPosition.y
            let scale
            switch (this.mobile_canvas_ope) {
                case "ch_scale_left":
                    scale = (this.prev_img_w - dx) / img.width
                    this.disp_mobile_img(img, this.mobile_img_x + dx, this.mobile_img_y, scale)
                    break
                case "ch_scale_right":
                    scale = (this.prev_img_w + dx) / img.width
                    this.disp_mobile_img(img, this.mobile_img_x, this.mobile_img_y, scale)
                    break
                case "ch_scale_top":
                    scale = (this.prev_img_w * img.height / img.width - dy) / img.height
                    this.disp_mobile_img(img, this.mobile_img_x, this.mobile_img_y + dy, scale)
                    break
                case "ch_scale_bottom":
                    scale = (this.prev_img_w * img.height / img.width + dy) / img.height
                    this.disp_mobile_img(img, this.mobile_img_x, this.mobile_img_y, scale)
                    break
                case "move":
                    this.disp_mobile_img(img, this.mobile_img_x + dx, this.mobile_img_y + dy)
                    break
            }
        }
    }
    private transfer_mobile_canvase_to_canvas() {
        let img = this.mobile_canvas_img
        this.context.drawImage(img, this.mobile_img_x, this.mobile_img_y,
            this.prev_img_w, img.height * this.prev_img_w / img.width)
        this.remove_mobile_canvas()
        this.canvas_written = true
        this.create_new_canvas()
    }
    private remove_mobile_canvas() {
        this.parent.removeChild(this.mobile_canvas)
        this.mobile_canvas = null
        this.mobile_ctx = null
        this.mobile_canvas_img = null
    }
    private disp_mobile_img(img, x, y, scale?) {
        if (img == undefined) return
        if (scale == undefined) scale = this.prev_img_w / img.width
        let w = Math.floor(img.width * scale), h = Math.floor(img.height * scale)
        this.mobile_ctx.clearRect(0, 0, this.mobile_canvas.width, this.mobile_canvas.height)
        x = Math.floor(x), y = Math.floor(y)
        this.mobile_ctx.drawImage(img, x, y, w, h)
        this.mobile_ctx.beginPath()
        this.mobile_ctx.moveTo(x, y)
        this.mobile_ctx.lineTo(x + w, y)
        this.mobile_ctx.lineTo(x + w, y + h)
        this.mobile_ctx.lineTo(x, y + h)
        this.mobile_ctx.closePath()
        this.mobile_ctx.stroke()
    }
    private change_thickness() {
        const thick_table = [1, 2, 3, 5, 7, 9, 10, 20, 30, 50]
        this.line_thickness = thick_table[this.thickness.value - 1]
        this.thickness_label.innerHTML = "線の太さ：" + this.line_thickness
    }
    private change_bright() {
        this.line_bright = this.bright.value / 10
        this.bright_label.innerHTML = "明度：" + this.line_bright
        this.update_linecolor()
    }
    private change_color(color) {
        this.base_color = color
        this.update_linecolor()
    }
    private toHex(val) {
        val = Math.round(val)
        return ("0" + val.toString(16)).slice(-2)
    }
    private calc_color(val, k) {
        if (k <= 1) return Math.round(val * k)
        else return Math.round(255 * (k - 1) + val * (2 - k))
    }
    private update_linecolor() {
        if (this.base_color == "erase") {
            this.line_color = "erase"
            return
        }
        let c = RGBColor(this.base_color)
        c[0] = this.calc_color(c[0], this.line_bright)
        c[1] = this.calc_color(c[1], this.line_bright)
        c[2] = this.calc_color(c[2], this.line_bright)
        this.line_color = "#" + this.toHex(c[0]) + this.toHex(c[1]) + this.toHex(c[2]) + this.toHex(255)
    }
}