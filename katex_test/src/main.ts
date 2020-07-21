import { Output } from '../../common/output'
let button = document.getElementById("button")
const form = document.form
if (button) form.onkeyup = button.onclick = () => onclick()
form.text.value = "入力例<br>\n半径$r$の円の面積は$\\pi r^2$。<br>\n$f(x) = \\frac{1}{\\sqrt{2\\pi \\sigma^2}} \\exp \\left(-\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)$<br>\n\
$$\n\\begin{aligned}\n\tab + 3b + a^2 + 3a &= b(a + 3) + a(a + 3)\\\\\n\t&= (a + b)(a + 3)\n\\end{aligned}\n$$"
onclick()
function onclick() {
    Output.clear()
    let text = form.text.value
    Output.print(text)
    Output.renderKaTeX()
}