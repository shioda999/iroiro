import { is_PC } from "./global";

export class Canvas {
    private parent = document.getElementById("canvas_parent")
    public canvas
    public context
    constructor(public dragStart, public dragEnd, public move) {
        const canvas: any = document.createElement("canvas")
        this.canvas = canvas
        canvas.classList.add("canvas");
        canvas.width = document.documentElement.scrollWidth - 30;
        canvas.height = document.documentElement.scrollHeight;
        canvas.style.zIndex = 1;
        this.parent.appendChild(canvas)
        this.set_pointer_evens()
        this.context = canvas.getContext("2d")
    }
    private mouse_dragStart = (event) => {
        const px = event.layerX, py = event.layerY
        this.dragStart(px, py)
    }
    private mouse_dragEnd = (event) => {
        const px = event.layerX, py = event.layerY
        this.dragEnd(px, py)
    }
    private mouse_dragging = (event) => {
        const px = event.layerX, py = event.layerY
        this.move(px, py)
    }
    private touch_start = (event) => {
        const px = event.changedTouches[0].pageX, py = event.changedTouches[0].pageY
        this.dragStart(px, py)
    }
    private touch_end = (event) => {
        const px = event.changedTouches[0].pageX, py = event.changedTouches[0].pageY
        this.dragEnd(px, py)
    }
    private touch_move = (event) => {
        event.preventDefault();
        const px = event.changedTouches[0].pageX, py = event.changedTouches[0].pageY
        this.move(px, py)
    }
    public change_cursor(cursor) {
        this.canvas.style.cursor = cursor
    }
    private set_pointer_evens() {
        if (is_PC) {
            this.canvas.addEventListener('mousedown', this.mouse_dragStart, false);
            this.canvas.addEventListener('mouseup', this.mouse_dragEnd, false);
            this.canvas.addEventListener('mouseout', this.mouse_dragEnd, false);
            this.canvas.addEventListener('mousemove', this.mouse_dragging, false);
        }
        else {
            this.canvas.addEventListener('touchstart', this.touch_start, false);
            this.canvas.addEventListener('touchend', this.touch_end, false);
            this.canvas.addEventListener('touchmove', this.touch_move, false)
        }
    }
    private removeEventListeners() {
        if (is_PC) {
            this.canvas.removeEventListener('mousedown', this.mouse_dragStart, false);
            this.canvas.removeEventListener('mouseup', this.mouse_dragEnd, false);
            this.canvas.removeEventListener('mouseout', this.mouse_dragEnd, false);
            this.canvas.removeEventListener('mousemove', this.mouse_dragging, false);
        }
        else {
            this.canvas.removeEventListener('touchstart', this.touch_start, false);
            this.canvas.removeEventListener('touchend', this.touch_end, false);
            this.canvas.removeEventListener('touchmove', this.touch_move, false)
        }
    }
    public clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    public resize() {
        this.canvas.width = document.documentElement.scrollWidth - 30;
        this.canvas.height = document.documentElement.scrollHeight;
    }
    public release() {
        this.context = null
        this.removeEventListeners()
        this.canvas.width = this.canvas.height = 0
        this.canvas.remove()
        delete this.canvas
    }
}