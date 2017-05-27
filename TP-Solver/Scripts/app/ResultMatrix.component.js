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
var ResultMatrixComponent = (function () {
    function ResultMatrixComponent(viewContainerRef, componentFactoryResolver) {
        this.viewContainerRef = viewContainerRef;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    ResultMatrixComponent.prototype.setResultMatrix = function (value) {
        var header = "<div class=\"result-header\">";
        for (var i_1 = 0; i_1 < value.Rows; i_1++) {
            header += "<p class=\"mhead pull-left\">D " + (i_1 + 1) + "</p>";
        }
        header += "<p class=\"mhead pull-left\">S</p>";
        this.matrixContainer.nativeElement.innerHTML += header + "</div>";
        for (var i = 0; i < value.Rows; i++) {
            var row = "<div class=\"result-row\">";
            if (i + 1 < 10) {
                row += "<p class=\"mhead pull-left\">S " + (i + 1) + "</p>";
            }
            else {
                row += "<p class=\"mhead pull-left\" style=\"margin-right: 5px;\">S" + (i + 1) + "</p>";
            }
            for (var j = 0; j < value.Columns; j++) {
                if (value.Matrix[i][j].Allocated == -1) {
                    row += "<div class=\"result-cell pull-left\"><span>" + value.Matrix[i][j].Value + "</span></div>";
                }
                else if (value.Matrix[i][j].Allocated == 0) {
                    row += "<div class=\"result-cell pull-left crossed\"><span>" + value.Matrix[i][j].Value + "</span></div>";
                }
                else {
                    row += "<div class=\"result-cell pull-left allocated\"><span>" + value.Matrix[i][j].Allocated + "</span><strong> / </strong><span>" + value.Matrix[i][j].Value + "</span></div>";
                }
            }
            row += "<div class=\"result-cell pull-left supply\"><span>" + value.Supplies[i] + "<span></div>";
            this.matrixContainer.nativeElement.innerHTML += row + "</div>";
        }
        var demandsRow = "<div class=\"result-row\">";
        demandsRow += "<p class=\"mhead pull-left\">D </p>";
        for (var i_2 = 0; i_2 < value.Columns; i_2++) {
            demandsRow += "<div class=\"result-cell pull-left demand\"><span>" + value.Demands[i_2] + "<span></div>";
        }
        this.matrixContainer.nativeElement.innerHTML += demandsRow + "</div>";
        var maxWidth = 0;
        $(this.matrixContainer.nativeElement).find(".result-cell").toArray().forEach(function (e) {
            var width = Number($(e).css("width").split("px")[0]);
            console.log(width);
            if (width > maxWidth) {
                maxWidth = width;
            }
        });
        $(this.matrixContainer.nativeElement).find(".result-cell").toArray().forEach(function (e) { return $(e).css("min-width", maxWidth); });
        $(this.matrixContainer.nativeElement).find(".result-header .mhead").toArray().forEach(function (e) { return $(e).css("width", maxWidth); });
    };
    return ResultMatrixComponent;
}());
__decorate([
    core_1.ViewChild("matrix"),
    __metadata("design:type", core_1.ElementRef)
], ResultMatrixComponent.prototype, "matrixContainer", void 0);
ResultMatrixComponent = __decorate([
    core_1.Component({
        selector: "result-matrix",
        template: "\n        <div #matrix  class=\"result-matrix\">\n\n        </div>\n        "
    }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef,
        core_1.ComponentFactoryResolver])
], ResultMatrixComponent);
exports.ResultMatrixComponent = ResultMatrixComponent;
//# sourceMappingURL=ResultMatrix.component.js.map