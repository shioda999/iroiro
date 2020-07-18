import * as PIXI from "pixi.js"

export class Global{
    static readonly WIDTH = 640
    static readonly HEIGHT = 480
    public static getstyle() {
        return style.clone()
    }
}
const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: Global.WIDTH / 8,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
});