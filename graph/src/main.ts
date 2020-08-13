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
    let px: number[] = [], py: number[] = [], max_y = NaN, min_y = NaN
    if (left >= right) {
        Output.print("定義域が不正です。", "error")
        return
    }
    for (let x: number = left, y: number; x <= right; x += d){
        y = Parse.calc(formula, Math.pow(10, x))
        if (isNaN(y)) continue
        px.push(Math.pow(10, x))
        py.push(y)
        if (isNaN(max_y)) max_y = min_y = y
        else max_y = Math.max(max_y, y), min_y = Math.min(min_y, y)
    }
    if (isNaN(max_y)) max_y = min_y = 0
    max_y = Math.min(10, max_y + d)
    min_y = Math.max(-10, min_y - d)
    return {"x": px, "y": py, "max_y": max_y, "min_y": min_y, "max_x": Math.pow(10, right), "min_x": left, "v_num": px.length}
}
function conv(str: string) {
    str = str.replace(/\*/g, "\\times ")
    str = str.replace(/\//g, "\\div ")
    str = str.replace(/sin/g, "\\sin ")
    str = str.replace(/cos/g, "\\cos ")
    str = str.replace(/tan/g, "\\tan ")
    str = str.replace(/arc\\sin/g, "\\arcsin ")
    str = str.replace(/arc\\cos/g, "\\arccos ")
    str = str.replace(/arc\\tan/g, "\\arctan ")
    str = str.replace(/log/g, "\\log ")
    str = str.replace(/log 2/g, "\\log_2 ")
    str = str.replace(/log 10/g, "\\log_{10} ")
    str = str.replace(/pi/g, "\\pi ")
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
        }
        else if (str[i] === "^" && str[i + 1] !== "(") {
            i2 = i + 1
            if(str[i2] === "-")i2++
            if(str[i2] === "x")i2++
            for (; i2 < str.length; i2++)if (!('0' <= str[i2] && str[i2] <= '9')) break
            if (i2 < str.length) str = str.slice(0, i + 1) + "{" + str.slice(i + 1, i2) + "}" + str.slice(i2)
            else str = str.slice(0, i + 1) + "{" + str.slice(i + 1) + "}"
        }
    }
    return str
}
function preparation(text: string): string {
    text = text.replace(/{/g, "(")
    text = text.replace(/}/g, ")")
    text = text.replace(/\[/g, "(")
    text = text.replace(/\]/g, ")")
    text = text.replace(/sin\^-1/g, "arcsin")
    text = text.replace(/asin/g, "arcsin")
    text = text.replace(/cos\^-1/g, "arccos")
    text = text.replace(/acos/g, "arccos")
    text = text.replace(/tan\^-1/g, "arctan")
    text = text.replace(/atan/g, "arctan")
    return text
}