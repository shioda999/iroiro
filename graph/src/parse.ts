export interface OperatorType {
    back?: boolean
    priority?: number
    calc?: () => any
    type: string
    param?: number
}
const default_reserved = {
    "+": { priority: 3, type: "ope", calc: (p1, p2) => p1 + p2 },
    "-": { priority: 4, type: "ope", calc: (p1, p2) => p1 - p2 },
    "*": { priority: 1, type: "ope", calc: (p1, p2) => p1 * p2 },
    "/": { priority: 2, type: "ope", calc: (p1, p2) => p1 / p2  },
    ".": { priority: 0, type: "ope", back: true, calc: (p1, p2) => p1 * p2  },
    "^": { priority: -1, type: "ope", back: true, calc: (p1, p2) => Math.pow(p1, p2) },
    "pi": { priority: 0, type: "const", value: Math.PI  },
    "e": { priority: 0, type: "const", value: Math.E },
    "\%": { priority: 0, type: "func", back: true, calc: (p) => p * 0.01 },
    "_-": { priority: 0, type: "func", back: true, calc: (p) => -p },
    "sin": { priority: 0, type: "func", back: true, calc: (p: number[]) => Math.sin(p[0])},
    "cos": { priority: 0, type: "func", back: true, calc: (p: number[]) => Math.cos(p[0]) },
    "tan": { priority: 0, type: "func", back: true, calc: (p: number[]) => Math.tan(p[0]) },
    "arcsin": { priority: 0, type: "func", back: true, calc: (p: number[]) => Math.asin(p[0])},
    "arccos": { priority: 0, type: "func", back: true, calc: (p: number[]) => Math.acos(p[0]) },
    "arctan": { priority: 0, type: "func", back: true, calc: (p: number[]) => Math.atan(p[0]) },
    "sin^": { priority: 0, type: "func", back: true, param: 2, calc: (p: number[]) => Math.pow(Math.sin(p[0]), p[1])},
    "cos^": { priority: 0, type: "func", back: true, param: 2, calc: (p: number[]) => Math.pow(Math.cos(p[0]), p[1])},
    "tan^": { priority: 0, type: "func", back: true, param: 2, calc: (p: number[]) => Math.pow(Math.tan(p[0]), p[1])},
    "log_": { priority: 0, type: "func", back: true, param: 2, calc: (p: number[]) => Math.log(p[0])/Math.log(p[1])},
    "log": { priority: 0, type: "func", back: true, calc: (p: number[]) => Math.log(p[0]) },
    "log2": { priority: 0, type: "func", back: true, calc: (p: number[]) => Math.log(p[0])/Math.log(2.0) },
    "log10": { priority: 0, type: "func", back: true, calc: (p: number[]) => Math.log(p[0])/Math.log(10.0) },
    "(": { priority: 0, type: "brackets"},
    ")": { priority: 0, type: "brackets"}
}
export class Parse{
    private static reserved = default_reserved
    public static parse(str) {
        let data = this.split(str)
        data = this.sort_by_priority(data)
        return data
    }
    private static sort_by_priority(data: string[], s = 0, e = data.length) {
        let r: string[] = [], ope: string[] = []
        for (let i = s; i < e; i++){
            if (data[i] === "(") {
                let nest = 1, i2
                for (i2 = i + 1; i2 < e; i2++){
                    if (data[i2] === "(") nest++
                    if (data[i2] === ")") {
                        nest--
                        if(nest == 0)break
                    }
                }
                let add = this.sort_by_priority(data, i + 1, i2)
                add.forEach(e => r.push(e))
                i = i2
                continue;
            }
            if (!this.reserved[data[i]] || this.reserved[data[i]] && this.reserved[data[i]].type === "const") {
                r.push(data[i])
            }
            else {
                while (ope.length > 0 && this.reserved[ope[ope.length - 1]].priority <= this.reserved[data[i]].priority) {
                    if(this.reserved[ope[ope.length - 1]].priority == this.reserved[data[i]].priority && this.reserved[ope[ope.length - 1]].back)break
                    r.push(ope.pop())
                }
                ope.push(data[i])
            }
        }
        ope = ope.reverse()
        return r.concat(ope)
    }
    private static str_check(str: string, offset: number, str2: string): number {
        if (str.length - offset < str2.length) return 0;
        for (let i = 0; i < str2.length; i++){
            if (str[i + offset] !== str2[i]) return 0;
        }
        return str2.length
    }
    private static split(str: string, s = 0, e = str.length): string[] {
        let data: string[] = []
        let c = 0, M = 0, k: string = "", n: number, pr_num = 0, minus = 0, dot = 0
        for (let i = s; i < e; i++) {
            if (str[i] == " " || str[i] == "\\") {
                continue;
            }
            c = 0
            minus = 0
            if(pr_num <= 0 && str[i] === "-")minus = 1, i++
            while ('0' <= str[i + c] && str[i + c] <= '9' || str[i + c] == '.') c++
            if (c) {
                k = (minus ? "-" : "") + str.slice(i, i + c)
                if (pr_num > 0) data.push(".")
                else pr_num++
                data.push(k)
                console.log(k + " " + pr_num)
                k = ""
                i += c - 1
                continue
            }
            else if(minus)data.push("_-")
            M = 0
            for (let key in this.reserved) {
                let temp = this.str_check(str, i, key)
                if (M < temp) {
                    M = temp
                    k = key
                }
            }
            if (!k || k && this.reserved[k].type === "const") {
                if(!k)k = str[i]
                if (pr_num > 0) data.push(".")
                else pr_num++
            }
            else if (k === ')') {
            }
            else {
                if (pr_num > 0 && (this.reserved[k].type === "func" || this.reserved[k].type === "brackets")) {
                    data.push(".")
                }
                if (this.reserved[k].param) pr_num = -this.reserved[k].param+1
                else pr_num = 0
            }
            console.log(k + " " + pr_num)
            data.push(k)
            i += k.length - 1
            k = ""
        }
        console.log(data)
        return data
    }
    public static calc(formula: string[], x: number): number {
        let stack: number[] = []
        for (let i = 0; i < formula.length; i++){
            if (formula[i] === "x") stack.push(x)
            else {
                let word = this.reserved[formula[i]]
                if (!word) {//数値
                    stack.push(parseFloat(formula[i]))
                    continue
                }
                switch (word.type) {
                    case "const":
                        stack.push(word.value)
                        break
                    case "ope":
                        let p1 = stack.pop()
                        let p2 = stack.pop()
                        stack.push(word.calc(p2, p1))
                        break
                    case "func":
                        let p: number[] = []
                        let num = word.param ? word.param : 1
                        for (let i = 0; i < num; i++)p.push(stack.pop())
                        stack.push(word.calc(p))
                        break
                }
            }
        }
        return stack.pop()
    }
}