import { Component, ViewContainerRef, ComponentFactoryResolver, ViewChild, ElementRef } from "@angular/core";
import { ResultMatrix } from "./ResultMatrix.js";


@Component({
    selector: "result-matrix",
    template: `
        <div #matrix  class="result-matrix">

        </div>
        `
})
export class ResultMatrixComponent {

    @ViewChild("matrix")
    private matrixContainer: ElementRef;

    constructor(private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) {


    }

    public setResultMatrix(value: ResultMatrix) {

        let header = `<div class="result-header">`;

        for (let i = 0; i < value.Columns; i++) {
            header += `<p class="mhead pull-left">D ${i + 1}</p>`;
        }

        header += `<p class="mhead pull-left">S</p>`;


        this.matrixContainer.nativeElement.innerHTML += `${header}</div>`;

        for (var i = 0; i < value.Rows; i++) {
            let row = `<div class="result-row">`;

            if (i + 1 < 10) {
                row += `<p class="mhead pull-left">S ${i + 1}</p>`;
            } else {
                row += `<p class="mhead pull-left" style="margin-right: 5px;">S${i + 1}</p>`;
            }


            for (var j = 0; j < value.Columns; j++) {
                if (value.Matrix[i][j].Allocated == -1) {
                    row += `<div class="result-cell pull-left"><span>${value.Matrix[i][j].Value}</span></div>`;

                } else if (value.Matrix[i][j].Allocated == 0) {
                    row += `<div class="result-cell pull-left crossed"><span>${value.Matrix[i][j].Value}</span></div>`;
                } else {
                    row += `<div class="result-cell pull-left allocated"><span>${value.Matrix[i][j].Allocated
                        }</span><strong> / </strong><span>${value.Matrix[i][j].Value}</span></div>`;
                }

            }

            row += `<div class="result-cell pull-left supply"><span>${value.Supplies[i]}<span></div>`;


            this.matrixContainer.nativeElement.innerHTML += `${row}</div>`;
        }

        let demandsRow = `<div class="result-row">`;
        demandsRow += `<p class="mhead pull-left">D </p>`;

        for (let i = 0; i < value.Columns; i++) {
            demandsRow += `<div class="result-cell pull-left demand"><span>${value.Demands[i]}<span></div>`;
        }



        this.matrixContainer.nativeElement.innerHTML += `${demandsRow}</div>`;


        let maxWidth = 0;


        $(this.matrixContainer.nativeElement).find(".result-cell").toArray().forEach(e => {
            let width = Number($(e).css("width").split("px")[0]);
            if (width > maxWidth) {
                maxWidth = width;
            }

        });

        $(this.matrixContainer.nativeElement).find(".result-cell").toArray().forEach(e => $(e).css("min-width",maxWidth));
        $(this.matrixContainer.nativeElement).find(".result-header .mhead").toArray().forEach(e => $(e).css("width",maxWidth));

    }
}