export class Cross{
    private cross: any
    private class: string[]
    private sum_c: number[]
    private sum_r: number[]
    constructor(data: any) {
        this.load_and_check(data)
    }
    private load_and_check(data: any) {
        this.cross = data.cross
        if (data.class) {
            if(this.cross.length == this.cross[0].length)
                this.class = data.class
            else {
                //警告
            }
        }
    }
}