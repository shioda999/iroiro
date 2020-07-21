import * as PIXI from "pixi.js"
import { Global } from './global'
import {Scene} from './Scene'
export class Title extends Scene {
    constructor(container: PIXI.Container) {
        super()
        const richText = new PIXI.Text('心理テスト', Global.getstyle())
        richText.x = Global.WIDTH / 2
        richText.y = Global.HEIGHT / 4
        richText.anchor.x = richText.anchor.y = 0.5
        container.addChild(richText)
        let style = Global.getstyle()
        style.fontSize = Global.WIDTH / 20
        const richText2 = new PIXI.Text('クリックでスタート', style)
        richText2.x = Global.WIDTH / 2
        richText2.y = Global.HEIGHT * 3 / 5
        richText2.anchor.x = richText2.anchor.y = 0.5
        container.addChild(richText2)
        container.interactive = true
        container.on("pointertap", this.click)
        this.release = () => {
            container.off("pointertap", this.click)
            container.removeChild(richText)
            container.removeChild(richText2)
            richText.destroy()
            richText2.destroy()
        }
    }
    private click = ()=> {
        this.gotoScene("game")
    }
}