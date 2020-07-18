import { Calc } from './calc'
import { Cross } from './Cross'
import { Output } from '../../common/output'
let input = document.createElement("input")
let reader = new FileReader()

let changeFile = (ev) => {
    var file = ev.target.files[0]
    var type = file.type
    var size = file.size
    input.value = ''
    if (type !== 'application/json') {
        alert('選択できるファイルはJSONファイルだけです。')
        return
    }
    reader.readAsText(file)
}
let switch_inst = (data: any) => {
    Output.clear()
    if (data.cross) {
        let inst = new Cross(data)
    }
    else {
        let inst = new Calc(data)
    }
}
let readFile = () => {
    if (typeof (reader.result) !== "string") return
    let data = JSON.parse(reader.result)
    switch_inst(data)
}
let readForm = () => {
    let data: any = {}, temp: string
    let form = document.form
    let sample = form.form_sample.value 
    if(temp = form.form_n.value)data.n = parseFloat(temp)
    if(temp = form.form_mu.value)data.mu = parseFloat(temp)
    if(temp = form.form_sigma.value)data.sigma = parseFloat(temp)
    if(temp = form.form_sigma2.value)data.sigma2 = parseFloat(temp)
    if(temp = form.form_X.value)data.X = parseFloat(temp)
    if(temp = form.form_S.value)data.S = parseFloat(temp)
    if(temp = form.form_S2.value)data.S2 = parseFloat(temp)
    if(temp = form.form_decimal_place.value)data.decimal_place = parseFloat(temp)
    if(temp = form.form_percent.value)data.percent = parseFloat(temp)
    if(form.side.value == "two")data.two_side = true
    if (sample) {
        let numbers = sample.split(",")
        data.sample = []
        numbers.forEach(v => data.sample.push(parseFloat(v)))
    }
    switch_inst(data)
}
input.type = "file"
input.hidden = true
input.onchange = changeFile
reader.onload = readFile
let button = document.getElementById("readFilebutton")
if(button)button.onclick = () => input.click()
let button2 = document.getElementById("readFormbutton")
if(button2)button2.onclick = () => readForm()