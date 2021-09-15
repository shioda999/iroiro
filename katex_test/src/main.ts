import { compress_function_check, compress_function_check2 } from './compress';
import { getRuleBySelector, Global } from './global'
import { Other } from './other';
import { PaintMode } from './paint'
import { TextMode } from './text';

window.addEventListener('load', () => {
    const text = new TextMode()
    const paint = new PaintMode()
    const other = new Other()

    setup()

    function setup() {
        set_tabEvents()
        container_on()
        window.onresize = paint.onresize
        document.getElementById("loading-icon").remove()
    }
    function set_tabEvents() {
        document.getElementById("text_mode").addEventListener("click", () => change_mode("text"))
        document.getElementById("paint_mode").addEventListener("click", () => change_mode("paint"))
        document.getElementById("other_mode").addEventListener("click", () => change_mode("other"))
    }
    function change_mode(mode) {
        if (Global.mode == mode) return
        Global.mode = mode
        text.change_mode()
        paint.change_mode()
        other.change_mode()
    }
    function container_on() {
        getRuleBySelector('.container .tab-title').style["pointer-events"] = "auto"
    }
});
