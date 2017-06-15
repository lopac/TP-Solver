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
var Cell_js_1 = require("./Cell.js");
var ResultMatrixComponent = (function () {
    function ResultMatrixComponent(viewContainerRef, componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.viewContainerRef = viewContainerRef;
    }
    ResultMatrixComponent.prototype.setResultMatrix = function (value) {
        var header = "<div class=\"result-header\">";
        for (var i = 0; i < value.Columns; i++) {
            header += "<p class=\"mhead pull-left\">D " + (i + 1) + "</p>";
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
                if (value.Array[i][j].State === Cell_js_1.State.NotAllocated) {
                    row += "<div class=\"result-cell pull-left\"><span>" + value.Array[i][j].Value + "</span></div>";
                }
                else if (value.Array[i][j].State === Cell_js_1.State.Processed) {
                    row += "<div class=\"result-cell pull-left crossed\"><span>" + value.Array[i][j].Value + "</span></div>";
                }
                else if (value.Array[i][j].State === Cell_js_1.State.Allocated) {
                    row += "<div class=\"result-cell pull-left allocated\"><span>" + value.Array[i][j].Allocated + "</span><strong> / </strong><span>" + value.Array[i][j].Value + "</span></div>";
                }
                else {
                    row += "<div class=\"result-cell pull-left relative-allocated\"><span>" + value.Array[i][j].Allocated + "</span><strong> / </strong><span>" + value.Array[i][j].Value + "</span></div>";
                }
            }
            row += "<div class=\"result-cell pull-left supply\"><span>" + value.Supplies[i] + "<span></div>";
            this.matrixContainer.nativeElement.innerHTML += row + "</div>";
        }
        var demandsRow = "<div class=\"result-row\">";
        demandsRow += "<p class=\"mhead pull-left\">D </p>";
        for (var i = 0; i < value.Columns; i++) {
            demandsRow += "<div class=\"result-cell pull-left demand\"><span>" + value.Demands[i] + "<span></div>";
        }
        this.matrixContainer.nativeElement.innerHTML += demandsRow + "</div>";
        var maxWidth = 0;
        $(this.matrixContainer.nativeElement).find(".result-cell").toArray().forEach(function (e) {
            var width = Number($(e).css("width").split("px")[0]);
            if (width > maxWidth) {
                maxWidth = width;
            }
        });
        $(".result-matrix").find(".result-cell").toArray().forEach(function (e) { return $(e).css("min-width", maxWidth); });
        $(".result-matrix").find(".result-header .mhead").toArray().forEach(function (e) { return $(e).css("width", maxWidth); });
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