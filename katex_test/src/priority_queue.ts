export class priority_queue {
    private queue = [{ v: 0, p: 0 }]
    public insert(v, p: number) {
        const node = { v: v, p: p }
        let j, i = this.queue.length
        while (j = (i >> 1)) {
            if (this.queue[j].p > p) {
                //pが小さいノードを下に下ろす
                this.queue[i] = this.queue[j]
                i = j
            }
            else break
        }
        this.queue[i] = node
    }
    public pop() {
        let i = 1, j, k
        if (this.queue.length <= 1) return
        const node = this.queue[1]
        while ((j = i * 2) < this.queue.length) {
            if (j + 1 < this.queue.length) {
                if (this.queue[j].p < this.queue[j + 1].p) k = j
                else k = j + 1
            }
            else k = j
            if (this.queue[k].p < this.queue[this.queue.length - 1].p) {
                this.queue[i] = this.queue[k]
                i = k
            }
            else break
        }
        this.queue[i] = this.queue[this.queue.length - 1]
        this.queue.length--
        return node
    }
    public get_size() {
        return this.queue.length - 1
    }
}