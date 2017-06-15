import { Component, ViewContainerRef, ComponentFactoryResolver, ViewChild, ElementRef } from "@angular/core";
import { Matrix } from "./Matrix.js";
import { State } from "./Cell.js";


@Component({
    selector: "result-matrix",
    template: `
        <div #matrix  class="result-matrix">

        </div>
        `
})
export class ResultMatrixComponent
{
    private readonly componentFactoryResolver: ComponentFactoryResolver;
    private readonly viewContainerRef: ViewContainerRef;

    @ViewChild("matrix")
    private matrixContainer: ElementRef;

    constructor(viewContainerRef: ViewContainerRef,
        componentFactoryResolver: ComponentFactoryResolver)
    {
        this.componentFactoryResolver = componentFactoryResolver;
        this.viewContainerRef = viewContainerRef;
    }

    public setResultMatrix(value: Matrix)
    {

        let header = `<div class="result-header">`;

        for (let i = 0; i < value.Columns; i++)
        {
            header += `<p class="mhead pull-left">D ${i + 1}</p>`;
        }

        header += `<p class="mhead pull-left">S</p>`;


        this.matrixContainer.nativeElement.innerHTML += `${header}</div>`;

        for (let i = 0; i < value.Rows; i++)
        {
            let row = `<div class="result-row">`;

            if (i + 1 < 10)
            {
                row += `<p class="mhead pull-left">S ${i + 1}</p>`;
            } else
            {
                row += `<p class="mhead pull-left" style="margin-right: 5px;">S${i + 1}</p>`;
            }


            for (let j = 0; j < value.Columns; j++)
            {
                if (value.Array[i][j].State === State.NotAllocated)
                {
                    row += `<div class="result-cell pull-left"><span>${value.Array[i][j].Value}</span></div>`;

                } else if (value.Array[i][j].State === State.Processed)
                {
                    row += `<div class="result-cell pull-left crossed"><span>${value.Array[i][j].Value}</span></div>`;
                } else if (value.Array[i][j].State === State.Allocated)
                {
                    row += `<div class="result-cell pull-left allocated"><span>${value.Array[i][j].Allocated
                        }</span><strong> / </strong><span>${value.Array[i][j].Value}</span></div>`;
                } else
                {
                    row += `<div class="result-cell pull-left relative-allocated"><span>${value.Array[i][j].Allocated
                        }</span><strong> / </strong><span>${value.Array[i][j].Value}</span></div>`;
                }

            }

            row += `<div class="result-cell pull-left supply"><span>${value.Supplies[i]}<span></div>`;


            this.matrixContainer.nativeElement.innerHTML += `${row}</div>`;
        }

        let demandsRow = `<div class="result-row">`;
        demandsRow += `<p class="mhead pull-left">D </p>`;

        for (let i = 0; i < value.Columns; i++)
        {
            demandsRow += `<div class="result-cell pull-left demand"><span>${value.Demands[i]}<span></div>`;
        }



        this.matrixContainer.nativeElement.innerHTML += `${demandsRow}</div>`;


        let maxWidth = 0;


        $(this.matrixContainer.nativeElement).find(".result-cell").toArray().forEach(e =>
        {
            const width = Number($(e).css("width").split("px")[0]);
            if (width > maxWidth)
            {
                maxWidth = width;
            }
        });

        $(".result-matrix").find(".result-cell").toArray().forEach(e => $(e).css("min-width", maxWidth));
        $(".result-matrix").find(".result-header .mhead").toArray().forEach(e => $(e).css("width", maxWidth));

    }
}