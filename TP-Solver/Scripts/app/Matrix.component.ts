import { Component,  ViewChild, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { Matrix } from "./Matrix.js";
import { MatrixService } from "./MatrixService.js";
import { CellComponent } from "./Cell.component.js";
import { ResultMatrix } from "./ResultMatrix.js";

@Component({
    selector: "matrix",
    template: `


        <div #matrix class="matrix">

            <div class="column" >
                <p *ngFor="let s of rows" class="{{s.Class}}" style="height: 38px; margin-bottom: 15px;" >{{s.value}}</p>
            </div>

            <div class="column" *ngFor="let col of columns">
                <p class="mhead text-center">{{col.Value}}</p>
                <cell *ngFor="let row of cells" #cell row="{{row.id}}" col="{{col.id}}"  class="{{row.Class}} {{col.Class}}" ></cell>
            </div>
        </div>

        <button (click)="calculate()" class="btn btn-primary btn-lg btn-block col-md-12">Calculate</button>
        <button (click)="reset()" class="btn btn-default btn-lg btn-block col-md-12">Reset</button>

        <p #resultTitle class="title" ></p>
        <p #result></p>
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

    private _rows: number = 0;
    private _cols: number = 0;
    private matrixService: MatrixService;

    constructor(matrixService: MatrixService) {

        this.matrixService = matrixService;

        this._rows = this.matrixService.matrixSize.rows;
        this._cols = this.matrixService.matrixSize.columns;


        for (let i = 0; i < this._cols; i++) {
            this.columns.push(i === this._cols - 1
                ? { Class: "finalColumn", Value: `S`, id: i }
                : { Class: "", Value: `D ${i + 1}`, id: i });
        }


        for (let i = 0; i < this._rows; i++) {
            this.cells.push(i === this._rows - 1
                ? { Class: "finalRow", id: i }
                : { Class: "", id: i });


            this.rows.push(i !== this._rows - 1
                ? { Class: "mhead", value: `S ${i + 1}` }
                : { Class: "mhead last", value: "D" });
        }


    }

    private buildMatrix(): Matrix {

        let matrix = new Matrix(this._rows - 1, this._cols - 1);

        for (let cell of this.cellsArray.toArray()) {

            const row = Number(cell.row);
            const col = Number(cell.col);

            //Demand cell
            if (row === matrix.rows && col !== matrix.columns) {
                matrix.demands.push(cell.value);
            }
            //Supply cell
            else if (col === matrix.columns && row !== matrix.rows) {
                matrix.supplies.push(cell.value);
            }
            //Regular cell
            else if (row !== matrix.rows && col !== matrix.columns) {
                matrix.matrix[row][col] = Number(cell.value);
            }
        }


        return matrix;
    }

    calculate() {
        let matrix = this.buildMatrix();

        console.log(JSON.stringify(matrix));

        $.post("/api/Solve/NorthWest",
            matrix,
            data => {
                var result: { matrices: Array<ResultMatrix>, resultFunction: string } = data;

                //console.log(JSON.stringify(result));

                this.resultTitle.nativeElement.innerHTML = "Result:";
                this.resultView.nativeElement.innerHTML = result.resultFunction;


            }).fail();

    }

    reset() {
        for (let cell of this.cellsArray.toArray()) {
            cell.value = 0;
        }

        this.resultTitle.nativeElement.innerHTML = "";
        this.resultView.nativeElement.innerHTML = "";
    }


}