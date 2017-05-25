"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var CellComponent = (function () {
    function CellComponent() {
        this.value = null;
    }
    CellComponent.prototype.refreshValue = function (value) {
        this.value = value;
        console.log(this.value);
    };
    return CellComponent;
}());
CellComponent = __decorate([
    core_1.Component({
        selector: "matrix",
        template: "<input #cell (keyup)=\"refreshValue(cell.value);\" cell.value='' />"
    })
], CellComponent);
exports.CellComponent = CellComponent;
//# sourceMappingURL=Table.component.js.map