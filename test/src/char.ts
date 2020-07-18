import * as PIXI from 'pixi.js'
import{Global} from './global'
export class Char {
    private bmp
    constructor(container){
        this.bmp = new PIXI.Text('赤',
            { fontName: 'Arial', fontSize: Global.WIDTH / 10, align: 'left' })
        container.addChild(this.bmp)
        this.bmp.anchor.x = this.bmp.anchor.y = 0.5
        this.bmp.on("pointertap", this.click)
    }
    private click() {
        alert("click")
    }
}