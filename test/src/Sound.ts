export class Sound {
    private static data: HTMLAudioElement[] = []
    private static name_list: string[] = []
    public static load(fileName: string, name: string){
        const index = this.name_list.indexOf(name)
        if(index !== -1){
            return
        }
        const inst = new Audio('asset/' + fileName)
        inst.volume = 0.5
        this.data.push(inst)
        this.name_list.push(name)
    }
    public static play(name: string, loop = false){
        const index = this.name_list.indexOf(name)
        if(index === -1)return
        const inst = this.data[this.name_list.indexOf(name)]
        inst.currentTime = 0
        inst.play()
        if(loop){
            inst.addEventListener("ended", function() {
                inst.play();
              }, false);
        }
    }
    public static pause(name: string){
        const index = this.name_list.indexOf(name)
        if(index === -1)return
        this.data[this.name_list.indexOf(name)].pause()
    }
    public static stop(name: string){
        const index = this.name_list.indexOf(name)
        if(index === -1)return
        this.data[this.name_list.indexOf(name)].pause()
        this.data[this.name_list.indexOf(name)].currentTime = 0
    }
    public static set_volume(name: string, volume: number){
        const index = this.name_list.indexOf(name)
        if(index === -1)return
        this.data[this.name_list.indexOf(name)].volume = volume
    }
}