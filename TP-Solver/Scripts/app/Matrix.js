"use strict";
var Matrix = (function () {
    function Matrix(rows, columns) {
        this.Rows = 0;
        this.Columns = 0;
        this.Supplies = [];
        this.Demands = [];
        this.U = [];
        this.V = [];
        this.ResultFunction = "";
        this.Rows = rows;
        this.Columns = columns;
        this.Array = new Array(this.Rows);
        for (var i = 0; i < rows; i++) {
            this.Array[i] = Array(this.Columns);
        }
    }
    return Matrix;
}());
exports.Matrix = Matrix;
//# sourceMappingURL=Matrix.js.map