import * as PIXI from 'pixi.js'
import{Global} from './global'
import {Scene} from './Scene';
export class Count extends Scene{
    private bmp: PIXI.Text[]
    private frame: number
    private container
    readonly num = 3
    readonly Time = 60
    constructor(container) {
        super()
        this.container = container
        this.frame = 0
        this.bmp = []
        this.bmp.length = this.num
        let style = Global.getstyle()
        style.fill = '#ff0000'
        style.fontSize = Global.WIDTH / 3
        for (let i = 0; i < this.num; i++) {
            this.bmp[i] = new PIXI.Text((this.num - i).toString(), style)
            this.bmp[i].anchor.x = this.bmp[i].anchor.y = 0.5
            this.bmp[i].x = Global.WIDTH / 2
            this.bmp[i].y = -Global.HEIGHT / 2 - Global.HEIGHT * i
            container.addChild(this.bmp[i])
        }
        this.countdown()
        this.release = () => {
            this.bmp.forEach((e) => {
                this.container.removeChild(e)
                e.destroy()
            })
        }
    }
    private countdown = () => {
        if (this.frame >= this.Time * (this.num + 1)) {
            this.gotoScene("game")
            return
        }
        requestAnimationFrame(this.countdown)
        for (let i = 0; i < this.num; i++) {
            this.bmp[i].scale.x = this.bmp[i].scale.y = 1 + 0.1 * Math.cos(this.frame * Math.PI / this.Time * 2)
            this.bmp[i].y += Global.HEIGHT * Math.abs(Math.PI / this.Time / 2 * Math.sin(this.frame * Math.PI / this.Time))
        }
        this.frame++
    }
}