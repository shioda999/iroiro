import { Output } from '../../common/output'
let button = document.getElementById("button")
const form = document.form
if (button) form.onkeyup = button.onclick = () => onclick()
form.text.value = "x^2"
onclick()
function onclick() {
    Output.clear()
    let text = form.text.value
    Output.print("・$y = " + text + "\\ $のプロット結果", "headline")
    Output.renderKaTeX()
}