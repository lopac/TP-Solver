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
var Cell_js_1 = require("./Cell.js");
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
                ? { Class: "finalColumn", Title: "I", Value: "", id: i }
                : { Class: "", Title: "O ", Value: "" + (i + 1), id: i });
        }
        for (var i = 0; i < this._rows; i++) {
            this.cells.push(i === this._rows - 1
                ? { Class: "finalRow", id: i }
                : { Class: "", id: i });
            this.rows.push(i !== this._rows - 1
                ? { Class: "mhead", Title: "I ", value: "" + (i + 1) }
                : { Class: "mhead last", Title: "O", value: "" });
        }
    }
    MatrixComponent.prototype.setCellsValueToRandom = function () {
        for (var _i = 0, _a = this.cellsArray.toArray(); _i < _a.length; _i++) {
            var cell = _a[_i];
            cell.value = Math.floor((Math.random() * 80) + 1);
        }
    };
    MatrixComponent.prototype.buildMatrix = function () {
        var matrix = new Matrix_js_1.Matrix(this._rows - 1, this._cols - 1);
        for (var _i = 0, _a = this.cellsArray.toArray(); _i < _a.length; _i++) {
            var cell = _a[_i];
            var row = Number(cell.row);
            var col = Number(cell.col);
            var value = Number(cell.value);
            if (row === matrix.Rows && col !== matrix.Columns) {
                matrix.Demands.push(value);
            }
            else if (col === matrix.Columns && row !== matrix.Rows) {
                matrix.Supplies.push(value);
            }
            else if (row !== matrix.Rows && col !== matrix.Columns) {
                matrix.Array[row][col] = new Cell_js_1.Cell();
                matrix.Array[row][Number(col)].Value = value;
            }
        }
        return matrix;
    };
    MatrixComponent.prototype.calculate = function () {
        var _this = this;
        var matrix = this.buildMatrix();
        $.ajax({
            type: "POST",
            data: JSON.stringify(matrix),
            url: "api/Solve",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                console.log(data);
                _this.showResult(data);
            },
            error: function (e) {
                console.log(e);
            }
        });
    };
    MatrixComponent.prototype.showResult = function (result) {
        for (var _i = 0, _a = this.resultMatrices; _i < _a.length; _i++) {
            var matrix = _a[_i];
            matrix.destroy();
        }
        this.resultTitle.nativeElement.innerHTML = "Rezultat:";
        this.resultView.nativeElement.innerHTML = result.StepsMatrices[result.StepsMatrices.length - 1].ResultFunction;
        var factory = this.componentFactoryResolver.resolveComponentFactory(ResultMatrix_component_js_1.ResultMatrixComponent);
        var component = this.target.createComponent(factory);
        this.resultMatrices.push(component);
        component.instance.setResultMatrix(result.InitialMatrix);
        this.infoDiv.nativeElement.innerHTML = "<p>Kori\u0161tena metoda za pronalazak po\u010Detnog rasporeda:<p/><p>" + result.UsedFeasibleMethod + "</p><p>Inicijalna matrica:</p>";
        if (result.StepsMatrices.length > 0) {
            this.resultStepsTitle.nativeElement.innerHTML = "Koraci: ";
            for (var _b = 0, _c = result.StepsMatrices; _b < _c.length; _b++) {
                var resultMatrix = _c[_b];
                var factory_1 = this.componentFactoryResolver.resolveComponentFactory(ResultMatrix_component_js_1.ResultMatrixComponent);
                var component_1 = this.target.createComponent(factory_1);
                this.resultMatrices.push(component_1);
                component_1.instance.setResultMatrix(resultMatrix);
            }
            var isFirst = true;
            for (var _d = 0, _e = result.ModiStepsMatrices; _d < _e.length; _d++) {
                var resultMatrix = _e[_d];
                var factory_2 = this.componentFactoryResolver.resolveComponentFactory(ResultMatrix_component_js_1.ResultMatrixComponent);
                var component_2 = this.target.createComponent(factory_2);
                this.resultMatrices.push(component_2);
                if (resultMatrix == result.ModiStepsMatrices[result.ModiStepsMatrices.length - 1]) {
                    component_2.instance.setModiResultMatrix(resultMatrix, true);
                }
                else {
                    component_2.instance.setModiResultMatrix(resultMatrix, false, isFirst);
                    isFirst = false;
                }
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
        this.infoDiv.nativeElement.innerHTML = "";
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
    core_1.ViewChild("info"),
    __metadata("design:type", core_1.ElementRef)
], MatrixComponent.prototype, "infoDiv", void 0);
__decorate([
    core_1.ViewChild("resultStepsTitle"),
    __metadata("design:type", core_1.ElementRef)
], MatrixComponent.prototype, "resultStepsTitle", void 0);
MatrixComponent = __decorate([
    core_1.Component({
        selector: "matrix",
        template: "\n        <div #matrix>\n            <div class=\"matrix\">\n                <div class=\"column\">\n                    <p *ngFor=\"let s of rows\" class=\"{{s.Class}}\">{{s.Title}}<sub>{{s.value}}</sub></p>\n                </div>\n\n                <div class=\"column\" *ngFor=\"let col of columns\">\n                    <p class=\"mhead text-center\">{{col.Title}}<sub>{{col.Value}}</sub></p>\n                    <cell *ngFor=\"let row of cells\" #cell row=\"{{row.id}}\" col=\"{{col.id}}\" class=\"{{row.Class}} {{col.Class}}\"></cell>\n                </div>\n            </div>\n            <button (click)=\"calculate()\" class=\"btn btn-primary btn-block btn-lg\">Izra\u010Dunaj</button>\n            <button (click)=\"setCellsValueToRandom()\" id=\"rand-btn\" style=\"display: none;\" class=\"btn btn-info btn-block btn-lg\">Nasumi\u010Dni brojevi</button>\n            <button (click)=\"reset()\" class=\"btn btn-default btn-block btn-lg\">Resetiraj</button>\n        </div>\n\n        <p class=\"text-center\"><i class=\"glyphicon green-circle\"> </i> Alokacija</p>\n        <p class=\"text-center\"><i class=\"glyphicon red-circle\"> </i> Relativni tro\u0161ak</p>\n\n        <p #resultTitle class=\"title\" style=\"max-width: 600px;display: block; word-wrap: break-word;\"></p>\n        <p #result></p>\n\n\n        <p #resultStepsTitle class=\"title\"></p>\n        <div #info class=\"info text-center\"></div>\n\n"
    }),
    __metadata("design:paramtypes", [MatrixService_js_1.MatrixService,
        core_1.ViewContainerRef,
        core_1.ComponentFactoryResolver])
], MatrixComponent);
exports.MatrixComponent = MatrixComponent;
//# sourceMappingURL=Matrix.component.js.map