"use strict";
var Matrix = (function () {
    function Matrix(rows, columns) {
        this.rows = 0;
        this.columns = 0;
        this.matrix = [];
        this.supplies = [];
        this.demands = [];
        this.rows = rows;
        this.columns = columns;
        for (var i = 0; i < rows; i++) {
            this.matrix[i] = [];
        }
    }
    return Matrix;
}());
exports.Matrix = Matrix;
//# sourceMappingURL=Matrix.js.map