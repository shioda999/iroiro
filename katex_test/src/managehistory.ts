import { List } from './List'
export class ManageHistory {
    private index: number = 0
    private list: List
    private prev_data = []
    constructor(public on_change?: (prev, now) => void) {
        this.list = new List([])
    }
    public get() {
        return this.list.get()
    }
    public push(element) {
        const new_array = this.get().concat([element])
        this.list.push(new_array)
        this.change()
    }
    public redo() {
        this.list.next()
        this.change()
    }
    public undo() {
        this.list.back()
        this.change()
    }
    public erase(element) {
        const i = this.get().indexOf(element)
        if (i !== -1) this.erase_byid(i)
    }
    public erase_byid(id) {
        const new_array = this.get().concat()
        new_array.splice(id, 1)
        this.list.push(new_array)
        this.change()
    }
    public erase_all() {
        this.list.push([])
        this.change()
    }
    private change() {
        if (this.on_change) this.on_change(this.prev_data, this.get())
        this.prev_data = this.get()
    }
}