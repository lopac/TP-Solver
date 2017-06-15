import { Component, ComponentRef, ViewChild, ViewChildren, QueryList, ElementRef, ViewContainerRef,ComponentFactoryResolver } from "@angular/core";
import { Matrix } from "./Matrix.js";
import { MatrixService } from "./MatrixService.js";
import { CellComponent } from "./Cell.component.js";
import { Cell } from "./Cell.js";
import { ResultMatrixComponent } from "./ResultMatrix.component.js";

interface IResult
{
    InitialMatrix: Matrix;
    ModiOptimalMatrix: Matrix;
    VamStepsMatrices: Array<Matrix>;
}

@Component({
    selector: "matrix",
    template: `
        <div #matrix class="matrix">
            <div class="matrix">
            <div class="column" >
                <p *ngFor="let s of rows" class="{{s.Class}}"  >{{s.value}}</p>
            </div>

            <div class="column" *ngFor="let col of columns">
                <p class="mhead text-center">{{col.Value}}</p>
                <cell *ngFor="let row of cells" #cell row="{{row.id}}" col="{{col.id}}"  class="{{row.Class}} {{col.Class}}" ></cell>
            </div>
            </div>
            <button (click)="calculate()" class="btn btn-primary btn-block btn-lg">Izračunaj</button>
            <button (click)="setCellsValueToRandom()" class="btn btn-info btn-block btn-lg">Nasumični brojevi</button>
            <button (click)="reset()" class="btn btn-default btn-block btn-lg">Resetiraj</button>
        </div>

        <p #resultTitle class="title" style="max-width: 600px;display: block; word-wrap: break-word;"></p>
        <p #result></p>
        <p #resultStepsTitle class="title"></p>

`
})

export class MatrixComponent {

    public columns: Array<any> = [];
    public rows: Array<any> = [];
    public cells: Array<any> = [];
    public cellsViews: Array<CellComponent> = [];

    @ViewChildren("cell")
    cellsArray: QueryList<CellComponent>;
    @ViewChild("result")
    resultView: ElementRef;
    @ViewChild("resultTitle")
    resultTitle: ElementRef;

    @ViewChild("resultStepsTitle")
    resultStepsTitle: ElementRef;

    resultMatrices: Array<ComponentRef<ResultMatrixComponent>> = [];


    private _rows: number = 0;
    private _cols: number = 0;

    constructor(private matrixService: MatrixService,
        private target: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver)
    {
        this._rows = this.matrixService.matrixSize.rows;
        this._cols = this.matrixService.matrixSize.columns;


        for (let i = 0; i < this._cols; i++)
        {
            this.columns.push(i === this._cols - 1
                ? { Class: "finalColumn", Value: `I`, id: i }
                : { Class: "", Value: `O ${i + 1}`, id: i });
        }


        for (let i = 0; i < this._rows; i++)
        {
            this.cells.push(i === this._rows - 1
                ? { Class: "finalRow", id: i }
                : { Class: "", id: i });


            this.rows.push(i !== this._rows - 1
                ? { Class: "mhead", value: `I ${i + 1}` }
                : { Class: "mhead last", value: "O" });
        }
    }

    private setCellsValueToRandom()
    {
        for (let cell of this.cellsArray.toArray())
        {
            cell.value = Math.floor((Math.random() * 10) + 1);
        }
    }

    private buildMatrix(): Matrix
    {
        let matrix = new Matrix(this._rows - 1, this._cols - 1);

        for (let cell of this.cellsArray.toArray())
        {
            const row = Number(cell.row);
            const col = Number(cell.col);
            const value = Number(cell.value);

            //Demand cell
            if (row === matrix.Rows && col !== matrix.Columns)
            {
                matrix.Demands.push(value);
            }
            //Supply cell
            else if (col === matrix.Columns && row !== matrix.Rows)
            {
                matrix.Supplies.push(value);
            }
            //Regular cell
            else if (row !== matrix.Rows && col !== matrix.Columns)
            {
                matrix.Array[row][col] = new Cell();
                matrix.Array[row][Number(col)].Value = value;
            }
        }


        return matrix;
    }


    calculate()
    {
        let matrix = this.buildMatrix();


        //console.log(this.buildMatrix());


        $.ajax({
            type: "POST",
            data: JSON.stringify(matrix),
            url: "api/Solve",
            contentType: "application/json",
            dataType: "json",
            success: data =>
            {
                console.log(data);
                this.showResult(data);
            },
            error: e =>
            {
                console.log(e.responseJSON);
            }
        });
    }

    private showResult(result: IResult)
    {

        for (let matrix of this.resultMatrices)
        {
            matrix.destroy();
        }

        this.resultTitle.nativeElement.innerHTML = "Result:";
        this.resultView.nativeElement.innerHTML = result.VamStepsMatrices[result.VamStepsMatrices.length - 1].ResultFunction;

        if (result.VamStepsMatrices.length > 0)
        {
            this.resultStepsTitle.nativeElement.innerHTML = "Steps:";


            for (let resultMatrix of result.VamStepsMatrices)
            {
                const factory = this.componentFactoryResolver.resolveComponentFactory(ResultMatrixComponent);
                const component = this.target.createComponent(factory);
                this.resultMatrices.push(component);
                component.instance.setResultMatrix(resultMatrix);
            }
        }
    }

    reset()
    {
        for (let cell of this.cellsArray.toArray())
        {
            cell.value = 0;
        }

        for (let matrix of this.resultMatrices)
        {
            matrix.destroy();
        }

        this.resultTitle.nativeElement.innerHTML = "";
        this.resultView.nativeElement.innerHTML = "";
        this.resultStepsTitle.nativeElement.innerHTML = "";
    }


}