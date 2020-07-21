import * as PIXI from 'pixi.js'
import{Global} from './global'
export class Char {
    private bmp: PIXI.Text
    private container
    private static callback: (n:number) => any
    constructor(private id: number, str: string, color: string, size: number) {
        let style = Global.getstyle()
        style.fill = color
        style.fontSize = size
        this.bmp = new PIXI.Text(str, style)
    }
    public static setcallback(func: (n:number)=> any) {
        Char.callback = func
    }
    private click = ()=> {
        Char.callback(this.id)
    }
    public draw(container: PIXI.Container, x: number, y:number) {
        this.container = container
        this.bmp.x = this.bmp.y = 0
        this.bmp.anchor.x = this.bmp.anchor.y = 0.5
        this.bmp.x = x, this.bmp.y = y
        this.container.addChild(this.bmp)
        this.bmp.interactive = true
        this.bmp.on("pointertap", this.click)
    }
    public release() {
        this.container.off("pointertap", this.click)
        this.container.removeChild(this.bmp)
        this.bmp.destroy()
        delete this.bmp
    }
}