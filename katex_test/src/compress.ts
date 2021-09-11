import { priority_queue } from "./priority_queue"

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
export function lzss_comp(array, w = 3, l = 3) {
    const bit = new bitstream()
    let table = []
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
            table.push([pos, len])
            i += len
        }
    }
    console.log(table)
    console.log("rate=", bit.get().length / array.length)
    return BASE64.enc(bit.get())
}
export function lzss_decomp(data, w = 3, l = 3) {
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
//ランレングス符号
//
export function run_length_comp(array) {
    let ret = [], table = []
    for (let i = 0; i < array.length; i++) {
        if (i && array[i] == array[i - 1]) {
            let c = 0, v = array[i]
            ret.push(v)
            while (i + 1 < array.length && array[i + 1] == v) i++, c++
            while (c >= 63) ret.push(63), c -= 63
            ret.push(c)
            table.push(c)
        }
        else ret.push(array[i])
    }
    console.log(table)
    console.log("rate=", ret.length / array.length)
    return BASE64.enc(ret)
}
export function run_length_decomp(data) {
    let array = BASE64.dec(data)
    let ret = [], f = 1
    for (let i = 0; i < array.length; i++) {
        ret.push(array[i])
        if (f == 0 && array[i] == array[i - 1]) {
            let c = 0, t = array[i++]
            while (array[i] == 63) c += 63, i++
            c += array[i]
            while (c--) ret.push(t)
            f = 1
        }
        else f = 0
    }
    return ret
}
export class huffman {
    public static enc(data, bit_num) {
        let hist = [], codes = [], queue = new priority_queue(), bit = new bitstream(), leaf_num = 0
        for (let i = 0; i < (1 << bit_num); i++)hist[i] = 0
        for (let i = 0; i < data.length; i++)hist[data[i]]++
        for (let i = 0; i < (1 << bit_num); i++)if (hist[i]) queue.insert({ leaf: true, code: i }, hist[i]), leaf_num++
        while (queue.get_size() >= 2) {
            const q1 = queue.pop(), q2 = queue.pop()
            queue.insert({ leaf: false, left: q1.v, right: q2.v }, q1.p + q2.p)
        }
        const node = queue.pop().v
        codes.length = (1 << bit_num)
        this.huffman_build_code(node, 0, 0, codes)
        bit.write(0, 3)
        bit.write(leaf_num, bit_num)
        this.huffman_make_bp(bit, node, bit_num)
        for (let i = 0; i < data.length; i++)bit.write(codes[data[i]].code, codes[data[i]].len)
        const padding = bit.get_padding_size()
        const ret = bit.get()
        ret[0] |= padding << 3
        console.log("rate=", ret.length / data.length)
        return BASE64.enc(ret)
    }
    public static dec(data, bit_num) {
        const bit = new bitstream(BASE64.dec(data)), ret = []
        const padding = bit.read(3), leaf_num = bit.read(bit_num)
        const tree = this.make_tree_by_bp(bit, leaf_num, bit_num)
        let node = tree
        while (bit.check(padding + 1)) {
            let v = bit.read(1)
            if (v == 0) node = node.left
            else node = node.right
            if (node.leaf) {
                ret.push(node.code)
                node = tree
            }
        }
        return ret
    }
    private static huffman_build_code(node, code, len, codes) {
        if (node.leaf) {
            codes[node.code] = { code: code, len: len }
        }
        else {
            this.huffman_build_code(node.left, code << 1, len + 1, codes)
            this.huffman_build_code(node.right, (code << 1) | 1, len + 1, codes)
        }
    }
    private static huffman_make_bp(bit, node, bit_num, flag = false) {
        if (node.leaf) {
            bit.write(1, 1);
            bit.write(node.code, bit_num);
        }
        else {
            if (flag) bit.write(0, 1);
            this.huffman_make_bp(bit, node.left, bit_num, true);
            this.huffman_make_bp(bit, node.right, bit_num, true);
        }
    }
    private static make_tree_by_bp(bit, n, bit_num) {
        let p = 0, nodes = [], tree
        nodes.push(tree = { leaf: false, left: null, right: null });
        while (p < n) {
            let v = bit.read(1), f, nw
            if (v == 1) {
                nw = { code: bit.read(bit_num), leaf: true }
                p++
            }
            else nw = { leaf: false, left: null, right: null }
            do {
                f = 0
                if (!nodes[nodes.length - 1].left) nodes[nodes.length - 1].left = nw
                else if (!nodes[nodes.length - 1].right) nodes[nodes.length - 1].right = nw
                else { f = 1; nodes.pop(); }
            } while (f)
            if (!nw.leaf) nodes.push(nw)
        }
        return tree
    }
}
export function compress_array(data, info: any = {}) {
    if (!info.name) info.name = "huffman"
    if (!info.bit_num) info.bit_num = 6
    switch (info.name) {
        case "lzss":
            return lzss_comp(data)
        case "run_length":
            return run_length_comp(data)
        case "huffman":
            return huffman.enc(data, info.bit_num)
    }
}
export function decompress_array(data, info: any = {}) {
    if (!info.name) info.name = "huffman"
    if (!info.bit_num) info.bit_num = 6
    switch (info.name) {
        case "lzss":
            return lzss_decomp(data)
        case "run_length":
            return run_length_decomp(data)
        case "huffman":
            return huffman.dec(data, info.bit_num)
    }
}
export function compress_function_check(a?) {
    if (!a) a = [10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10, 10, 10, 30, 40, 10]
    let b = compress_array(a)
    let c = decompress_array(b)
    console.log(b, c)
    console.log(a.toString() == c.toString())
}
export function compress_function_check2(k = 10) {
    compress_function_check()
    for (let _i = 0; _i < k; _i++) {
        let num = [0]
        for (let i = 0; i < 1000; i++) {
            let d = 0, v = Math.round(Math.random() * 100)
            if (v <= 95) d = 0
            else d = 100 - v
            num.push((num[num.length - 1] + d) % 64)
        }
        compress_function_check(num)
    }
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
            let k = this.pos - 6
            this.temp += (v >> k)
            this.data.push(this.temp)
            while (k >= 6) {
                k -= 6
                this.data.push((v >> k) % 64)
            }
            this.temp = (v % (1 << k)) << (6 - k)
            this.pos = k
        }
        else {
            this.temp += (v << (6 - this.pos))
        }
    }
    public read(bit) {
        let v = 0
        this.pos += bit
        if (this.pos >= 6) {
            let k = this.pos - 6
            v = (this.data[0] % (1 << (bit - k))) << k
            this.data.shift()
            while (k >= 6) {
                k -= 6
                v |= this.data[0] << k
                this.data.shift()
            }
            v |= this.data[0] >> (6 - k)
            this.pos = k
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
        if (this.get_padding_size() == 0) return this.data.concat()
        else return this.data.concat(this.temp)
    }
    public get_padding_size() {
        return (6 - this.pos) % 6
    }
}