import html2canvas from "html2canvas"
import { MobileCanvas } from "./mobile_canvas"

export class Chara {
    private parent = document.getElementById("draw_canvas")
    private canvas: MobileCanvas
    constructor(html: string, fontsize: number, drawInstance) {
        const element = document.createElement("div")
        element.innerHTML = html
        this.parent.appendChild(element)
        html2canvas(element, { scale: fontsize / 2 * window.devicePixelRatio }).then((canvas) => {
            const ctx = canvas.getContext("2d")
            const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const W = img.width
            const H = img.height
            for (let i = 0; i < W * H; i++) {
                let v = Math.floor((img.data[4 * i] + img.data[4 * i + 1] + img.data[4 * i + 2]) / 3)
                img.data[4 * i + 3] = Math.min((Math.round(255 - v) * 1.5), 255)
            }
            ctx.putImageData(img, 0, 0)
            this.canvas = new MobileCanvas(canvas, canvas.width / window.devicePixelRatio, drawInstance)
            this.parent.removeChild(element)
        })
    }
}