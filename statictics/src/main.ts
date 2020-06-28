import {Calc} from './calc'
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
let readFile = () => {
    let inst = new Calc()
    if (typeof (reader.result) !== "string") return
    let data = JSON.parse(reader.result)
    inst.calculate(data)
}
input.type = "file"
input.hidden = true
input.onchange = changeFile
reader.onload = readFile
let button = document.getElementById("form-button")
button.onclick = () => input.click()