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
var core_2 = require("@angular/core");
var core_3 = require("@angular/core");
var Matrix_component_js_1 = require("./Matrix.component.js");
var MatrixService_js_1 = require("./MatrixService.js");
var ContainerComponent = (function () {
    function ContainerComponent(componentFactoryResolver, viewContainerRef) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.viewContainerRef = viewContainerRef;
        this.matrixRef = null;
        this.resetMatrix(4, 4);
    }
    ContainerComponent.prototype.resetMatrix = function (rows, cols) {
        if (this.matrixRef) {
            this.matrixRef.destroy();
        }
        this.rows = rows;
        this.columns = cols;
        MatrixService_js_1.MatrixSize.Instance.rows = this.rows;
        MatrixService_js_1.MatrixSize.Instance.columns = this.columns;
        var factory = this.componentFactoryResolver.resolveComponentFactory(Matrix_component_js_1.MatrixComponent);
        this.matrixRef = this.viewContainerRef.createComponent(factory);
        this.matrixRef.changeDetectorRef.detectChanges();
    };
    ContainerComponent.prototype.decrementRows = function () {
        if (this.rows > 2) {
            this.resetMatrix(this.rows - 1, this.columns);
        }
    };
    ContainerComponent.prototype.incrementRows = function () {
        if ((this.rows - 1) < 20) {
            this.resetMatrix(this.rows + 1, this.columns);
        }
    };
    ContainerComponent.prototype.decrementCols = function () {
        if (this.columns > 2) {
            this.resetMatrix(this.rows, this.columns - 1);
        }
    };
    ContainerComponent.prototype.incrementCols = function () {
        if ((this.columns - 1) < 10) {
            this.resetMatrix(this.rows, this.columns + 1);
        }
    };
    return ContainerComponent;
}());
ContainerComponent = __decorate([
    core_1.Component({
        selector: 'container',
        template: "\n        <h5 class=\"text-center\">Izradio <strong>Antonio Lopac</strong>, FOI 3. godina Informacijski sustavi</h5>\n        <h5 class=\"text-left\">Opis rada algoritma</h5>\n        <p class=\"lead text-justify\" style=\"max-width: 400px; margin: auto auto; word-break: normal;\">\n            Nakon zahtjeva korisnika za izra\u010Dunom pokre\u0107e se algoritam. Odluka o metodi za po\u010Detni raspored tereta odre\u0111uje se prema manjoj kompleksnosti.\n            Implementirane metode su: <strong>Metoda sjeverozapadnog kuta</strong>,\n            <strong>Metoda relativnih tro\u0161kova</strong> te <strong>Vogelova aproksimativna metoda</strong>. Za optimizaciju po\u010Detnog rasporeda tereta koristi se <strong>MODI metoda</strong>.</p>\n        <hr/>\n        <div class=\"buttons row text-center\" style=\"margin: 0;\">\n            <p class=\"lead col-md-3 col-md-offset-2 col-sm-4 col-sm-offset-2 col-xs-4 col-xs-offset-2 text-center\">Ishodi\u0161ta</p>\n\n            <button class=\"btn btn-default col-md-2 col-sm-2 col-xs-2\" (click)=\"decrementRows()\"><span class=\"glyphicon glyphicon-minus\"></span></button>\n            <p class=\"col-md-1 col-sm-1 col-xs-1\">{{rows - 1}}</p>\n            <button class=\"btn btn-default col-md-2 col-sm-2 col-xs-2\" (click)=\"incrementRows()\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n        </div>\n\n        <div class=\"buttons row text-center\" style=\"margin: 0;\">\n            <p class=\"lead col-md-3 col-md-offset-2  col-sm-4  col-sm-offset-2 col-xs-4  col-xs-offset-2 text-center\">Odredi\u0161ta</p>\n\n            <button class=\"btn btn-default col-md-2  col-sm-2 col-xs-2\" (click)=\"decrementCols()\"><span class=\"glyphicon glyphicon-minus\"></span></button>\n            <p class=\"col-md-1 col-sm-1 col-xs-1\">{{columns - 1}}</p>\n            <button class=\"btn btn-default col-md-2 col-sm-2 col-xs-2\" (click)=\"incrementCols()\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n\n        </div>\n        "
    }),
    __metadata("design:paramtypes", [core_2.ComponentFactoryResolver,
        core_3.ViewContainerRef])
], ContainerComponent);
exports.ContainerComponent = ContainerComponent;
//# sourceMappingURL=Container.component.js.map