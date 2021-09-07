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
//lzssを使った数列圧縮関数
//配列の要素は0以上4095以下であることが必要
//wがウィンドウ幅のビット数
//11-wが連続数のビット数
export function compress_array(array, w = 4) {
    let ret = ""
    const l = 11 - w
    for (let i = 0; i < array.length;) {
        let pos = -1
        let len = 0
        for (let j = 0; j < Math.min(1 << w, i); j++) {
            for (let k = Math.max(0, 1 - i + j); k < Math.min(1 << l, array.length - i); k++) {
                if (array[i + k] != array[i - j + k - 1]) {
                    if (len < k) {
                        len = k
                        pos = j
                    }
                    break
                }
            }
        }
        let v
        if (len <= 1) {
            v = array[i]
            i++
        }
        else {// len >= 2
            v = 4096 | ((len - 2) << w) | pos
            i += len
        }
        ret += String.fromCharCode(v >> 6)
        ret += String.fromCharCode(v % (1 << 6))
    }
    return btoa(ret)
}
export function decompress_array(data, w = 4) {
    let str = atob(data)
    let ret = []
    for (let i = 0; i < str.length; i += 2) {
        let v = str.charCodeAt(i) << 6 | str.charCodeAt(i + 1)
        if (v < 4096) {
            ret.push(v)
        }
        else {
            let len = ((v - 4096) >> w) + 2
            let p = v % (1 << w)
            console.log(p, len)
            for (let i = 0; i < len; i++) {
                ret.push(ret[ret.length - p - 1])
            }
        }
    }
    return ret
}
/*export function comppress_function_check() {
    const a = [10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10]
    let b = compress_array(a)
    let c = decompress_array(b)
    console.log(b)
    console.log(a.toString() == c.toString())
}*/