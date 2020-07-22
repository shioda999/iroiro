import { Output } from '../../common/output'
let button = document.getElementById("button")
const form = document.form
if (button) form.onkeyup = button.onclick = () => onclick()
form.text.value = "$\n入力例\\\\\n半径rの円の面積は\\pi r^2。\\\\\nf(x) = \\frac{1}{\\sqrt{2\\pi \\sigma^2}} \\exp \\left(-\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)\\\\\n\\begin{aligned}\nab + 3b + a^2 + 3a &= b(a + 3) + a(a + 3)\\\\\n&= (a + b)(a + 3)\n\\end{aligned}\n$"
onclick()
function onclick() {
    Output.clear()
    let text = form.text.value
    Output.print(text)
    Output.renderKaTeX()
}