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
var ResultMatrix_component_js_1 = require("./ResultMatrix.component.js");
var MatrixComponent = (function () {
    function MatrixComponent(matrixService, target, componentFactoryResolver) {
        this.matrixService = matrixService;
        this.target = target;
        this.componentFactoryResolver = componentFactoryResolver;
        this.columns = [];
        this.rows = [];
        this.cells = [];
        this.cellsViews = [];
        this.resultMatrices = [];
        this._rows = 0;
        this._cols = 0;
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
        var matrix = new Matrix_js_1.Matrix(this._rows - 1, this._cols - 1);
        for (var _i = 0, _a = this.cellsArray.toArray(); _i < _a.length; _i++) {
            var cell = _a[_i];
            var row = Number(cell.row);
            var col = Number(cell.col);
            var value = cell.value;
            if (row === matrix.rows && col !== matrix.columns) {
                matrix.demands.push(value);
            }
            else if (col === matrix.columns && row !== matrix.rows) {
                matrix.supplies.push(value);
            }
            else if (row !== matrix.rows && col !== matrix.columns) {
                matrix.matrix[row][col] = value;
            }
        }
        return matrix;
    };
    MatrixComponent.prototype.calculate = function () {
        var _this = this;
        var matrix = this.buildMatrix();
        console.log(this.buildMatrix());
        $.post("/api/Solve/NorthWest", matrix, function (data) { return _this.showResult(data); }).fail(function (f) { return alert(f.responseJSON.ExceptionMessage); });
    };
    MatrixComponent.prototype.showResult = function (result) {
        for (var _i = 0, _a = this.resultMatrices; _i < _a.length; _i++) {
            var matrix = _a[_i];
            matrix.destroy();
        }
        this.resultTitle.nativeElement.innerHTML = "Result:";
        this.resultView.nativeElement.innerHTML = result.resultFunction;
        if (result.matrices.length > 0) {
            this.resultStepsTitle.nativeElement.innerHTML = "Steps:";
            for (var _b = 0, _c = result.matrices; _b < _c.length; _b++) {
                var resultMatrix = _c[_b];
                var factory = this.componentFactoryResolver.resolveComponentFactory(ResultMatrix_component_js_1.ResultMatrixComponent);
                var component = this.target.createComponent(factory);
                this.resultMatrices.push(component);
                component.instance.setResultMatrix(resultMatrix);
            }
        }
    };
    MatrixComponent.prototype.reset = function () {
        for (var _i = 0, _a = this.cellsArray.toArray(); _i < _a.length; _i++) {
            var cell = _a[_i];
            cell.value = 0;
        }
        for (var _b = 0, _c = this.resultMatrices; _b < _c.length; _b++) {
            var matrix = _c[_b];
            matrix.destroy();
        }
        this.resultTitle.nativeElement.innerHTML = "";
        this.resultView.nativeElement.innerHTML = "";
        this.resultStepsTitle.nativeElement.innerHTML = "";
    };
    return MatrixComponent;
}());
__decorate([
    core_1.ViewChildren("cell"),
    __metadata("design:type", core_1.QueryList)
], MatrixComponent.prototype, "cellsArray", void 0);
__decorate([
    core_1.ViewChild("result"),
    __metadata("design:type", core_1.ElementRef)
], MatrixComponent.prototype, "resultView", void 0);
__decorate([
    core_1.ViewChild("resultTitle"),
    __metadata("design:type", core_1.ElementRef)
], MatrixComponent.prototype, "resultTitle", void 0);
__decorate([
    core_1.ViewChild("resultStepsTitle"),
    __metadata("design:type", core_1.ElementRef)
], MatrixComponent.prototype, "resultStepsTitle", void 0);
MatrixComponent = __decorate([
    core_1.Component({
        selector: "matrix",
        template: "\n\n\n        <div #matrix class=\"matrix\">\n\n            <div class=\"column\" >\n                <p *ngFor=\"let s of rows\" class=\"{{s.Class}}\"  >{{s.value}}</p>\n            </div>\n\n            <div class=\"column\" *ngFor=\"let col of columns\">\n                <p class=\"mhead text-center\">{{col.Value}}</p>\n                <cell *ngFor=\"let row of cells\" #cell row=\"{{row.id}}\" col=\"{{col.id}}\"  class=\"{{row.Class}} {{col.Class}}\" ></cell>\n            </div>\n        </div>\n\n        <button (click)=\"calculate()\" class=\"btn btn-primary btn-lg btn-block col-md-12\">Calculate</button>\n        <button (click)=\"reset()\" class=\"btn btn-default btn-lg btn-block col-md-12\">Reset</button>\n\n        <p #resultTitle class=\"title\" ></p>\n        <p #result></p>\n        <p #resultStepsTitle class=\"title\"></p>\n\n"
    }),
    __metadata("design:paramtypes", [MatrixService_js_1.MatrixService, core_1.ViewContainerRef,
        core_1.ComponentFactoryResolver])
], MatrixComponent);
exports.MatrixComponent = MatrixComponent;
//# sourceMappingURL=Matrix.component.js.map