export class List {
    private node: my_node
    private base: my_node
    constructor(data?) {
        this.base = this.node = this.new_node(data)
    }
    public push(data) {
        this.delete_next_node()
        this.node.next = this.new_node(data)
        this.node.next.prev = this.node
        this.node = this.node.next
    }
    public next() {
        if (this.node.next) this.node = this.node.next
    }
    public back() {
        if (this.node.prev) this.node = this.node.prev
    }
    public get() {
        return this.node.data
    }
    private new_node(data?) {
        return { data: data, next: null, prev: null }
    }
    private delete_next_node() {
        if (this.node.next) {
            const temp = this.node
            this.node = this.node.next
            this.delete_next_node()
            this.node.next = null
            this.node.prev = null
            this.node.data = null
            delete this.node
            this.node = temp
        }
    }
    public delete_all() {
        this.node = this.base
        this.delete_next_node()
    }
}
type my_node = {
    data: any;
    next: my_node;
    prev: my_node;
}