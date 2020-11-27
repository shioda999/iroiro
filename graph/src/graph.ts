export class Graph {
    private static scale_x: number
    private static scale_y: number
    private static canvas_w: number
    private static canvas_h: number
    private static max_x: number
    private static min_x: number
    private static max_y: number
    private static min_y: number
    private static margin: number = 50
    private static ctx: any
    public static get_scaleX(canvas, left, right) {
        let width = canvas.width - this.margin * 2, height = canvas.height - this.margin * 2
        let scale_x = width / (right - left)
        return scale_x
    }
    private static set_parameters(data, canvas) {
        this.canvas_w = canvas.width
        this.canvas_h = canvas.height
        this.scale_x = (this.canvas_w - 2 * this.margin) / (data.max_x - data.min_x)
        this.scale_y = (this.canvas_h - 2 * this.margin) / (data.max_y - data.min_y)
        this.max_x = data.max_x
        this.min_x = data.min_x
        this.max_y = data.max_y
        this.min_y = data.min_y
    }
    private static to_canvas_x(x: number) {
        return (x - this.min_x) * this.scale_x + this.margin
    }
    private static to_canvas_y(y:number) {
        return (this.max_y - y) * this.scale_y + this.margin
    }
    public static plot(data, canvas) {
        if (!canvas.getContext)return "キャンバスが使用できません。"
        this.ctx = canvas.getContext('2d');
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        let left = data.min_x, right = data.max_x
        if (left >= right) {
            return "定義域が不正です。"
        }
        this.set_parameters(data, canvas)

        this.drawAxis()
        
        this.ctx.beginPath()
        for (let i = 0; i < data.v_num; i++){
            let x, y
            x = this.to_canvas_x(data.x[i])
            y = this.to_canvas_y(data.y[i])
            if (i === 0) this.ctx.moveTo(x, y)
            else this.ctx.lineTo(x, y)
        }
        this.ctx.stroke();

        this.drawNumbersOnAxis(data)
    }
    private static drawAxis() {
        const arrow_size = 5
        this.ctx.beginPath()
        this.ctx.moveTo(0, this.to_canvas_y(0))
        this.ctx.lineTo(this.canvas_w, this.to_canvas_y(0))
        this.ctx.lineTo(this.canvas_w - arrow_size * 1.414, this.to_canvas_y(0) - arrow_size * 1.414)
        this.ctx.moveTo(this.canvas_w, this.to_canvas_y(0))
        this.ctx.lineTo(this.canvas_w - arrow_size * 1.414, this.to_canvas_y(0) + arrow_size * 1.414)
        this.ctx.moveTo(this.to_canvas_x(0), this.canvas_h)
        this.ctx.lineTo(this.to_canvas_x(0), 0)
        this.ctx.lineTo(this.to_canvas_x(0) - arrow_size * 1.414, arrow_size * 1.414)
        this.ctx.moveTo(this.to_canvas_x(0), 0)
        this.ctx.lineTo(this.to_canvas_x(0) + arrow_size * 1.414, arrow_size * 1.414)
        this.ctx.stroke()
    }
    private static drawNumbersOnAxis(data){
        this.ctx.fillStyle = "blue";
        this.ctx.font = "15px 'ＭＳ ゴシック'";

        this.drawOrigin()
        this.drawNumbersOnXScale()
        this.drawNumbersOnYScale()
    }
    private static drawOrigin() {
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = "right";
        this.drawNumber(0, 0, 0)
    }
    private static drawNumbersOnXScale() {
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = "middle";
        this.drawNumber(this.min_x, this.min_x, 0)
        this.drawNumber(this.max_x, this.max_x, 0)
    }
    private static drawNumbersOnYScale() {
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "right";
        this.drawNumber(this.min_y, 0, this.min_y)
        this.drawNumber(this.max_y, 0, this.max_y)
    }
    private static drawNumber(v: number, x:number, y:number) {
        this.ctx.fillText(v, this.to_canvas_x(x), this.to_canvas_y(y), 200);
    }
}