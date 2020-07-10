export class Output{
    public static print(str: string, type: string = "normal") {
        let head: string, end: string
        head = "<p class = \"" + type + "\">"
        end = "</p>"
        document.getElementById("text").innerHTML += head + str + end
    }
    public static clear() {
        document.getElementById("text").innerHTML = ""
    }
}