import { MobileCanvas } from "./mobile_canvas"

export class Img {
    private canvas: MobileCanvas
    private loopId
    constructor(url, drawInstance) {
        const img = new Image()
        img.src = url
        img.onload = () => {
            this.canvas = new MobileCanvas(img, 300, drawInstance)
        }
        this.loopId = setInterval(() => {
            if (this.canvas.release_flag) {
                delete this.canvas
                clearInterval(this.loopId)
            }
        }, 1000)
    }
    public transfer_canvas() {
        if (this.canvas) {
            this.canvas.transfer_canvas()
            clearInterval(this.loopId)
            delete this.canvas
        }
    }
}