import { Phi, inv_Phi, T, Kai, Error } from './value'
import { Output } from '../../common/output'
export class Calc {
    private n: number
    private S: number
    private S2: number
    private sigma: number
    private sigma2: number
    private mu: number
    private X: number
    private percent: number
    private sample: number[]
    private two_side: any
    private decimal_place: number
    private bin_p: number
    constructor(data: any) {
        this.load_and_check(data)//データの格納
        this.test()//実際にこのような標本を抽出できる確率
        this.mu_estimate()//母平均の推定
        this.sigma_estimate()//母分散の推定
    }
    private load_and_check(data: any) {
        let i: number
        this.n = data.n
        this.S = data.S
        this.S2 = data.S2
        this.sigma = data.sigma
        this.sigma2 = data.sigma2
        this.mu = data.mu
        this.X = data.X
        this.percent = data.percent / 100
        this.sample = data.sample
        this.two_side = data.two_side
        this.decimal_place = data.decimal_place
        this.bin_p = data.bin_p
        if (this.decimal_place) this.decimal_place = Math.floor(this.decimal_place)
        if (!this.sample && !this.n) Output.print("標本数を入力してください。", "error")
        if (this.bin_p) {
            if (this.sample) Output.print("sampleは無視されます。", "error")
            if (this.sigma) Output.print("sigmaは無視されます。", "error")
            if (this.sigma2) Output.print("sigma2は無視されます。", "error")
            if (this.mu) Output.print("muは無視されます。", "error")
        }
        if (data.sigma && data.sigma2) Output.print("sigma or sigma2のどちらか片方のみにしてください。", "error")
        else {
            if (data.sigma) this.sigma2 = Math.pow(data.sigma, 2)
            if (data.sigma2) this.sigma = Math.sqrt(data.sigma2)
        }
        if (data.S && data.S2) Output.print("S or S2のどちらか片方のみにしてください。", "error")
        else {
            if (data.S) this.S2 = Math.pow(data.S, 2)
            if (data.S2) this.S = Math.sqrt(data.S2)
        }
        if (this.bin_p) {
            this.sigma2 = this.bin_p * (1 - this.bin_p) / this.n
            this.sigma = Math.sqrt(this.sigma2)
            this.mu = this.bin_p * this.n
        }
        else if (data.sample) {
            if (data.n) Output.print("サンプルがあるのでnは不要です。", "error")
            if (data.S) Output.print("サンプルがあるのでSは不要です。", "error")
            if (data.S2) Output.print("サンプルがあるのでS2は不要です。", "error")
            if (data.X) Output.print("サンプルがあるのでXは不要です。", "error")
            this.n = data.sample.length
            this.X = this.S2 = 0
            for (i = 0; i < this.n; i++) {
                this.X += data.sample[i] / this.n
            }
            for (i = 0; i < this.n; i++) {
                this.S2 += Math.pow(this.X - data.sample[i], 2) / this.n
            }
            this.S = Math.sqrt(this.S2)
        }
        Output.print("・入力データ", "headline")
        if (!this.decimal_place) {
            this.decimal_place = 3
        }
        if (this.bin_p) Output.print("二項分布")
        else Output.print("小数第" + this.decimal_place + "位まで表示。")
        if (this.n) Output.print("標本数   n = " + this.n)
        if (this.mu) Output.print("母平均   μ = " + this.Round(this.mu))
        if (this.X) Output.print("標本平均 X = " + this.Round(this.X))
        if (this.sigma) Output.print("母標準偏差   σ = " + this.Round(this.sigma))
        if (this.sigma2) Output.print("母分散   σ^2 = " + this.Round(this.sigma2))
        if (this.S) Output.print("標準偏差 S = " + this.Round(this.S))
        if (this.S2) Output.print("標本の分散 S^2 = " + this.Round(this.S2))
        if (this.S2 && this.n && !this.sigma) Output.print("不偏分散σ^2 = " + this.Round((this.S2 * this.n / (this.n - 1))))
        let str = this.two_side ? "(必ず両側検定)" : ""
        if (!this.percent) {
            Output.print("※危険率が指定されなかったので、危険率5%で検定。" + str)
            this.percent = 0.05
        }
        else Output.print("危険率" + this.percent * 100 + "%" + str)
    }
    private test() {
        if (this.n && this.X && this.mu && (this.sigma || this.S)) {
            Output.print("・標本平均が今以上になる確率", "headline")
            if (this.sigma) {
                let v = Math.sqrt(this.n) * (this.X - this.mu) / this.sigma
                Output.print("Z = √n(X - μ)/σ = " + this.Round(v))
                Output.print("確率は" + this.Round((Phi(v) * 100)) + "%")
                //Output.print("Z = " + Math.sqrt(n) * (X ))
            }
            else {
                let v = Math.sqrt(this.n - 1) * (this.X - this.mu) / this.S
                Output.print("母分散が不明なので、あくまで参考。")
                Output.print("Z = √n-1)(X - μ)/S = " + this.Round(v))
                Output.print("確率は" + this.Round((Phi(v) * 100)) + "%")
            }
        }
    }
    private mu_estimate() {
        if (this.n && this.X && (this.sigma || this.S)) {
            Output.print("・母平均μの" + (this.mu ? "検定" : "区間推定"), "headline")
            if (this.sigma) {
                if (this.mu && !this.two_side) {//片側検定
                    Output.print("Z = √n(X - μ)/σはN(0,1)に従う。")
                    let v: number = inv_Phi(this.percent), r = v * this.sigma / Math.sqrt(this.n)
                    if (this.X > this.mu) {
                        Output.print(" Z < " + this.Round(v))
                        this.conclusion("μ", this.Round(this.X - r), undefined, this.mu)
                    }
                    else {
                        Output.print(-this.Round(v) + " < Z ")
                        this.conclusion("μ", undefined, this.Round(this.X + r), this.mu)
                    }
                }
                else {//両側検定
                    Output.print("Z = √n(X - μ)/σはN(0,1)に従う。")
                    let v: number = inv_Phi(this.percent / 2), r = v * this.sigma / Math.sqrt(this.n)
                    Output.print(-this.Round(v) + " < Z < " + this.Round(v))
                    this.conclusion("μ", this.Round(this.X - r), this.Round(this.X + r), this.mu)
                }
            }
            else {
                if (this.mu && !this.two_side) {//片側検定
                    Output.print("(1)nが小さいとき、")
                    Output.print("T = √n - 1)(X - μ) / Sは自由度n - 1のt分布に従う。")
                    let v = T(this.percent, this.n - 1), r: number
                    if (v == Error) Output.print("数値は表に乗っていませんでした。", "error")
                    else {
                        r = v * this.S / Math.sqrt(this.n - 1)
                        if (this.X > this.mu) {
                            Output.print(" T < " + this.Round(v))
                            this.conclusion("μ", this.Round(this.X - r), undefined, this.mu)
                        }
                        else {
                            Output.print(-this.Round(v) + " < T ")
                            this.conclusion("μ", undefined, this.Round(this.X + r), this.mu)
                        }
                    }
                    Output.print("(2)nが大きいとき、")
                    Output.print("Z = √n-1)(X - μ)/SはN(0,1)に従う。")
                    v = inv_Phi(this.percent), r = v * this.S / Math.sqrt(this.n - 1)
                    if (this.X > this.mu) {
                        Output.print(" Z < " + this.Round(v))
                        this.conclusion("μ", this.Round(this.X - r), undefined, this.mu)
                    }
                    else {
                        Output.print(-this.Round(v) + " < Z ")
                        this.conclusion("μ", undefined, this.Round(this.X + r), this.mu)
                    }
                }
                else {//両側検定
                    Output.print("(1)nが小さいとき、")
                    Output.print("T = √n - 1)(X - μ) / Sは自由度n - 1のt分布に従う。")
                    let v = T(this.percent / 2, this.n - 1), r: number
                    if (v == Error) Output.print("数値は表に乗っていませんでした。", "error")
                    else {
                        r = v * this.S / Math.sqrt(this.n - 1)
                        Output.print(-this.Round(v) + " < T < " + this.Round(v))
                        this.conclusion("μ", this.Round(this.X - r), this.Round(this.X + r), this.mu)
                    }
                    Output.print("(2)nが大きいとき、")
                    Output.print("Z = √n-1)(X - μ)/SはN(0,1)に従う。")
                    v = inv_Phi(this.percent / 2), r = v * this.S / Math.sqrt(this.n - 1)
                    Output.print(-this.Round(v) + " < Z < " + this.Round(v))
                    this.conclusion("μ", this.Round(this.X - r), this.Round(this.X + r), this.mu)
                }
            }
        }
    }
    private sigma_estimate() {
        let i: number
        if (this.n && this.S) {
            let x: number = 0, free: number
            Output.print("・母分散σ^2の" + (this.sigma ? "検定" : "区間推定"), "headline")
            if (this.mu && this.sample) {
                Output.print("Z = (1/σ^2)*Σ(sample_i - μ)^2が自由度nのχ^2分布に従う。")
                for (i = 0; i < this.n; i++)x += Math.pow(this.mu - this.sample[i], 2) / this.n
                free = this.n
            }
            else {
                Output.print("Z = nS^2/σ^2が自由度n-1のχ^2分布に従う。")
                x = this.n * this.S2
                free = this.n - 1
            }
            let v1 = Kai(this.percent / 2, free), v2 = Kai(1 - this.percent / 2, free)
            if (v1 == Error || v2 == Error) Output.print("数値は表に乗っていませんでした。", "error")
            else {
                Output.print(this.Round(v2) + " < Z < " + this.Round(v1))
                this.conclusion("σ^2", this.Round(x / v1), this.Round(x / v2), this.sigma2)
            }
        }
    }
    private Round(v: number) {
        let k = Math.pow(10, this.decimal_place)
        return Math.round(v * k) / k
    }
    private conclusion(param_name: string, l: number, r: number, v: number) {
        let str: string = ""
        if (l) str += l + " < "
        str += param_name
        if (r) str += " < " + r
        let flag = (!l || l && l < v) && (!r || r && v < r)
        if (v) str += flag ? "(信頼区間内)" : "(信頼区間外)"
        Output.print(str, flag ? "normal" : "error")
    }
}