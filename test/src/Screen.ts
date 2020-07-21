import * as PIXI from "pixi.js"
import {Global} from './global'
export class Screen {
    private static instance: Screen
    private container: PIXI.Container
    public app: PIXI.Application
    public OnresizeFunctions = []
    constructor(){
        this.container = new PIXI.Container()
        this.setPosition()
        this.AddOnresizeFunc(this.setPosition)
        window.onresize = () => {
            this.OnresizeFunctions.forEach(n => n())
        }
    }
    public static init(){
        if (!this.instance)
            this.instance = new Screen();
        return this.instance;
    }
    public getContainer(){
        return this.container
    }
    private setPosition = () => {
        let temp = this.app
        let devWidth = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight / Global.RATIO)
        let ratio = Math.min(1.0, devWidth / Global.WIDTH)
        this.app = new PIXI.Application({ backgroundColor: 0 ,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight - 10,
            antialias: true
        })
        if(temp){
            document.body.removeChild(temp.view)
            temp.stage.removeChildren()
            temp.destroy()
        }
        document.body.appendChild(this.app.view)
        this.app.stage.width = document.documentElement.clientWidth
        this.app.stage.height = document.documentElement.clientHeight
        this.container.x = (document.documentElement.clientWidth - Global.WIDTH * ratio) / 2
        this.container.y = (document.documentElement.clientHeight - Global.HEIGHT * ratio) / 2
        this.container.scale.x = this.container.scale.y = ratio

        const frame = new PIXI.Graphics()
        frame.beginFill(0,0)
        frame.lineStyle(Math.max(this.container.x, this.container.y), 0x1099bb,1.0, 1)
        frame.drawRect(this.container.x, this.container.y, Global.WIDTH * ratio, Global.HEIGHT * ratio)
        frame.endFill()
        frame.zIndex = 1
        this.app.stage.sortableChildren = true
        this.container.sortableChildren = true
        this.app.stage.addChild(frame)
        this.app.stage.addChild(this.container)
    }
    public AddOnresizeFunc(func){
        this.OnresizeFunctions.push(func)
    }
    public DeleteOnresizeFunc(func){
        this.OnresizeFunctions = this.OnresizeFunctions.filter(n => n != func)
    }
}