import { katex_option, katex_instance, is_PC, Global } from './global'
import { PaintMode } from './paint'
import { TextMode } from './text';

window.addEventListener('load', () => {
    const canvas_parent = document.getElementById("canvas_parent")

    const text = new TextMode()
    const paint = new PaintMode()

    setup()

    function setup() {
        set_tabEvents()
        window.onresize = paint.onresize
        canvas_parent.style.pointerEvents = "none"
        document.getElementById("loading-icon").remove()
    }
    function set_tabEvents() {
        document.getElementById("text_mode").addEventListener("click", () => change_text_mode())
        document.getElementById("paint_mode").addEventListener("click", () => change_paint_mode())
    }
    function change_text_mode() {
        if (Global.mode == "text") return
        Global.mode = "text"
        canvas_parent.style.pointerEvents = "none"
        text.change_mode()
    }
    function change_paint_mode() {
        if (Global.mode == "paint") return
        Global.mode = "paint"
        canvas_parent.style.pointerEvents = "auto"
        text.change_mode()
    }
});
