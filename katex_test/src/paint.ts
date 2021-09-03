import { katex_option, katex_instance } from './global'
import { Draw } from './draw'
import { Chara } from './chara'
import { Img } from './img'

export class Paint {
    private draw = new Draw()
    private reader = new FileReader()
    private font_size: any = document.getElementById("font_size")
    private thickness: any = document.getElementById("thickness")
    private thickness_label: any = document.getElementById("thickness_label")
    private bright: any = document.getElementById("bright")
    private bright_label: any = document.getElementById("bright_label")
    private colorcircle2 = document.getElementsByName("colorcircle")
    private line_mode_button: any = document.getElementById("line_mode_button")
    private grid_mode_button: any = document.getElementById("grid_mode_button")
    private upload_form: any = document.getElementById("upload_button")

    private mobile = { canvas: null, ctx: null, ope: "", img: null, prev_img_w: 0, img_x: 0, img_y: 0 }
    private isDrag: boolean = false;

    constructor() {
        this.thickness.addEventListener('input', () => this.change_thickness())
        this.bright.addEventListener('input', () => this.change_bright())
        this.colorcircle2.forEach((e: any) => {
            e.addEventListener('input', () => this.change_color(e.value))
        })
        this.line_mode_button.onchange = () => {
            const mode = this.line_mode_button.options[this.line_mode_button.selectedIndex].value
            this.draw.change_line_mode(mode)
        }
        this.grid_mode_button.onchange = () => {
            const mode = this.grid_mode_button.options[this.grid_mode_button.selectedIndex].value
            this.draw.change_grid_mode(mode)
        }
        this.upload_form.onchange = () => {
            if (this.upload_form.files[0]) this.reader.readAsDataURL(this.upload_form.files[0])
        }
        this.reader.onload = () => {
            new Img(this.reader.result, this.draw)
        }
        document.getElementById("paint_chara").addEventListener("click", () => this.paint_chara())
        document.getElementById("paint_upload").addEventListener("click", () => this.img_upload())
        document.getElementById("paint_undo").addEventListener("click", () => this.draw.undo())
        document.getElementById("paint_do").addEventListener("click", () => this.draw.redo())
        document.getElementById("paint_clear").addEventListener("click", () => { if (window.confirm("本当にペイントを全て削除しますか？")) this.draw.erase_all_canvas() })

        this.set_initial_value()
    }
    private set_initial_value() {
        this.thickness.value = 3
        this.change_thickness()
        this.change_color("black")
    }
    private change_thickness() {
        const str = this.draw.change_thickness(this.thickness.value)
        this.thickness_label.innerHTML = str
    }
    private change_bright() {
        const str = this.draw.change_bright(this.bright.value)
        this.bright_label.innerHTML = str
    }
    private change_color(color) {
        this.draw.change_color(color)
    }
    public onresize = () => {
        this.draw.resize()
    }
    private paint_chara() {
        const ret = window.prompt("表示したい文字を入力してください。")
        if (ret == "" || ret == null) return
        let html
        try {
            html = katex_instance.renderToString(ret, katex_option)
        }
        catch (error) {
            alert(error.message)
            return
        }
        new Chara(html, this.font_size.value, this.draw)
    }
    private img_upload() {
        this.upload_form.click()
    }
}