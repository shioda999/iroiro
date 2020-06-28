import {Phi, inv_Phi, T, Kai, Error} from './value'
export class Calc {
    private result: string = ""
    private error: string = ""
    private result_nest: number = 0
    private n: number
    private S: number
    private S2: number
    private sigma: number
    private sigma2: number
    private mu: number
    private X_bar: number
    private percent: number
    private sample: number[]
    private two_side: any
    private decimal_place: number
    public calculate = (data: any) => {
        let i: number
        this.load_and_check(data)//データの格納
        this.test()//実際にこのような標本を抽出できる確率
        this.mu_estimate()//母平均の推定
        this.sigma_estimate()//母分散の推定

        let output = this.error + "</br>" + this.result
        document.getElementById("text").innerHTML = output;
    }
    private print_error(str: string) {
        this.error += str + "</br>"
    }
    private print_result(str: string) {
        for (let i = 0; i < this.result_nest; i++)this.result += "＿＿＿"
        this.result += str + "</br>"
    }
    private print_result_nest(v: number) {
        this.result_nest += v
    }
    private load_and_check(data: any) {
        let i: number
        this.n = data.n
        this.S = data.S
        this.S2 = data.S2
        this.sigma = data.sigma
        this.sigma2 = data.sigma2
        this.mu = data.mu
        this.X_bar = data.X_bar
        this.percent = data.percent / 100
        this.sample = data.sample
        this.two_side = data.two_side
        this.decimal_place = data.decimal_place
        if (this.decimal_place) this.decimal_place = Math.floor(this.decimal_place)
        
        if (data.sigma && data.sigma2) this.print_error("sigma or sigma2のどちらか片方のみにしてください。")
        else {
            if(data.sigma)this.sigma2 = Math.pow(data.sigma, 2)
            if(data.sigma2)this.sigma = Math.sqrt(data.sigma2)
        }
        if(data.S && data.S2)this.print_error("S or S2のどちらか片方のみにしてください。")
        else {
            if(data.S)this.S2 = Math.pow(data.S, 2)
            if(data.S2)this.S = Math.sqrt(data.S2)
        }
        if (data.sample) {
            if(data.n)this.print_error("サンプルがあるのでnは不要です。")
            if(data.S)this.print_error("サンプルがあるのでSは不要です。")
            if(data.S2)this.print_error("サンプルがあるのでS2は不要です。")
            if(data.X_bar)this.print_error("サンプルがあるのでX_barは不要です。")
            this.n = data.sample.length
            this.X_bar = this.S2 = 0
            for (i = 0; i < this.n; i++) {
                this.X_bar += data.sample[i]
            }
            this.X_bar /= this.n
            for (i = 0; i < this.n; i++) {
                this.S2 += Math.pow(this.X_bar - data.sample[i], 2) / this.n
            }
            this.S = Math.sqrt(this.S2)
        }
        if (!this.decimal_place) {
            this.print_result("※decimal_placeが指定されなかったので、小数第3位まで表示。")
            this.decimal_place = 3
        }
        else this.print_result("小数第" + this.decimal_place + "位まで表示。")
        this.print_result("標本数   n = " + this.n)
        this.print_result("標本平均 X = " + this.Round(this.X_bar))
        this.print_result("標本偏差 S = " + this.Round(this.S))
        this.print_result("標本分散 S^2 = " + this.Round(this.S2))
        this.print_result("母平均   μ = " + this.Round(this.mu))
        this.print_result("母分散   σ^2 = " + this.Round(this.sigma2))
        this.print_result("母平均(不偏推定量)μ = " + this.Round(this.X_bar))
        this.print_result("母分散(不偏推定量)σ^2 = " + this.Round((this.S2 * this.n / (this.n - 1))))
        let str = this.two_side ? "(必ず両側検定)" : ""
        if (!this.percent) {
            this.print_result("※percentが指定されなかったので、危険率5%で検定。" + str)
            this.percent = 0.05
        }
        else this.print_result("危険率" + this.percent * 100 + "%" + str)
        this.print_result("")
    }
    private test() {
        if (this.n && this.X_bar && this.mu && (this.sigma || this.S)) {
            this.print_result("・実際に上記のような標本を抽出できる確率")
            this.print_result_nest(1)
            if (this.sigma) {
                let v = Math.sqrt(this.n)*(this.X_bar - this.mu) / this.sigma
                this.print_result("Z = √n(X_bar - μ)/σ = " + this.Round(v))
                this.print_result("確率は" + this.Round((Phi(v) * 100)) + "%")
                //this.print_result("Z = " + Math.sqrt(n) * (X_bar ))
            }
            else {
                let v = Math.sqrt(this.n - 1)*(this.X_bar - this.mu) / this.S
                this.print_result("母分散が不明なので、あくまで参考。")
                this.print_result("Z = √n-1)(X_bar - μ)/S = " + this.Round(v))
                this.print_result("確率は" + this.Round((Phi(v) * 100)) + "%")
            }
            this.print_result("")
            this.print_result_nest(-1)
        }
    }
    private mu_estimate() {
        if (this.n && this.X_bar && (this.sigma || this.S)) {
            this.print_result("・母平均μの" + (this.mu ? "検定" : "区間推定"))
            this.print_result_nest(1)
            if (this.sigma) {
                if (this.mu && !this.two_side) {//片側検定
                    this.print_result("Z = √n(X_bar - μ)/σはN(0,1)に従う。")
                    let v: number = inv_Phi(this.percent), r = v * this.sigma / Math.sqrt(this.n)
                    if (this.X_bar > this.mu) {
                        this.print_result(" Z < " + this.Round(v))
                        this.conclusion("μ", this.Round(this.X_bar - r), undefined, this.mu)
                    }
                    else {
                        this.print_result(-this.Round(v) + " < Z ")
                        this.conclusion("μ", undefined, this.Round(this.X_bar + r), this.mu)
                    }
                }
                else {//両側検定
                    this.print_result("Z = √n(X_bar - μ)/σはN(0,1)に従う。")
                    let v: number = inv_Phi(this.percent / 2), r = v * this.sigma / Math.sqrt(this.n)
                    this.print_result(-this.Round(v) + " < Z < " + this.Round(v))
                    this.conclusion("μ", this.Round(this.X_bar - r), this.Round(this.X_bar + r), this.mu)
                }
            }
            else {
                if (this.mu && !this.two_side) {//片側検定
                    this.print_result("(1)nが小さいとき、")
                    this.print_result("T = √n - 1)(X_bar - μ) / Sは自由度n - 1のt分布に従う。")
                    let v = T(this.percent, this.n - 1), r: number
                    if (v == Error) this.print_result("数値は表に乗っていませんでした。")
                    else {
                        r = v * this.S / Math.sqrt(this.n - 1)
                        if (this.X_bar > this.mu) {
                            this.print_result(" T < " + this.Round(v))
                            this.conclusion("μ", this.Round(this.X_bar - r), undefined, this.mu)
                        }
                        else {
                            this.print_result(-this.Round(v) + " < T ")
                            this.conclusion("μ", undefined, this.Round(this.X_bar + r), this.mu)
                        }
                    }
                    this.print_result("(2)nが大きいとき、")
                    this.print_result("Z = √n-1)(X_bar - μ)/SはN(0,1)に従う。")
                    v = inv_Phi(this.percent), r = v * this.S / Math.sqrt(this.n - 1)
                    if (this.X_bar > this.mu) {
                        this.print_result(" Z < " + this.Round(v))
                        this.conclusion("μ", this.Round(this.X_bar - r), undefined, this.mu)
                    }
                    else {
                        this.print_result(-this.Round(v) + " < Z ")
                        this.conclusion("μ", undefined, this.Round(this.X_bar + r), this.mu)
                    }
                }
                else {//両側検定
                    this.print_result("(1)nが小さいとき、")
                    this.print_result("T = √n - 1)(X_bar - μ) / Sは自由度n - 1のt分布に従う。")
                    let v = T(this.percent / 2, this.n - 1), r: number
                    if (v == Error) this.print_result("数値は表に乗っていませんでした。")
                    else {
                        r = v * this.S / Math.sqrt(this.n - 1)
                        this.print_result(-this.Round(v) + " < T < " + this.Round(v))
                        this.conclusion("μ", this.Round(this.X_bar - r), this.Round(this.X_bar + r), this.mu)
                    }
                    this.print_result("(2)nが大きいとき、")
                    this.print_result("Z = √n-1)(X_bar - μ)/SはN(0,1)に従う。")
                    v = inv_Phi(this.percent / 2), r = v * this.S / Math.sqrt(this.n - 1)
                    this.print_result(-this.Round(v) + " < Z < " + this.Round(v))
                    this.conclusion("μ", this.Round(this.X_bar - r), this.Round(this.X_bar + r), this.mu)
                }
            }
            this.print_result("")
            this.print_result_nest(-1)
        }
    }
    private sigma_estimate() {
        let i: number
        if (this.n && this.S) {
            let x: number = 0, free: number
            this.print_result("・母分散σ^2の" + (this.sigma ? "検定" : "区間推定"))
            this.print_result_nest(1)
            if (this.mu && this.sample) {
                this.print_result("Z = (1/σ^2)*Σ(sample_i - μ)^2が自由度nのχ^2分布に従う。")
                for (i = 0; i < this.n; i++)x += Math.pow(this.mu - this.sample[i], 2) / this.n
                free = this.n
            }
            else {
                this.print_result("Z = nS^2/σ^2が自由度n-1のχ^2分布に従う。")
                x = this.n * this.S2
                free = this.n - 1
            }
            let v1 = Kai(this.percent / 2, free), v2 = Kai(1 - this.percent / 2, free)
            if (v1 == Error || v2 == Error) this.print_result("数値は表に乗っていませんでした。")
            else {
                this.print_result(this.Round(v2) + " < Z < " + this.Round(v1))
                this.conclusion("σ^2", this.Round(x / v1), this.Round(x / v2), this.sigma2)
            }
            this.print_result("")
            this.print_result_nest(-1)
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
        if(v)str += ((!l || l && l < v) && (!r || r && v < r)) ? "(信頼区間内)" : "(信頼区間外)"
        this.print_result(str)
    } 
}