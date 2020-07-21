import * as PIXI from "pixi.js"
import { Global } from './global'
import { Scene } from './Scene'
import { Char } from './char'
export class Game extends Scene {
    private bar: PIXI.Graphics
    private char: Char[]
    private time: number
    private round: number
    private state: number
    private correct: number
    private correct_Char: Char
    private judge: number
    private graph: PIXI.Graphics[]
    readonly str = ["赤", "青", "緑", "黄", "紫", "白", "橙", "水"]
    readonly color = ["0xFF0000", "0x0000FF", "0x00FF00", "0xFFFF00", "0x990099", "0xCCCCCC", "0xFFAA33", "0x0090FF"]
    readonly WAIT = 0
    readonly INIT_JUDGE = 1
    readonly JUDGING = 2
    readonly N = this.str.length * this.color.length
    constructor(private container: PIXI.Container) {
        super()
        this.state = this.WAIT
        this.round = 0
        this.char = []
        this.prepareNextRound()
        this.initGraph()
        Char.setcallback(this.click)
        this.loop()
        this.release = () => {
            this.container.removeChild(this.bar)
        }
    }
    private click = (n: number) => {
        if(this.state)return
        this.state = this.INIT_JUDGE
        this.judge = (n === this.correct) ? 0 : 1
    }
    private getLimitTime() {
        return 60 * (3 - this.round * 0)
    }
    private loop = () => {
        if (!this.releaseFlag) requestAnimationFrame(this.loop)
        switch (this.state) {
            case this.WAIT:
                if (this.time < 0) {
                    this.judge = 1
                    this.state = this.INIT_JUDGE
                }
                this.updateBar()
                this.time--
                break;
            case this.INIT_JUDGE:
                this.container.addChild(this.graph[this.judge])
                this.state = this.JUDGING
                this.time = 90
                break;
            case this.JUDGING:
                if (this.time-- < 0) {
                    this.state = this.WAIT
                    this.container.removeChild(this.graph[this.judge])
                    this.prepareNextRound()
                }
                break;
        }
    }
    private prepareNextRound() {
        this.round++
        this.time = this.getLimitTime()
        this.decideCorrectAnswer()
        this.setChars()
    }
    private randomSequence() {
        let temp = []
        let r = []
        for (let i = 0; i < this.N; i++)temp.push(i)
        for (let i = 0; i < this.N; i++){
            let n = Math.floor(Math.random() * temp.length)
            r.push(temp.splice(n, 1))
        }
        return r
    }
    private decideCorrectAnswer() {
        this.correct = Math.floor(Math.random() * this.N)
    }
    private releaseChars() {
        while (this.char.length) {
            let it = this.char.pop()
            it.release()
        }
    }
    private setChars() {
        const n = this.str.length
        const size = Math.min(Global.WIDTH / (n * 1.3), Global.WIDTH / 8)
        if(this.correct_Char)this.correct_Char.release()
        this.releaseChars()
        this.correct_Char = new Char(this.correct, this.str[Math.floor(this.correct / n)], this.color[this.correct % n], size)
        this.correct_Char.draw(this.container, Global.WIDTH / 2, Global.HEIGHT / 10)
        let r = this.randomSequence()
        for (let i = 0; i < this.N; i++) {
            let p = r[i]
            let char = new Char(i, this.str[Math.floor(i / n)], this.color[i % n], size)
            char.draw(this.container,
                (Math.floor(p / n) + 0.5) * Global.WIDTH / n,
                (p % n + 1.5) * (Global.HEIGHT - size) / (n + 1) + size)
            this.char.push(char)
        }
    }
    private initGraph() {
        let maru = new PIXI.Graphics()
        maru.lineStyle(Global.WIDTH / 20, 0xFF0000, 0.9)
        maru.beginFill(0, 0)
        maru.drawCircle(0, 0, Global.WIDTH / 3)
        maru.endFill()
        let batu = new PIXI.Graphics()
        batu.beginFill(0x2200CC)
        const w = Global.WIDTH * 2 / 5, f = Global.WIDTH / 10
        batu.drawRect(-w, -f / 2, w * 2, f)
        batu.drawRect(-f / 2, -w, f, w * 2)
        batu.endFill()
        batu.angle = 45
        maru.x = batu.x = Global.WIDTH / 2
        maru.y = batu.y = Global.HEIGHT / 2
        this.graph = []
        this.graph.push(maru)
        this.graph.push(batu)
    }
    private updateBar() {
        if(this.bar)this.container.removeChild(this.bar)
        this.bar = new PIXI.Graphics()
        if(this.time > this.getLimitTime() *3 / 7)this.bar.beginFill(0x00FF00)
        else if(this.time > this.getLimitTime() / 5)this.bar.beginFill(0xFFFF00)
        else this.bar.beginFill(0xFF0000)
        this.bar.drawRect(0, 0, Global.WIDTH * this.time / this.getLimitTime(), Global.WIDTH / 50)
        this.bar.endFill()
        this.container.addChild(this.bar)
    }
}