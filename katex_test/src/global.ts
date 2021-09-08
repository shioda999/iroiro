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

export class BASE64 {
    private static table: string[] = []
    private static inv_t = {}
    private static make_table() {
        for (let i = 65; i < 91; i++) this.table.push(String.fromCharCode(i))
        for (let i = 97; i < 123; i++) this.table.push(String.fromCharCode(i))
        for (let i = 0; i < 10; i++) this.table.push(i.toString(10))
        this.table.push("+");
        this.table.push("/");
        for (let i = 0; i < 64; i++) {
            this.inv_t[this.table[i]] = i
        }
    }
    public static enc(num: number[]) {
        if (this.table.length == 0) this.make_table()
        let ret = ""
        num.forEach(n => {
            if (this.table[n] == undefined) console.log("!!!!", n)
            ret += this.table[n]
        })
        return ret
    }
    public static dec(str: string) {
        if (this.table.length == 0) this.make_table()
        let ret = []
        for (let i = 0; i < str.length; i++)ret.push(this.inv_t[str[i]])
        return ret
    }
}
//lzssを使った数列圧縮関数
//配列の要素は0以上2047以下であることが必要
//wがウィンドウ幅のビット数
//11-wが連続数のビット数
export function compress_array(array, w = 6) {
    let ret = []
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
            v = 2048 | ((len - 2) << w) | pos
            i += len
        }
        ret.push(v >> 6)
        ret.push(v % (1 << 6))
    }
    console.log(array.length, ret.length)
    return BASE64.enc(ret)
}
export function decompress_array(data, w = 6) {
    let num = BASE64.dec(data)
    let ret = []
    for (let i = 0; i < num.length; i += 2) {
        let v = num[i] << 6 | num[i + 1]
        if (v < 2048) {
            ret.push(v)
        }
        else {
            let len = ((v - 2048) >> w) + 2
            let p = v % (1 << w)
            for (let i = 0; i < len; i++) {
                ret.push(ret[ret.length - p - 1])
            }
        }
    }
    return ret
}
export function comppress_function_check() {
    const a = [10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10]
    let b = compress_array(a)
    let c = decompress_array(b)
    console.log(b)
    console.log(a.toString() == c.toString())
}