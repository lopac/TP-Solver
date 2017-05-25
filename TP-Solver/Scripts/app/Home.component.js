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
var ContainerComponent = (function () {
    function ContainerComponent(componentFactoryResolver, viewContainerRef) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.viewContainerRef = viewContainerRef;
        var factory = this.componentFactoryResolver.resolveComponentFactory(Matrix_component_js_1.MatrixComponent);
        var ref = this.viewContainerRef.createComponent(factory);
        this.rows = ref.instance.matrixService.getRows();
        this.columns = ref.instance.matrixService.getColumns();
        ref.changeDetectorRef.detectChanges();
    }
    ContainerComponent.prototype.ngAfterViewInit = function () {
    };
    ContainerComponent.prototype.init = function () {
    };
    return ContainerComponent;
}());
ContainerComponent = __decorate([
    core_1.Component({
        selector: 'container',
        template: "<p class=\"lead pull-left text-center\">Rows</p>\n        <p class=\"lead pull-right text-center\">Columns</p>\n        <span class=\"clear\"></span>\n\n        <div class=\"buttons\">\n            <button class=\"btn btn-default pull-left\"><span class=\"glyphicon glyphicon-minus\"></span></button>\n            <p class=\"pull-left\">{{rows}}</p>\n            <button class=\"btn btn-default pull-left\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n\n            <button class=\"btn btn-default pull-right\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n            <p class=\"pull-right\">{{columns}}</p>\n            <button class=\"btn btn-default pull-right\"><span class=\"glyphicon glyphicon-minus\"></span></button>\n\n            <span class=\"clear\"></span>\n        </div>\n        "
    }),
    __metadata("design:paramtypes", [core_2.ComponentFactoryResolver,
        core_3.ViewContainerRef])
], ContainerComponent);
exports.ContainerComponent = ContainerComponent;
//# sourceMappingURL=Home.component.js.map