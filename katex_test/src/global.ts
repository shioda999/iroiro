import html2canvas from "html2canvas";
import { webkitTextStrokeWidth } from "html2canvas/dist/types/css/property-descriptors/webkit-text-stroke-width";

export const GRID_W = 20
export const katex_option = {
    strict: false,
    maxSize: 100,
}
export const katex_instance = katex
export const is_PC = isPC()

function isPC() {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
        return false;
    } else {
        return true;
    }
}
export const Global = {
    mode: "text"
}
export function katextext_to_canvas(parent, html, scale, callback) {
    const element = document.createElement("div")
    element.innerHTML = html
    parent.appendChild(element)
    html2canvas(element, { scale: scale, logging: false }).then((canvas) => {
        const ctx = canvas.getContext("2d")
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const W = img.width
        const H = img.height
        for (let i = 0; i < W * H; i++) {
            let v = Math.floor((img.data[4 * i] + img.data[4 * i + 1] + img.data[4 * i + 2]) / 3)
            img.data[4 * i + 3] = Math.min((Math.round(255 - v) * 1.5), 255)
        }
        ctx.putImageData(img, 0, 0)
        const w = canvas.width / window.devicePixelRatio
        callback(canvas, W, H)
        element.remove()
    })
}
export function getRuleBySelector(sele) {
    var i, j, sheets, rules, rule = null;

    // stylesheetのリストを取得
    sheets = document.styleSheets;
    for (i = 0; i < sheets.length; i++) {
        // そのstylesheetが持つCSSルールのリストを取得
        rules = sheets[i].cssRules;
        for (j = 0; j < rules.length; j++) {
            // セレクタが一致するか調べる
            if (sele === rules[j].selectorText) {
                rule = rules[j];
                break;
            }
        }
    }
    return rule;
}