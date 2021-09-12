import { Canvas } from "./canvas"

export class MobileCanvas {
    private canvas: Canvas
    private img
    private angle: number = 0
    private prev_w = 0
    private img_x = 0
    private img_y = 0
    private ope: string = ""
    private isDrag: boolean = false
    private firstPosition = { x: null, y: null };
    public release_flag: boolean = false
    constructor(img, width, private drawInstance, private text?, private font_scale?) {
        this.canvas = new Canvas(this.dragStart, this.dragEnd, this.move)
        const context = this.canvas.context
        context.setLineDash([3, 3]);
        context.lineCap = 'round'; // 丸みを帯びた線にする
        context.lineJoin = 'round'; // 丸みを帯びた線にする
        context.lineWidth = 1; // 線の太さ
        context.strokeStyle = "black"; // 線の色
        this.img = img
        this.prev_w = width
        let scale = this.prev_w / img.width
        this.disp_img(this.img_x = 0, this.img_y = 0, scale)
    }
    public transfer_canvas() {
        let img = this.img
        const w = this.prev_w, h = img.height * this.prev_w / img.width
        const context = this.drawInstance.canvas.context
        context.save()
        context.translate(this.img_x + w / 2, this.img_y + h / 2)
        context.rotate(this.angle * Math.PI / 180)
        context.drawImage(img, -w / 2, -h / 2, w, h)
        context.restore()
        this.canvas.release()
        this.set_draw_info()
        this.drawInstance.canvas_written = true
        this.drawInstance.create_new_canvas()
        this.release_flag = true
    }
    private set_draw_info() {
        if (this.text) {
            const info = {
                mode: "chara",
                points: [this.img_x, this.img_y],
                text: this.text,
                font: this.font_scale,
                scale: this.prev_w / this.img.width,
                rotate: this.angle
            }
            this.drawInstance.canvas.info = info
        }
        else {
            this.drawInstance.canvas.info.mode = "img"
        }
    }
    private disp_img(x, y, scale?, angle = this.angle) {
        const img = this.img
        if (img == undefined) return
        if (scale == undefined) scale = this.prev_w / img.width
        let w = Math.floor(img.width * scale), h = Math.floor(img.height * scale)
        const context = this.canvas.context
        context.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height)
        x = Math.floor(x), y = Math.floor(y)
        context.save()
        context.translate(x + w / 2, y + h / 2)
        context.rotate(angle * Math.PI / 180)
        context.drawImage(img, -w / 2, -h / 2, w, h)
        context.beginPath()
        context.moveTo(-w / 2, -h / 2)
        context.lineTo(w / 2, -h / 2)
        context.lineTo(w / 2, h / 2)
        context.lineTo(-w / 2, h / 2)
        context.closePath()
        context.stroke()
        context.restore()
    }
    private dragStart = (px, py) => {
        this.isDrag = true
        if (this.ope == "set") this.transfer_canvas()
        this.firstPosition.x = px
        this.firstPosition.y = py
    }
    private dragEnd = (px, py) => {
        if (!this.isDrag) return
        this.isDrag = false
        const dx = px - this.firstPosition.x
        const dy = py - this.firstPosition.y
        const img = this.img
        switch (this.ope) {
            case "ch_scale_left":
                this.prev_w -= dx
                this.img_x += dx
                break
            case "ch_scale_right":
                this.prev_w += dx
                break
            case "ch_scale_top":
                this.prev_w -= dy * img.width / img.height
                this.img_y += dy
                break
            case "ch_scale_bottom":
                this.prev_w += dy * img.width / img.height
                break
            case "move":
                this.img_x += dx
                this.img_y += dy
                break
            case "rotate":
                this.angle += this.calc_rotate_angle(px, py, dx, dy)
                break
            case "set":
                break
        }
        this.firstPosition.x = null;
        this.firstPosition.y = null;
    }
    private move = (px, py) => {
        const img = this.img
        const x = this.img_x, y = this.img_y, w = this.prev_w, h = img.height * this.prev_w / img.width
        let a = this.conv(px, py)
        let px2 = a[0], py2 = a[1]
        if (this.isDrag == false) {
            const k = Math.min(Math.min(w / 4, h / 4), 30)
            if (x + k < px && px < w + x - k
                && y + k < py && py < h + y - k) {
                this.ope = "move"
                this.canvas.change_cursor("move")
            }
            else if (x - k < px2 && px2 < w + x + k && y - k < py2 && py2 < h + y + k) {
                if (w + x - k < px2 && px2 < w + x + k && y < py2 && py2 < h + y) {
                    this.ope = "ch_scale_right"
                    this.canvas.change_cursor("ew-resize")
                }
                else if (x - k < px2 && px2 < x + k && y < py2 && py2 < h + y) {
                    this.ope = "ch_scale_left"
                    this.canvas.change_cursor("ew-resize")
                }
                else if (x < px2 && px2 < w + x && y - k < py2 && py2 < y + k) {
                    this.ope = "ch_scale_top"
                    this.canvas.change_cursor("ns-resize")
                }
                else if (x < px2 && px2 < w + x && h + y - k < py2 && py2 < h + y + k) {
                    this.ope = "ch_scale_bottom"
                    this.canvas.change_cursor("ns-resize")
                }
                else {
                    this.ope = "rotate"
                    if ((x < px2) === (y < py2)) {
                        this.canvas.change_cursor("ne-resize")
                    }
                    else this.canvas.change_cursor("nw-resize")
                }
            }
            else {
                this.ope = "set"
                this.canvas.change_cursor("default")
            }
        }
        else {
            const img = this.img
            const dx = px - this.firstPosition.x
            const dy = py - this.firstPosition.y
            let scale
            switch (this.ope) {
                case "ch_scale_left":
                    scale = (w - dx) / img.width
                    this.disp_img(x + dx, y, scale)
                    break
                case "ch_scale_right":
                    scale = (w + dx) / img.width
                    this.disp_img(x, y, scale)
                    break
                case "ch_scale_top":
                    scale = (h - dy) / img.height
                    this.disp_img(x, y + dy, scale)
                    break
                case "ch_scale_bottom":
                    scale = (h + dy) / img.height
                    this.disp_img(x, y, scale)
                    break
                case "rotate":
                    let d_angle = this.calc_rotate_angle(px, py, dx, dy)
                    if (d_angle != 999) this.disp_img(x, y, scale, this.angle + d_angle)
                    break
                case "move":
                    this.disp_img(x + dx, y + dy)
                    break
            }
        }
    }
    private calc_rotate_angle(px, py, dx, dy) {
        const img = this.img, w = this.prev_w, h = img.height * w / img.width, x = this.img_x, y = this.img_y
        const r1 = (x + w / 2 - this.firstPosition.x) * (x + w / 2 - this.firstPosition.x)
            + (y + h / 2 - this.firstPosition.y) * (y + h / 2 - this.firstPosition.y)
        const r2 = (x + w / 2 - px) * (x + w / 2 - px)
            + (y + h / 2 - py) * (y + h / 2 - py)
        if (r1 == 0 || r2 == 0) return 999
        let d_angle = Math.acos((r1 + r2 - dx * dx - dy * dy) / 2 / Math.sqrt(r1 * r2))
        let sign = (x + w / 2 - this.firstPosition.x) * (y + h / 2 - py) > (y + h / 2 - this.firstPosition.y) * (x + w / 2 - px) ? 1 : -1
        return sign * Math.round((d_angle / Math.PI * 180) / 3) * 3
    }
    private conv(px, py) {
        const img = this.img, w = this.prev_w, h = img.height * w / img.width, x = this.img_x, y = this.img_y
        const r = Math.sqrt((x + w / 2 - px) * (x + w / 2 - px) + (y + h / 2 - py) * (y + h / 2 - py))
        const rad = this.angle * Math.PI / 180
        const rad2 = Math.atan2(y + h / 2 - py, x + w / 2 - px)
        return [x + w / 2 - r * Math.cos(rad - rad2), y + h / 2 + r * Math.sin(rad - rad2)]
    }
}