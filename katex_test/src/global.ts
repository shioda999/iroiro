import html2canvas from "html2canvas";
import { webkitTextStrokeWidth } from "html2canvas/dist/types/css/property-descriptors/webkit-text-stroke-width";

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
//配列の要素は0以上63以下であることが必要
//wがウィンドウ幅のビット数
//lが連続数のビット数
export function compress_array(array, w = 5, l = 4) {
    const bit = new bitstream()
    for (let i = 0; i < array.length;) {
        let pos = -1
        let len = 0
        for (let j = 0; j < Math.min((1 << w), i); j++) {
            for (let k = 0; k < Math.min(1 << l, array.length - i); k++) {
                if (array[i + k] == array[i - j + k - 1]) {
                    if (len < k) {
                        len = k
                        pos = j
                    }
                }
                else break
            }
        }
        if (len == 0) {
            bit.write(0, 1)
            bit.write(array[i], 6)
            i++
        }
        else {
            bit.write(1, 1)
            bit.write(pos, w)
            bit.write(len, l)
            i += len
        }
    }
    console.log("rate=", bit.get().length / array.length)
    return BASE64.enc(bit.get())
}
export function decompress_array(data, w = 5, l = 4) {
    const bit = new bitstream(BASE64.dec(data))
    let ret = []
    while (1) {
        if (!bit.check(7)) break
        let f = bit.read(1)
        if (f == 0) {
            ret.push(bit.read(6))
        }
        else {
            if (!bit.check(w + l)) break
            let pos = bit.read(w), len = bit.read(l)
            for (let i = 0; i < len; i++)ret.push(ret[ret.length - pos - 1])
        }
    }
    return ret
}
export function compress_function_check() {
    const a = [10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10]
    let b = compress_array(a)
    let c = decompress_array(b)
    console.log(b, c)
    console.log(a.toString() == c.toString())
}
class bitstream {
    private data = []
    private temp = 0
    private pos = 0
    constructor(data?) {
        if (data) this.data = data
    }
    public write(v, bit) {
        v %= (1 << bit)
        this.pos += bit
        if (this.pos >= 6) {
            const k = this.pos - 6
            this.temp += (v >> k)
            this.data.push(this.temp)
            this.temp = (v % (1 << k)) << (6 - k)
            this.pos -= 6
        }
        else {
            this.temp += (v << (6 - this.pos))
        }
    }
    public read(bit) {
        let v = 0
        this.pos += bit
        if (this.pos >= 6) {
            const k = this.pos - 6
            v = this.data[0] % (1 << (bit - k))
            this.data.shift()
            v = (v << k) | this.data[0] >> (6 - k)
            this.pos -= 6
        }
        else {
            v = this.data[0] % (1 << (6 - this.pos + bit))
            v >>= (6 - this.pos)
        }
        return v
    }
    public check(remain) {
        return remain <= this.data.length * 6 - this.pos
    }
    public get() {
        return this.data.concat(this.temp)
    }
}