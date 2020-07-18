import { Output } from '../../common/output'
let button = document.getElementById("button")
const form = document.form
if (button) form.onkeyup = button.onclick = () => onclick()
function onclick() {
    Output.clear()
    let v = parseInt(form.form_num.value)
    if (v > 0) {
        Output.print("・結果", "headline")
        if (v > 9999999999999) {
            Output.print("値が大きすぎ!", "error")
            return
        }
        prime(v)
        divide(form.form_num.value)
        Output.renderKaTeX()
    }
}
function prime(v: number){
    let k = Math.floor(Math.sqrt(v))
    let list: number[] = [], list2: number[] = []
    if (v == 1) {
        Output.print("$1 = 1^1$")
        return
    }
    for (let i = 2; i <= k; i++){
        let c = 0
        while (v % i == 0) {
            v /= i, c++
        }
        if (c) list.push(i), list2.push(c)
    }
    if (v != 1) list.push(v), list2.push(1)
    let str = parseInt(form.form_num.value) + "="
    for(let i = 0; i < list.length; i++) {
        if(i) str += "\\cdot"
        str += list[i] + "^{" + list2[i] + "}"
    }
    Output.print("$"+str+"$")
}
function divide(v: number){
    let k = Math.floor(Math.sqrt(v)), sum = 0
    let list: number[] = [], list2: number[] = []
    for (let i = 1; i <= k; i++){
        if (v % i == 0) {
            list.push(i)
            if (v != i * i)list2.push(v / i)
        }
    }
    list = list.concat(list2.reverse())
    let str = ""
    for (let i = 0; i < list.length; i++){
        if (i) str += ","
        sum += list[i]
        str += list[i]
    }
    Output.print("約数の個数:$" + list.length + "$")
    Output.print("約数の和:$" + sum + "$")
    Output.print("$"+str+"$")
}