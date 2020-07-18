export type SceneType = "title" | "count" | "game" | "back"
export class Scene {
    private static func: (v: SceneType) => any
    protected release = undefined
    constructor() {}
    public static SetGotoSceneFunction(func: (v: SceneType) => any){
        this.func = func
    }
    public gotoScene(name: SceneType){
        if(this.release)this.release()
        Scene.func(name)
    }
}