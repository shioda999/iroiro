import { Canvas } from "./canvas"

export class MobileCanvas {
    private canvas: Canvas
    private img
    private prev_w = 0
    private img_x = 0
    private img_y = 0
    private ope: string = ""
    private isDrag: boolean = false
    private firstPosition = { x: null, y: null };
    constructor(img, width, private drawInstance) {
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
        const context = this.drawInstance.canvas.context
        context.drawImage(img, this.img_x, this.img_y,
            this.prev_w, img.height * this.prev_w / img.width)
        this.canvas.release()
        this.drawInstance.canvas_written = true
        this.drawInstance.create_new_canvas()
    }
    private disp_img(x, y, scale?) {
        const img = this.img
        if (img == undefined) return
        if (scale == undefined) scale = this.prev_w / img.width
        let w = Math.floor(img.width * scale), h = Math.floor(img.height * scale)
        const context = this.canvas.context
        context.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height)
        x = Math.floor(x), y = Math.floor(y)
        context.drawImage(img, x, y, w, h)
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x + w, y)
        context.lineTo(x + w, y + h)
        context.lineTo(x, y + h)
        context.closePath()
        context.stroke()
    }
    private dragStart = (px, py) => {
        this.isDrag = true
        const img = this.img
        const prev_w = this.prev_w
        const x = this.img_x
        const y = this.img_y
        const k = Math.min(this.prev_w / 5, 15)
        if (x + k < px && px < prev_w + x - k
            && y + k < py && py < img.height * prev_w / img.width + y - k) {
            this.ope = "move"
        }
        else if (prev_w + x - k < px && px < prev_w + x + k
            && y - k < py && py < img.height * prev_w / img.width + y + k) {
            this.ope = "ch_scale_right"
        }
        else if (x - k < px && px < x + k
            && y - k < py && py < img.height * prev_w / img.width + y + k) {
            this.ope = "ch_scale_left"
        }
        else if (x < px && px < prev_w + x
            && y - k < py && py < y + k) {
            this.ope = "ch_scale_top"
        }
        else if (x < px && px < prev_w + x
            && img.height * prev_w / img.width + y - k < py
            && py < img.height * prev_w / img.width + y + k) {
            this.ope = "ch_scale_bottom"
        }
        else {
            this.ope = "set"
            this.transfer_canvas()
        }
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
            case "set":
                break
        }
        this.firstPosition.x = null;
        this.firstPosition.y = null;
    }
    private move = (px, py) => {
        const prev_w = this.prev_w
        const x = this.img_x
        const y = this.img_y
        if (this.isDrag == false) {
            let img = this.img
            const k = Math.min(prev_w / 5, 15)
            if (x + k < px && px < prev_w + x - k
                && y + k < py && py < img.height * prev_w / img.width + y - k) {
                this.canvas.change_cursor("move")
            }
            else if (prev_w + x - k < px && px < prev_w + x + k
                && y - k < py && py < img.height * prev_w / img.width + y + k) {
                this.canvas.change_cursor("ew-resize")
            }
            else if (x - k < px && px < x + k
                && y - k < py && py < img.height * prev_w / img.width + y + k) {
                this.canvas.change_cursor("ew-resize")
            }
            else if (x < px && px < prev_w + x
                && y - k < py && py < y + k) {
                this.canvas.change_cursor("ns-resize")
            }
            else if (x < px && px < prev_w + x
                && img.height * prev_w / img.width + y - k < py
                && py < img.height * prev_w / img.width + y + k) {
                this.canvas.change_cursor("ns-resize")
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
                    scale = (prev_w - dx) / img.width
                    this.disp_img(x + dx, y, scale)
                    break
                case "ch_scale_right":
                    scale = (prev_w + dx) / img.width
                    this.disp_img(x, y, scale)
                    break
                case "ch_scale_top":
                    scale = (prev_w * img.height / img.width - dy) / img.height
                    this.disp_img(x, y + dy, scale)
                    break
                case "ch_scale_bottom":
                    scale = (prev_w * img.height / img.width + dy) / img.height
                    this.disp_img(x, y, scale)
                    break
                case "move":
                    this.disp_img(x + dx, y + dy)
                    break
            }
        }
    }
}