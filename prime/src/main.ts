import { List } from './list'
import { Output } from './output'
let button = document.getElementById("button")
const form = document.form
if (button) form.onkeyup = button.onclick = () => onclick()
function onclick() {
    Output.clear()
    let v = parseInt(form.form_num.value)
    if (v > 0) {
        Output.print("・結果", "headline")
        console.log(v)
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
    let k = Math.ceil(Math.sqrt(v))
    let list = new List()
    if (v == 1) {
        Output.print("$1 = 1^1$")
        return
    }
    for (let i = 2; i <= k; i++){
        let c = 0
        while (v % i == 0) {
            v /= i, c++
        }
        if(c)list.push(i, c)
    }
    if (v != 1) list.push(v, 1)
    let str = parseInt(form.form_num.value) + "="
    let work = list.next
    while (work) {
        if(work != list.next) str += "\\cdot"
        str += work.num + "^{" + work.num2 + "}"
        work = work.next
    }
    Output.print("$"+str+"$")
}
function divide(v: number){
    let k = Math.floor(Math.sqrt(v)), sum = 0
    let list = new List(), size = 0
    for (let i = 1; i <= k; i++){
        if (v % i == 0) {
            list.push(i, v / i)
            if (v != i * i) size += 2, sum += i + v / i
            else size++, sum += i
        }
    }
    let str = "", str2 = ""
    let work = list.next
    while (work) {
        if (work != list.next) {
            str += ","
            if(work.num != work.num2)str2 = "," + str2
        }
        str += work.num
        if(work.num != work.num2)str2 = work.num2 + str2
        work = work.next
    }
    Output.print("約数の個数:$" + size + "$")
    Output.print("約数の和:$" + sum + "$")
    Output.print("$"+str+","+str2+"$")
}