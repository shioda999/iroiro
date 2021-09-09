import { compress_function_check, compress_array, decompress_array, Global } from './global'
import { Other } from './other';
import { PaintMode } from './paint'
import { TextMode } from './text';
compress_function_check()
window.addEventListener('load', () => {
    const text = new TextMode()
    const paint = new PaintMode()
    const other = new Other()

    setup()

    function setup() {
        set_tabEvents()
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
});
