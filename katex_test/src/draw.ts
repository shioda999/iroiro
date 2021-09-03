import { Canvas } from "./canvas"
import { GRID_W } from "./global"
import { ManageHistory } from "./managehistory"
import { RGBColor } from "./rgbcolor"

function round(v) {
    return Math.floor((v + GRID_W / 2) / GRID_W) * GRID_W
}
export class Draw {
    private sub_canvas: any = document.getElementById("sub_canvas")
    private sub_ctx = this.sub_canvas.getContext("2d")
    private parent = document.getElementById("draw_canvas")
    public canvas: Canvas
    private isDrag: boolean = false
    public canvas_written: boolean = false
    private canvas_history: ManageHistory
    private line = { thickness: 3, color: "black", base_color: "black", bright: 1, mode: "default" }
    private prevPosition = { x: null, y: null };
    private firstPosition = { x: null, y: null };
    private grid_mode = "no-grid"
    constructor() {
        this.canvas_history = new ManageHistory(this.update_canvases)
        this.set_canvas()
        this.resize_sub_canvas()
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
        this.canvas_history.push(this.canvas)
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
    private dragStart = (px, py) => {
        this.isDrag = true
        this.dragmove(px, py)
    }
    private dragEnd = (px, py) => {
        if (!this.canvas.context) return
        if (this.grid_mode == "no-grid") this.sub_ctx.clearRect(0, 0, this.sub_canvas.width, this.sub_canvas.height)

        this.firstPosition.x = null;
        this.firstPosition.y = null;
        if (this.isDrag && this.line.color != "erase") this.create_new_canvas()
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
        this.prevPosition.x = px;
        this.prevPosition.y = py;
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
    private my_fill(px, py) {
        px = Math.round(px), py = Math.round(py)
        const img = this.get_current_img()
        const dist = this.canvas.context.getImageData(0, 0, this.canvas.canvas.width, this.canvas.canvas.height)
        this.flood_fill(img, dist, px, py, this.get_colorValue())
        this.canvas.context.putImageData(dist, 0, 0)
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