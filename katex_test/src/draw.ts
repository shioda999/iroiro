import { Canvas } from "./canvas"
import { compress_array, decompress_array } from "./compress"
import { GRID_W, katextext_to_canvas, katex_instance, katex_option } from "./global"
import { ManageHistory } from "./managehistory"
import { RGBColor } from "./rgbcolor"

const upload_form: any = document.getElementById("upload_save_data_button")
const render_text_event = new CustomEvent("my_event_render_text")
function round(v) {
    return Math.floor((v + GRID_W / 2) / GRID_W) * GRID_W
}
export class Draw {
    private reader = new FileReader()
    private sub_canvas: any = document.getElementById("sub_canvas")
    private sub_ctx = this.sub_canvas.getContext("2d")
    private parent = document.getElementById("canvas_parent")
    public canvas: Canvas
    private isDrag: boolean = false
    public canvas_written: boolean = false
    private canvas_history: ManageHistory
    private line = { thickness: 3, color: "black", base_color: "black", bright: 1, mode: "default" }
    private prevPosition = { x: null, y: null };
    private firstPosition = { x: null, y: null };
    private grid_mode = "no-grid"
    private points
    private history_flag: boolean = true
    private temp = []
    constructor() {
        this.canvas_history = new ManageHistory(this.update_canvases)
        this.setEvents()
        this.set_canvas()
        this.resize_sub_canvas()
    }
    private setEvents() {
        window.addEventListener("my_event_delete_history", this.delete_history)
        window.addEventListener("my_event_save_data_to_storage", this.save_data_to_storage)
        window.addEventListener("my_event_load_data_from_storage", this.load_data_from_storage)
        window.addEventListener("my_event_save_data_to_file", this.save_data_to_file)
        window.addEventListener("my_event_load_data_from_file", this.load_data_from_file)
        upload_form.onchange = () => {
            if (upload_form.files[0]) this.reader.readAsText(upload_form.files[0])
        }
        this.reader.onload = () => {
            if (typeof (this.reader.result) !== "string") return
            let data = JSON.parse(this.reader.result)
            this.create_canvases_from_data(data)
        }
    }
    private delete_history = () => {
        this.canvas_history.delete_history()
    }
    private save_data_to_storage = () => {
        const json = JSON.stringify(this.get_canvas_data())
        localStorage.setItem("data", json)
    }
    private load_data_from_storage = () => {
        const json = localStorage.getItem("data")
        if (!json) return
        const data = JSON.parse(json)
        this.create_canvases_from_data(data)
    }
    private save_data_to_file = () => {
        let name = prompt("ファイル名を入力してください", "render.json")
        if (name == null) return
        const json = JSON.stringify(this.get_canvas_data())
        let blob = new Blob([json], { type: 'application/json' })
        let anchor = document.createElement("a")
        anchor.hidden = true
        anchor.href = window.URL.createObjectURL(blob)
        anchor.download = name
        anchor.click()
        anchor.remove()
    }
    private load_data_from_file = () => {
        upload_form.click()
    }
    private get_canvas_data() {
        let data = {}
        const menu = document.getElementById("floating_menu")
        const textarea: any = document.getElementById("textarea")
        const range: any = menu.children["move"]
        const font_size: any = menu.children["font_size"]
        data[0] = { text: textarea.value, grid: this.grid_mode, font: font_size.value, text_form_left: range.value }
        this.canvas_history.get().forEach((c, i) => {
            if (c.info.mode == "img") {
                let str = c.canvas.toDataURL("image/webp", "0.5")
                data[i + 1] = { mode: "img", url: str }
            }
            else if (c.info.mode == "fill") {
                let contour = this.make_contour(c)
                data[i + 1] = { mode: "fill", contour: contour, points: c.info.points, width: c.canvas.width, height: c.canvas.height, color: c.info.color }
            }
            else if (c.info.mode == "default") {
                this.compress_trace(c)
                data[i + 1] = Object.assign({}, c.info)
                data[i + 1].points = data[i + 1].points.concat()
                data[i + 1].points.length = 2
            }
            else {
                data[i + 1] = c.info
            }
        })
        console.log(data)
        return data
    }
    private create_canvases_from_data(data) {
        const line_temp = Object.assign({}, this.line)
        this.erase_all_canvas()
        this.history_flag = false
        for (let i in data) {
            const e = data[i]
            if (!e.mode) {
                const menu = document.getElementById("floating_menu")
                const textarea: any = document.getElementById("textarea")
                const range: any = menu.children["move"]
                const font_size: any = menu.children["font_size"]
                textarea.value = e.text
                range.value = e.text_form_left
                font_size.value = e.font
                window.dispatchEvent(render_text_event)
                this.change_grid_mode(e.grid)
            }
            else if (e.mode == "img") {
                const img = new Image()
                const ctx = this.canvas.context
                this.canvas.info.mode = "img"
                img.src = e.url
                img.onload = () => ctx.drawImage(img, 0, 0)
                this.canvas_written = true
                this.create_new_canvas()
            }
            else if (e.mode == "chara") {
                const html = katex_instance.renderToString(e.text, katex_option)
                const ctx = this.canvas.context
                this.canvas.info = Object.assign({}, e)
                katextext_to_canvas(this.parent, html, e.font, (canvas, W, H) => {
                    ctx.save()
                    ctx.translate(e.points[0] + W * e.scale / 2, e.points[1] + H * e.scale / 2)
                    ctx.rotate(e.rotate * Math.PI / 180)
                    ctx.drawImage(canvas, -W * e.scale / 2, -H * e.scale / 2, W * e.scale, H * e.scale)
                    ctx.restore()
                })
                this.canvas_written = true
                this.create_new_canvas()
            }
            else if (e.mode == "fill") {
                const img = new ImageData(e.width, e.height)
                const c = RGBColor(e.color)
                this.disp_contour(img, e.contour, c)
                this.line.color = e.color
                this.my_fill(e.points[0], e.points[1], img)
                this.canvas.info = Object.assign({}, e)
                this.canvas_written = true
                this.create_new_canvas()
            }
            else {
                if (e.mode == "default") {
                    this.decompress_trace(e)
                }
                this.line.mode = e.mode
                this.line.color = e.color
                this.line.thickness = e.thick
                let px, py
                this.dragStart(px = e.points[0], py = e.points[1])
                for (let i = 2; i < e.points.length; i += 2) {
                    px += e.points[i], py += e.points[i + 1]
                    this.dragmove(px, py)
                }
                this.dragEnd(px, py)
            }
        }
        this.history_flag = true
        this.canvas_history.push(this.temp)
        this.temp = []
        this.line = line_temp
    }
    public resize() {
        this.canvas.resize()
        this.resize_sub_canvas()
    }
    private set_canvas() {
        this.canvas = new Canvas(this.dragStart, this.dragEnd, this.dragmove)
    }
    public create_new_canvas() {
        if (!this.canvas_written) return
        this.canvas_written = false
        if (this.history_flag) this.canvas_history.push(this.canvas)
        else this.temp.push(this.canvas)
        this.set_canvas()
    }
    public change_grid_mode(mode) {
        this.grid_mode = mode
        this.draw_grid()
    }
    public change_line_mode(mode) {
        this.line.mode = mode
    }
    public erase_all_canvas() {
        this.canvas_history.erase_all()
    }
    public erase_canvas(i) {
        this.canvas_history.erase_byid(i)
    }
    public undo() {
        this.canvas_history.undo()
    }
    public redo() {
        this.canvas_history.redo()
    }
    private update_canvases = (prev, now) => {
        let rm = prev.filter(i => now.indexOf(i) == -1)
        let ad = now.filter(i => prev.indexOf(i) == -1)
        rm.forEach((e) => this.parent.removeChild(e.canvas))
        ad.forEach((e) => this.parent.appendChild(e.canvas))
    }
    private erase(x, y) {
        if (!this.isDrag) {
            return;
        }
        const k = 2
        const dx = [0, k, 0, -k, 0], dy = [0, 0, k, 0, -k]
        const canvases = this.canvas_history.get()
        for (let i = canvases.length - 1; i >= 0; i--) {
            const context = canvases[i].canvas.getContext("2d")
            for (let j = 0; j < 5; j++) {
                const color = context.getImageData(x + dx[j], y + dy[j], 1, 1).data
                if (color[0] != 0 || color[1] != 0 || color[2] != 0 || color[3] != 0) {
                    this.erase_canvas([i])
                    return
                }
            }
        }
    }
    private get_current_img() {
        let new_canvas = document.createElement("canvas")
        new_canvas.width = this.canvas.canvas.width
        new_canvas.height = this.canvas.canvas.height
        let ctx = new_canvas.getContext("2d")
        this.canvas_history.get().forEach((c) => {
            ctx.drawImage(c.canvas, 0, 0, c.canvas.width, c.canvas.height)
        })
        return ctx.getImageData(0, 0, this.canvas.canvas.width, this.canvas.canvas.height)
    }
    private get_colorValue() {
        const c = this.line.color
        return [c.slice(1, 3), c.slice(3, 5), c.slice(5, 7), c.slice(7, 9)].map(function (str) {
            return parseInt(str, 16);
        });
    }
    private set_draw_info() {
        this.canvas.info = {
            color: this.line.color,
            mode: this.line.mode,
            thick: this.line.thickness,
            points: this.points
        }
    }
    private dragStart = (px, py) => {
        this.isDrag = true
        this.points = [px, py]
        this.dragmove(px, py)
    }
    private dragEnd = (px, py) => {
        if (!this.canvas.context) return
        if (this.grid_mode == "no-grid") this.sub_ctx.clearRect(0, 0, this.sub_canvas.width, this.sub_canvas.height)
        if (this.isDrag && this.line.color != "erase") {
            if (this.line.mode != "default" && this.line.mode != "fill")
                this.points.push(px - this.firstPosition.x, py - this.firstPosition.y)
            this.set_draw_info()
            this.create_new_canvas()
        }
        this.firstPosition.x = null
        this.firstPosition.y = null
        this.isDrag = false
    }
    // 絵を書く
    private dragmove = (px, py) => {
        if (!this.isDrag) {
            return;
        }
        if (this.line.color == "erase") {
            this.erase(px, py)
            return
        }
        if (this.line.mode == "fill") {
            if (this.firstPosition.x === null || this.firstPosition.y === null) this.my_fill(px, py)
            this.firstPosition.x = px
            this.firstPosition.y = py
            return
        }
        const context = this.canvas.context
        if (this.firstPosition.x === null || this.firstPosition.y === null) {
            // ドラッグ開始時の線の開始位置
            this.firstPosition.x = this.prevPosition.x = px
            this.firstPosition.y = this.prevPosition.y = py
            context.lineCap = 'round'; // 丸みを帯びた線にする
            context.lineJoin = 'round'; // 丸みを帯びた線にする
            context.lineWidth = this.line.thickness; // 線の太さ
            context.strokeStyle = this.line.color; // 線の色
            context.fillStyle = this.line.color; // 線の色
            if (this.line.mode == "default") {
                context.beginPath();
            }
            if (this.line.mode == "alpha_rectangle") {
                context.fillStyle = context.fillStyle.substring(0, 7) + "50"
            }
        }
        if (this.line.mode == "default") {
            if (this.canvas_written && this.prevPosition.x == px && this.prevPosition.y == py) return
            if (this.canvas_written) {
                const k = 30
                if (px - this.prevPosition.x > k) px = this.prevPosition.x + k
                if (py - this.prevPosition.y > k) py = this.prevPosition.y + k
                if (px - this.prevPosition.x < -k) px = this.prevPosition.x - k
                if (py - this.prevPosition.y < -k) py = this.prevPosition.y - k
                this.points.push(px - this.prevPosition.x, py - this.prevPosition.y)
            }
            context.moveTo(this.prevPosition.x, this.prevPosition.y);
            context.lineTo(px, py);
            context.stroke();
            this.canvas_written = true
        }
        else {
            let first_x, first_y, cur_x, cur_y, prev_x, prev_y
            first_x = round(this.firstPosition.x), first_y = round(this.firstPosition.y)
            prev_x = round(this.prevPosition.x), prev_y = round(this.prevPosition.y)
            cur_x = round(px), cur_y = round(py)
            if (prev_x == cur_x && prev_y == cur_y) return
            switch (this.line.mode) {
                case "straight":
                    this.canvas.clear()
                    if (first_x == cur_x && first_y == cur_y) { this.canvas_written = false; return }
                    else this.canvas_written = true
                    context.beginPath();
                    context.moveTo(first_x, first_y);
                    context.lineTo(cur_x, cur_y);
                    context.stroke();

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
                    this.canvas.clear()
                    if (first_x == cur_x || first_y == cur_y) { this.canvas_written = false; return }
                    else this.canvas_written = true
                    context.beginPath();
                    context.moveTo(first_x, first_y)
                    context.lineTo(first_x, cur_y)
                    context.lineTo(cur_x, cur_y)
                    context.lineTo(cur_x, first_y)
                    context.closePath()
                    if (this.line.mode == "rectangle") context.stroke()
                    else context.fillRect(first_x, first_y, cur_x - first_x, cur_y - first_y);
                    break
                case "circle":
                case "fill_circle":
                    this.canvas.clear()
                    let radius = Math.sqrt((first_x - cur_x) * (first_x - cur_x) + (first_y - cur_y) * (first_y - cur_y))
                    if (first_x == cur_x && first_y == cur_y || radius == 0) { this.canvas_written = false; return }
                    else this.canvas_written = true
                    context.beginPath();
                    context.arc(first_x, first_y, radius,
                        0, 2 * Math.PI, false)
                    context.moveTo(first_x, first_y + 1)
                    context.arc(first_x, first_y, 1,
                        0, 2 * Math.PI, false)
                    if (this.line.mode == "fill_circle") context.fill()
                    else context.stroke()
                    break
                case "arrow":
                    this.canvas.clear()
                    if (first_x == cur_x && first_y == cur_y) { this.canvas_written = false; return }
                    else this.canvas_written = true
                    context.beginPath();
                    let w = cur_x - first_x, h = cur_y - first_y, aw = 0, ah = 0
                    const k = [3, 8, 13, 25, 50, 80]
                    if (Math.abs(first_x - cur_x) >= Math.abs(first_y - cur_y)) {
                        h = k[Math.min(Math.floor(Math.abs(h) / 10), k.length - 1)]
                        aw = h + 10
                        ah = (Math.abs(aw) + 10) * (w / Math.abs(w))
                        context.moveTo(first_x + w, first_y)
                        context.lineTo(first_x + w - ah / 2, first_y - aw / 2)
                        context.lineTo(first_x + w - ah / 2, first_y - h / 3)
                        context.lineTo(first_x, first_y - h / 3)
                        context.lineTo(first_x, first_y + h / 3)
                        context.lineTo(first_x + w - ah / 2, first_y + h / 3)
                        context.lineTo(first_x + w - ah / 2, first_y + aw / 2)
                        context.closePath()
                    }
                    else {
                        w = k[Math.min(Math.floor(Math.abs(w) / 10), k.length - 1)]
                        aw = w + 10
                        ah = (Math.abs(aw) + 10) * (h / Math.abs(h))
                        context.moveTo(first_x, first_y + h)
                        context.lineTo(first_x - aw / 2, first_y + h - ah / 2)
                        context.lineTo(first_x - w / 3, first_y + h - ah / 2)
                        context.lineTo(first_x - w / 3, first_y)
                        context.lineTo(first_x + w / 3, first_y)
                        context.lineTo(first_x + w / 3, first_y + h - ah / 2)
                        context.lineTo(first_x + aw / 2, first_y + h - ah / 2)
                        context.closePath()
                    }
                    context.fill()
                    break
            }
        }
        this.prevPosition.x = px
        this.prevPosition.y = py
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
        let points = [W * py + px]
        while (points.length) {
            let p = points.pop()
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
                points.push(nxp)
            }
        }
    }
    private my_fill(px, py, img?) {
        px = Math.round(px), py = Math.round(py)
        if (!img) img = this.get_current_img()
        const dist = this.canvas.context.getImageData(0, 0, img.width, img.height)
        this.flood_fill(img, dist, px, py, this.get_colorValue())
        this.canvas.context.putImageData(dist, 0, 0)
    }
    private make_contour(canvas: Canvas) {
        const img = canvas.context.getImageData(0, 0, this.canvas.canvas.width, this.canvas.canvas.height)
        let px = canvas.info.points[0], py = canvas.info.points[1]
        const W = img.width, H = img.height
        const tr = img.data[(W * py + px) * 4]
        const tg = img.data[(W * py + px) * 4 + 1]
        const tb = img.data[(W * py + px) * 4 + 2]
        const ta = img.data[(W * py + px) * 4 + 3]
        const dx4 = [-1, 1, 0, 0], dy4 = [0, 0, -1, 1]
        const dx = [1, 1, 0, -1, -1, -1, 0, 1], dy = [0, -1, -1, -1, 0, 1, 1, 1]
        canvas.info.points.length = 2
        let list = [], points = new Array(W * H)
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const p = W * y + x
                if (img.data[p * 4] == tr && img.data[p * 4 + 1] == tg
                    && img.data[p * 4 + 2] == tb && img.data[p * 4 + 3] == ta) continue
                for (let i = 0; i < 4; i++) {
                    let tx = x + dx4[i], ty = y + dy4[i]
                    let nxp = W * ty + tx
                    if (tx < 0 || tx >= W || ty < 0 || ty >= H) continue
                    if (img.data[nxp * 4] == tr && img.data[nxp * 4 + 1] == tg
                        && img.data[nxp * 4 + 2] == tb && img.data[nxp * 4 + 3] == ta) {
                        points[p] = 1
                        break
                    }
                }
            }
        }
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                let px = x, py = y
                if (points[y * W + x] == 1) {
                    let prev = 0
                    if (list.length) list.push(4)
                    list.push((x >> 9) % 8)
                    list.push((x >> 6) % 8)
                    list.push((x >> 3) % 8)
                    list.push(x % 8)
                    list.push((y >> 9) % 8)
                    list.push((y >> 6) % 8)
                    list.push((y >> 3) % 8)
                    list.push(y % 8)
                    points[y * W + x] = 0
                    while (1) {
                        let ok = false
                        for (let _i = 0; _i < 7; _i++) {
                            let i = (prev + 5 + _i) % 8
                            let tx = px + dx[i], ty = py + dy[i]
                            let nxp = W * ty + tx
                            if (tx < 0 || tx >= W || ty < 0 || ty >= H) continue
                            if (points[nxp] == 1) {
                                points[nxp] = 0
                                list.push((i + 8 - prev) % 8)
                                if ((i + 8 - prev) % 8 == 4) console.log("!!!!!!!!!!!!!!")
                                prev = i
                                px = tx, py = ty
                                ok = true
                                break
                            }
                        }
                        if (!ok) break
                    }
                }
            }
        }
        const ret = compress_array(list, { bit_num: 6 })
        return ret
    }
    private disp_contour(img, contour, color) {
        const dx = [1, 1, 0, -1, -1, -1, 0, 1], dy = [0, -1, -1, -1, 0, 1, 1, 1]
        const c = decompress_array(contour, { bit_num: 6 })
        let x, y, f = 1, prev = -1
        for (let i = 0; i < c.length; i++) {
            if (f) {
                let v = 0
                for (let j = 0; j < 4; j++) {
                    v <<= 3
                    v += c[j + i]
                }
                x = v, v = 0
                for (let j = 4; j < 8; j++) {
                    v <<= 3
                    v += c[j + i]
                }
                y = v
                i += 7
                f = 0
                const p = y * img.width + x
                img.data[p * 4] = color[0]
                img.data[p * 4 + 1] = color[1]
                img.data[p * 4 + 2] = color[2]
                img.data[p * 4 + 3] = color[3]
                prev = -1
            }
            else {
                if (c[i] == 4 && prev >= 0) {
                    f = 1
                }
                else {
                    if (prev < 0) prev = 0
                    x += dx[(c[i] + prev) % 8], y += dy[(c[i] + prev) % 8]
                    const p = y * img.width + x
                    img.data[p * 4] = color[0]
                    img.data[p * 4 + 1] = color[1]
                    img.data[p * 4 + 2] = color[2]
                    img.data[p * 4 + 3] = color[3]
                    prev = (c[i] + prev) % 8
                }
            }
        }
    }
    private compress_trace(c) {
        const points = c.info.points
        if (points.length <= 2) {
            c.info["comp"] = []
            return
        }
        const dx = [points[2] + 30], dy = [points[3] + 30]
        for (let i = 4; i < points.length; i += 2) {
            dx.push(points[i] - points[i - 2] + 30)
            dy.push(points[i + 1] - points[i - 1] + 30)
        }
        c.info["comp"] = compress_array(dx.concat(dy))
    }
    private decompress_trace(e) {
        let v = decompress_array(e.comp)
        let len = v.length >> 1, p1 = 0, p2 = 0
        for (let i = 0; i < len; i++) {
            e.points.push(p1 + v[i] - 30, p2 + v[len + i] - 30)
            p1 += v[i] - 30, p2 += v[len + i] - 30
        }
    }
    public change_thickness(value) {
        const thick_table = [1, 2, 3, 5, 7, 9, 10, 20, 30, 50]
        this.line.thickness = thick_table[value - 1]
        return "線の太さ：" + this.line.thickness
    }
    public change_bright(value) {
        this.line.bright = value / 10
        this.update_linecolor()
        return "明度：" + this.line.bright
    }
    public change_color(color) {
        this.line.base_color = color
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
        if (this.line.base_color == "erase") {
            this.line.color = "erase"
            return
        }
        let c = RGBColor(this.line.base_color)
        c[0] = this.calc_color(c[0], this.line.bright)
        c[1] = this.calc_color(c[1], this.line.bright)
        c[2] = this.calc_color(c[2], this.line.bright)
        this.line.color = "#" + this.toHex(c[0]) + this.toHex(c[1]) + this.toHex(c[2]) + this.toHex(255)
    }
    private resize_sub_canvas() {
        this.sub_canvas.width = document.documentElement.scrollWidth - 30;
        this.sub_canvas.height = document.documentElement.scrollHeight;
        this.sub_canvas.style["pointer-events"] = "none"
        this.sub_ctx = this.sub_canvas.getContext("2d")
        this.draw_grid()
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
}