import { MobileCanvas } from "./mobile_canvas"

export class Img {
    private canvas
    constructor(url, drawInstance, release_callback) {
        const img = new Image()
        img.src = url
        img.onload = () => {
            this.canvas = new MobileCanvas(img, 300, drawInstance, this.release)
        }
    }
    private release = () => {
        delete this.canvas
    }
}