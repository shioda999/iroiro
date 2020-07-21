import * as PIXI from "pixi.js"

const _width = 480
const _ratio = 1
const _height = _width * _ratio
export class Global{
    static readonly RATIO = _ratio
    static readonly WIDTH = _width
    static readonly HEIGHT = _height
    public static getstyle() {
        return style.clone()
    }
}
const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: Global.WIDTH / 8,
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
});