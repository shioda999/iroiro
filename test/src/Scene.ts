export type SceneType = "title" | "count" | "game" | "back"
export class Scene {
    private static func: (v: SceneType) => any
    protected release = undefined
    protected releaseFlag = false
    constructor() {}
    public static SetGotoSceneFunction(func: (v: SceneType) => any){
        this.func = func
    }
    public gotoScene(name: SceneType) {
        if (this.releaseFlag) return
        this.releaseFlag = true
        if(this.release)this.release()
        Scene.func(name)
    }
}