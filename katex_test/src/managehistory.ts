import { List } from './List'
export class ManageHistory {
    private list: List
    private temp = []
    private prev_data = []
    constructor(public on_change?: (prev, now) => void) {
        this.list = new List([])
    }
    public get() {
        return this.list.get()
    }
    public push(element) {
        const new_array = this.get().concat(element)
        this.list.push(new_array)
        this.temp.push(element)
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
    public delete_history() {
        const data = this.get()
        this.temp.forEach((e) => {
            if (data.indexOf(e) == -1) {
                if (e.release) e.release()
            }
        })
        this.temp = []
        this.list.delete_all()
        this.list.push(data)
    }
}