import { Output } from '../../common/output'
import { Parse } from './parse'
import { Graph } from './graph'
let button = document.getElementById("button")
const form = document.form
if (button) form.onkeyup = form.onchange = button.onclick = () => onclick()
form.text.value = "sinx"
onclick()
function onclick() {
    Output.clear()
    let text = preparation(form.text.value)
    let formula = Parse.parse(text)
    console.log(formula)
    text = conv(text)
    Output.print("・$y = " + text + "\\ $", "headline")
    Output.renderKaTeX()
    plot(formula)
}
function plot(formula: string[]) {
    let left = parseFloat(form.left.value), right = parseFloat(form.right.value)
    let canvas = document.getElementById('sample')
    let scale_x = Graph.get_scaleX(canvas, left, right)
    let v = getpoint(formula, left, right, 1 / scale_x)
    if(!v)return
    let error = Graph.plot(v, canvas)
    if(error)Output.print(error, "error")
}
function getpoint(formula: string[], left: number, right: number, d: number) {
    let px: number[] = [], py: number[] = [], max_y, min_y
    if (left >= right) {
        Output.print("定義域が不正です。", "error")
        return
    }
    for (let x = left, y; x <= right; x += d){
        px.push(x)
        py.push(y = Parse.calc(formula, x))
        if (x === left) max_y = min_y = y
        else max_y = Math.max(max_y, y), min_y = Math.min(min_y, y)
    }
    max_y = Math.min(10, max_y)
    min_y = Math.max(-10, min_y)
    return {"x": px, "y": py, "max_y": max_y, "min_y": min_y, "max_x": right, "min_x": left, "v_num": px.length}
}
function conv(str: string) {
    str = str.replace(/\*/g, "\\times ")
    str = str.replace(/\//g, "\\div ")
    str = str.replace(/\\?sin/g, "\\sin ")
    str = str.replace(/\\?cos/g, "\\cos ")
    str = str.replace(/\\?tan/g, "\\tan ")
    str = str.replace(/\\?log/g, "\\log ")
    str = str.replace(/\\?log 2/g, "\\log_2 ")
    str = str.replace(/\\?log 10/g, "\\log_{10} ")
    str = str.replace(/\\?pi/g, "\\pi ")
    for (let i = 0, i2; i < str.length - 1; i++){
        if (str[i] === "^" && str[i + 1] === "(") {
            let nest = 0
            for (i2 = i + 1; i2 < str.length; i2++){
                if (str[i2] === '(') nest++
                if (str[i2] === ')') {
                    nest--
                    if(nest == 0)break
                }
            }
            if (i2 < str.length) str = str.slice(0, i + 1) + "{" + str.slice(i + 2, i2) + "}" + str.slice(i2 + 1)
            else str = str.slice(0, i + 1) + "{" + str.slice(i + 2) + "}"
            i = i2
        }
        else if (str[i] === "^" && str[i + 1] !== "(") {
            i2 = i + 1
            if(str[i2] === "-")i2++
            if(str[i2] === "x")i2++
            for (; i2 < str.length; i2++)if (!('0' <= str[i2] && str[i2] <= '9')) break
            if (i2 < str.length) str = str.slice(0, i + 1) + "{" + str.slice(i + 1, i2) + "}" + str.slice(i2)
            else str = str.slice(0, i + 1) + "{" + str.slice(i + 1) + "}"
            i = i2
        }
    }
    return str
}
function preparation(text: string): string {
    text = text.replace(/{/g, "(")
    text = text.replace(/}/g, ")")
    text = text.replace(/\[/g, "(")
    text = text.replace(/\]/g, ")")
    return text
}