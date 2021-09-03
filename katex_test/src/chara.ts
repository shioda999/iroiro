import html2canvas from "html2canvas"
import { MobileCanvas } from "./mobile_canvas"

export class Chara {
    private parent = document.getElementById("canvas_parent")
    private canvas: MobileCanvas
    constructor(html: string, fontsize: number, drawInstance, release_callback) {
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
            const w = canvas.width / window.devicePixelRatio
            this.canvas = new MobileCanvas(canvas, w, drawInstance, this.release)
            this.parent.removeChild(element)
        })
    }
    private release = () => {
        delete this.canvas
    }
}