export class List {
    private node: my_node
    constructor(data?) {
        this.node = this.new_node(data)
    }
    public push(data) {
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
}
type my_node = {
    data: any;
    next: my_node;
    prev: my_node;
}