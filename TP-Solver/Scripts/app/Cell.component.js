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
var CellComponent = (function () {
    function CellComponent(element) {
        this.row = -1;
        this.col = -1;
        this.element = element;
    }
    Object.defineProperty(CellComponent.prototype, "value", {
        get: function () { return $(this.element.nativeElement).find("input").val(); },
        set: function (value) {
            $(this.element.nativeElement).find("input").val(value);
        },
        enumerable: true,
        configurable: true
    });
    CellComponent.prototype.ngAfterViewInit = function () {
    };
    return CellComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], CellComponent.prototype, "row", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], CellComponent.prototype, "col", void 0);
CellComponent = __decorate([
    core_1.Component({
        selector: "cell",
        template: "\n        <div class=\"form-group\" >\n            <input class=\"form-control\" value=\"0\" type=\"number\" required/>\n        </div>\n        "
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], CellComponent);
exports.CellComponent = CellComponent;
//# sourceMappingURL=Cell.component.js.map