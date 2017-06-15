import { Component, ViewContainerRef, ComponentFactoryResolver, ViewChild, ElementRef } from "@angular/core";
import { Matrix } from "./Matrix.js";
import { State } from "./Cell.js";


@Component({
    selector: "result-matrix",
    template: `
        <div #titleDiv class="info text-center"></div>

        <div #matrix  class="result-matrix">

        </div>
        <div #resultDiv class="info text-center"></div>
        `
})
export class ResultMatrixComponent
{
    private readonly componentFactoryResolver: ComponentFactoryResolver;
    private readonly viewContainerRef: ViewContainerRef;

    @ViewChild("matrix")
    private matrixContainer: ElementRef;


    @ViewChild("resultDiv")
    private resultDiv: ElementRef;

    @ViewChild("titleDiv")
    private titleDiv: ElementRef;

    constructor(viewContainerRef: ViewContainerRef,
        componentFactoryResolver: ComponentFactoryResolver)
    {
        this.componentFactoryResolver = componentFactoryResolver;
        this.viewContainerRef = viewContainerRef;
    }

    public setModiResultMatrix(value: Matrix, isLast: boolean = false, isFirst = false)
    {
        let header = `<div class="result-header">`;

        for (let i = 0; i < value.Columns; i++)
        {
            header += `<p class="mhead pull-left">O <sub>${i + 1}</sub></p>`;
        }

        header += `<p class="mhead pull-left">u<sub>i</sub></p>`;


        this.matrixContainer.nativeElement.innerHTML += `${header}</div>`;

        for (let i = 0; i < value.Rows; i++)
        {
            let row = `<div class="result-row">`;

            if (i + 1 < 10)
            {
                row += `<p class="mhead pull-left">I <sub>${i + 1}</sub></p>`;
            } else
            {
                row += `<p class="mhead pull-left" style="margin-right: 5px;">I<sub>${i + 1}</sub></p>`;
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
                    row += `<div class="result-cell pull-left allocated line"><span>${value.Array[i][j].Value
                        }</span>&nbsp;<span style="color: #50c878;">(${value.Array[i][j].Allocated})</span></div>`;
                } else
                {
                    row += `<div class="result-cell pull-left relative-allocated"><span>${value.Array[i][j].Value
                        }</span>&nbsp;<span style="color: crimson;">(${value.Array[i][j].Allocated})</span></div>`;
                }
            }

            row += `<div class="result-cell pull-left ui"><span>${value.U[i]}<span></div>`;


            this.matrixContainer.nativeElement.innerHTML += `${row}</div>`;
        }

        let demandsRow = `<div class="result-row">`;
        demandsRow += `<p class="mhead pull-left">v<sub>j</sub> </p>`;

        for (let i = 0; i < value.Columns; i++)
        {
            demandsRow += `<div class="result-cell pull-left vj"><span>${value.V[i]}<span></div>`;
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


        if (isFirst)
        {
            this.titleDiv.nativeElement.innerHTML += `<p class="title">Optimizacija pomoću MODI metode:</p>`;
        }

        if (isLast)
        {
            this.resultDiv.nativeElement.innerHTML += `<p class="title">Rezultat nakon optimizacije:</p><p class="title">${value.ResultFunction}</p>`;
        }


        $(".result-matrix").find(".result-cell").toArray().forEach(e => $(e).css("min-width", maxWidth));
        $(".result-matrix").find(".result-header .mhead").toArray().forEach(e => $(e).css("width", maxWidth));
    }

    public setResultMatrix(value: Matrix)
    {
        let header = `<div class="result-header">`;

        for (let i = 0; i < value.Columns; i++)
        {
            header += `<p class="mhead pull-left">O <sub>${i + 1}</sub></p>`;
        }

        header += `<p class="mhead pull-left">I</p>`;


        this.matrixContainer.nativeElement.innerHTML += `${header}</div>`;

        for (let i = 0; i < value.Rows; i++)
        {
            let row = `<div class="result-row">`;

            if (i + 1 < 10)
            {
                row += `<p class="mhead pull-left">I <sub>${i + 1}</sub></p>`;
            } else
            {
                row += `<p class="mhead pull-left" style="margin-right: 5px;">I<sub>${i + 1}</sub></p>`;
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
                    row += `<div class="result-cell pull-left allocated line"><span>${value.Array[i][j].Value
                        }</span>&nbsp;<span style="color: #50c878;">(${value.Array[i][j].Allocated})</span></div>`;
                } else
                {
                    row += `<div class="result-cell pull-left relative-allocated"><span>${value.Array[i][j].Value
                        }</span>&nbsp;<span style="color: crimson;">(${value.Array[i][j].Allocated})</span></div>`;
                }
            }

            row += `<div class="result-cell pull-left supply"><span>${value.Supplies[i]}<span></div>`;


            this.matrixContainer.nativeElement.innerHTML += `${row}</div>`;
        }

        let demandsRow = `<div class="result-row">`;
        demandsRow += `<p class="mhead pull-left">O </p>`;

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