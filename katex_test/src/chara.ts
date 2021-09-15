import { katextext_to_canvas } from "./global"
import { MobileCanvas } from "./mobile_canvas"

const parent = document.getElementById("canvas_parent")
export class Chara {
    private canvas: MobileCanvas
    private loopId
    constructor(html: string, text: string, fontsize: number, drawInstance) {
        const scale = fontsize / 2 * window.devicePixelRatio
        katextext_to_canvas(parent, html, scale, (canvas, W, H) => {
            this.canvas = new MobileCanvas(canvas, W / window.devicePixelRatio, drawInstance, text, scale)
            this.loopId = setInterval(() => {
                if (this.canvas.release_flag) {
                    delete this.canvas
                    clearInterval(this.loopId)
                }
            }, 1000)
        })
    }
    public transfer_canvas() {
        if (this.canvas) {
            this.canvas.transfer_canvas()
            clearInterval(this.loopId)
            delete this.canvas
        }
    }
}