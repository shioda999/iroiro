import { List } from './list'
import { Output } from './output'
let button = document.getElementById("button")
const form = document.form
if (button) form.onkeyup = button.onclick = () => onclick()
function onclick() {
    Output.clear()
    Output.print("・結果", "headline")
    prime(form.form_num.value)
    divide(form.form_num.value)
    Output.renderKaTeX()
}
function prime(v: number){
    let k = Math.ceil(Math.sqrt(v))
    let list = new List()
    for (let i = 2; i <= k; i++){
        let k = 0
        while (v % i == 0) {
            v /= i, k++
        }
        if(k)list.push(i, k)
    }
    if (v != 1) list.push(v, 1)
    let str = form.form_num.value + "="
    let work = list.next
    while (work) {
        if(work != list.next) str += "\\cdot"
        str += work.num + "^{" + work.num2 + "}"
        work = work.next
    }
    Output.print(str, "math")
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
    Output.print("約数の個数:" + size, "math")
    Output.print("約数の和:" + sum, "math")
    Output.print(str+","+str2, "math")
}