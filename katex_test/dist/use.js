var table_name = ["table1", "table2", "table3", "table4", "table5", "table6"]
table_name.forEach(e => {
    var table = document.getElementById(e)
    for (var i = 0; i < table.rows.length; i++) {
        renderMathInElement(table.rows[i].cells[2])
    }
})
var table_name2 = ["moji_table", "symbol_table"]
table_name2.forEach(e => {
    var table = document.getElementById(e)
    for (var i = 0; i < table.rows.length; i++) {
        for (var i2 = 0; i2 < table.rows[i].cells.length; i2++) {
            renderMathInElement(table.rows[i].cells[i2])
        }
    }
})
renderMathInElement(document.getElementById("example_space"))