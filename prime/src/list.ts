export class List {
    public next: List
    public num: number
    public num2: number
    constructor(num = 0, num2 = 0) {
        this.num = num
        this.num2 = num2
        this.next = null
    }
    public push(num: number, num2: number) {
        let temp: List = this
        while (temp.next) temp = temp.next
        temp.next = new List(num, num2)
    }
}