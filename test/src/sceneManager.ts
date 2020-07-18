import * as PIXI from "pixi.js"
import {Title} from "./title" 
import {Game} from "./game" 
import {SceneType, Scene} from './Scene'
import {Fade} from './Fade'
export class SceneManager{
    private static instance: SceneManager
    private sceneName : SceneType[] = []
    private scene
    private constructor(private container: PIXI.Container){
        Scene.SetGotoSceneFunction((v) => this.gotoScene(v))
        this.gotoScene("title")
    }
    public static init(container: PIXI.Container)
    {
        if (!this.instance)
            this.instance = new SceneManager(container);
        return this.instance;
    }
    private gotoScene(name: SceneType){
        if(name === "back"){
            name = this.sceneName.pop()
            if(this.sceneName.length > 0)name = this.sceneName.pop()
        }
        this.sceneName.push(name)
        if(this.scene){
            if(this.scene.release !== undefined)this.scene.release()
            delete this.scene
        }
        const fade = new Fade(this.container, ()=>{
            this.container.removeChildren()
            this.scene = new {
                title: Title,
                game: Game,
            }[name](this.container)
        })
    }
}