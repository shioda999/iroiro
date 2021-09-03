import { MobileCanvas } from "./mobile_canvas"

export class Img {
    private parent = document.getElementById("draw_canvas")
    private canvas
    constructor(url, drawInstance) {
        const img = new Image()
        img.src = url
        img.onload = () => {
            this.canvas = new MobileCanvas(img, 300, drawInstance)
        }
    }
}