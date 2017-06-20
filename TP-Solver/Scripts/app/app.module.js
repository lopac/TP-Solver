"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var Container_component_js_1 = require("./Container.component.js");
var Cell_component_js_1 = require("./Cell.component.js");
var Matrix_component_js_1 = require("./Matrix.component.js");
var ResultMatrix_component_js_1 = require("./ResultMatrix.component.js");
var MatrixService_js_1 = require("./MatrixService.js");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule],
        declarations: [Container_component_js_1.ContainerComponent, Matrix_component_js_1.MatrixComponent, Cell_component_js_1.CellComponent, ResultMatrix_component_js_1.ResultMatrixComponent],
        entryComponents: [Matrix_component_js_1.MatrixComponent, ResultMatrix_component_js_1.ResultMatrixComponent],
        providers: [MatrixService_js_1.MatrixService],
        exports: [Container_component_js_1.ContainerComponent],
        bootstrap: [Container_component_js_1.ContainerComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map