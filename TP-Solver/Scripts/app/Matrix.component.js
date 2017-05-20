"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Matrix_js_1 = require("./Matrix.js");
var MatrixService_js_1 = require("./MatrixService.js");
var MatrixComponent = (function () {
    function MatrixComponent(matrixService) {
        this.columns = [];
        this.rows = [];
        this.cells = [];
        this.cellsViews = [];
        this._rows = 0;
        this._cols = 0;
        this.matrixService = matrixService;
        this._rows = this.matrixService.matrixSize.rows;
        this._cols = this.matrixService.matrixSize.columns;
        for (var i = 0; i < this._cols; i++) {
            this.columns.push(i === this._cols - 1
                ? { Class: "finalColumn", Value: "S", id: i }
                : { Class: "", Value: "D " + (i + 1), id: i });
        }
        for (var i = 0; i < this._rows; i++) {
            this.cells.push(i === this._rows - 1
                ? { Class: "finalRow", id: i }
                : { Class: "", id: i });
            this.rows.push(i !== this._rows - 1
                ? { Class: "mhead", value: "S " + (i + 1) }
                : { Class: "mhead last", value: "D" });
        }
    }
    MatrixComponent.prototype.buildMatrix = function () {
        this.model = new Matrix_js_1.Matrix(this._rows - 1, this._cols - 1);
        for (var _i = 0, _a = this.cellsArray.toArray(); _i < _a.length; _i++) {
            var cell = _a[_i];
            var row = Number(cell.row);
            var col = Number(cell.col);
            if (row === this.model.rows && col !== this.model.columns) {
                this.model.demands.push(cell.value);
            }
            else if (col === this.model.columns && row !== this.model.rows) {
                this.model.supplies.push(cell.value);
            }
            else if (row !== this.model.rows && col !== this.model.columns) {
                this.model.matrix[row][col] = Number(cell.value);
            }
        }
        console.log(JSON.stringify(this.model));
        $.post("/api/Solve/NorthWest", this.model, function (data) {
            var resultMatrices = data;
            console.log(JSON.stringify(resultMatrices));
        }).fail();
    };
    MatrixComponent.prototype.calculate = function () {
        this.buildMatrix();
    };
    MatrixComponent.prototype.ngAfterViewInit = function () {
    };
    return MatrixComponent;
}());
__decorate([
    core_1.ViewChildren("cell"),
    __metadata("design:type", core_1.QueryList)
], MatrixComponent.prototype, "cellsArray", void 0);
MatrixComponent = __decorate([
    core_1.Component({
        selector: "matrix",
        template: "\n        <div #matrix class=\"matrix\">\n\n            <div class=\"column\" >\n                <p *ngFor=\"let s of rows\" class=\"{{s.Class}}\" style=\"height: 38px; margin-bottom: 15px;\" >{{s.value}}</p>\n            </div>\n\n            <div class=\"column\" *ngFor=\"let col of columns\">\n                <p class=\"mhead text-center\">{{col.Value}}</p>\n                <cell *ngFor=\"let row of cells\" #cell row=\"{{row.id}}\" col=\"{{col.id}}\"  class=\"{{row.Class}} {{col.Class}}\" ></cell>\n            </div>\n        </div>\n        <button (click)=\"calculate()\" class=\"btn btn-default btn-lg btn-block\">Calculate</button>\n"
    }),
    __metadata("design:paramtypes", [MatrixService_js_1.MatrixService])
], MatrixComponent);
exports.MatrixComponent = MatrixComponent;
//# sourceMappingURL=Matrix.component.js.map