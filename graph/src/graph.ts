export class Graph {
    public static get_scaleX(canvas, left, right) {
        const margin = 50
        let width = canvas.width - margin * 2, height = canvas.height - margin * 2
        let scale_x = width / (right - left)
        return scale_x
    }
    public static plot(data, canvas) {
        if (!canvas.getContext)return "キャンバスが使用できません。"
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let left = data.min_x, right = data.max_x
        if (left >= right) {
            return "定義域が不正です。"
        }
        const margin = 50
        let width = canvas.width - margin * 2, height = canvas.height - margin * 2
        let scale_x = width / (right - left)
        let scale_y = height / (data.max_y - data.min_y)
        
        this.drawAxis(ctx, canvas, data.max_y, left, scale_y, scale_x, margin)
        
        ctx.beginPath()
        for (let i = 0; i < data.v_num; i++){
            let x, y
            x = (data.x[i] - left) * scale_x + margin
            y = (data.max_y - data.y[i]) * scale_y + margin
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        }
        ctx.stroke();
    }
    private static drawAxis(ctx, canvas, top, left, scale_y, scale_x, margin) {
        const arrow_size = 5
        ctx.beginPath()
        ctx.moveTo(0, top * scale_y + margin)
        ctx.lineTo(canvas.width, top * scale_y + margin)
        ctx.lineTo(canvas.width - arrow_size * 1.414, top * scale_y + margin - arrow_size * 1.414)
        ctx.lineTo(canvas.width, top * scale_y + margin)
        ctx.lineTo(canvas.width - arrow_size * 1.414, top * scale_y + margin + arrow_size * 1.414)
        ctx.moveTo(-left * scale_x + margin, canvas.height)
        ctx.lineTo(-left * scale_x + margin, 0)
        ctx.lineTo(-left * scale_x + margin - arrow_size * 1.414, arrow_size * 1.414)
        ctx.lineTo(-left * scale_x + margin, 0)
        ctx.lineTo(-left * scale_x + margin + arrow_size * 1.414, arrow_size * 1.414)
        ctx.stroke()
    }
}