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
        //set_keyEvent()
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
    /*function set_keyEvent() {
        document.addEventListener("keydown", event => {
            //console.log("down" + event.key)
            switch (event.key) {
                case "ArrowRight":
                    disp_mobile_img(mobile_canvas_img, ++mobile_img_x, mobile_img_y)
                    break
                case "ArrowLeft":
                    disp_mobile_img(mobile_canvas_img, --mobile_img_x, mobile_img_y)
                    break
                case "ArrowUp":
                    disp_mobile_img(mobile_canvas_img, mobile_img_x, --mobile_img_y)
                    break
                case "ArrowDown":
                    disp_mobile_img(mobile_canvas_img, mobile_img_x, ++mobile_img_y)
                    break
            }
        })
        document.addEventListener("keyup", event => {
            //console.log("up:" + event.key)
            switch (event.key) {
                case "Shift":
                    if (line_mode == "default") line_mode = "straight"
                    else if (line_mode == "straight") line_mode = "default"
                    break
                case "Backspace":
                    if (mobile_canvas) remove_mobile_canvas()
                    break
            }
        })
    }*/
});
