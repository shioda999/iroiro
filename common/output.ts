export class Output {
    public static print(str: string, type: string = "normal") {
        let head: string, end: string
        str = this.escapeHtml(str)
        if (type === "raw") {
            head = ""
            end = ""
        }
        else {
            head = "<p class = \"" + type + "\">"
            end = "</p>"
        }
        document.getElementById("text").innerHTML += head + str + end
    }
    public static clear() {
        document.getElementById("text").innerHTML = ""
    }
    private static escapeHtml(str) {
        str = str.replace(/&/g, '&amp;')
        str = str.replace(/</g, '&lt;')
        str = str.replace(/>/g, '&gt;')
        str = str.replace(/"/g, '&quot;')
        str = str.replace(/'/g, '&#39;')
        str = str.replace(/'/g, '&#39;')
        return str;
    }
}