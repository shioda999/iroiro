import html2canvas from "html2canvas";

export const GRID_W = 20
export const katex_option = {
    strict: false,
    maxSize: 100,
}
export const katex_instance = katex
export const is_PC = isPC()

function isPC() {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
        return false;
    } else {
        return true;
    }
}
export const Global = {
    mode: "text"
}
export function katextext_to_canvas(parent, html, scale, callback) {
    const element = document.createElement("div")
    element.innerHTML = html
    parent.appendChild(element)
    html2canvas(element, { scale: scale, logging: false }).then((canvas) => {
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
        callback(canvas, W, H)
        element.remove()
    })
}