import { Component, ViewChildren, AfterViewInit, QueryList } from "@angular/core";
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
        <button (click)="calculate()" class="btn btn-default btn-lg btn-block">Calculate</button>
`
})
export class MatrixComponent implements AfterViewInit {

    public model: Matrix;
    public columns: Array<any> = [];
    public rows: Array<any> = [];
    public cells: Array<any> = [];
    public cellsViews: Array<CellComponent> = [];

    @ViewChildren("cell") cellsArray: QueryList<CellComponent>;

    private _rows: number = 0;
    private _cols: number = 0;
    private matrixService: MatrixService;

    constructor(matrixService: MatrixService) {

        this.matrixService = matrixService;

        this._rows = this.matrixService.matrixSize.rows;
        this._cols = this.matrixService.matrixSize.columns;




        for (let i = 0; i < this._cols; i++) {
            this.columns.push(i === this._cols - 1
                ? { Class: "finalColumn", Value: `S`, id:  i }
                : { Class: "", Value: `D ${i + 1}`,id:  i });
        }


        for (let i = 0; i < this._rows; i++) {
            this.cells.push(i === this._rows - 1
                ? { Class: "finalRow",id: i }
                : { Class: "",id: i });


            this.rows.push(i !== this._rows - 1
                ? { Class: "mhead", value: `S ${i + 1}` }
                : { Class: "mhead last", value: "D" });
        }


    }

    private buildMatrix() {

        this.model = new Matrix(this._rows - 1, this._cols - 1);

        for (let cell of this.cellsArray.toArray()) {

            const row = Number(cell.row);
            const col = Number(cell.col);

            //Demand cell
            if (row === this.model.rows && col !== this.model.columns) {
                this.model.demands.push(cell.value);
            }
            //Supply cell
            else if (col === this.model.columns && row !== this.model.rows) {
                this.model.supplies.push(cell.value);
            }
            else if(row !== this.model.rows && col !== this.model.columns) {
                this.model.matrix[row][col] = Number(cell.value);
                //console.log(cell);
            }
        }

        console.log(JSON.stringify(this.model));

        $.post("/api/Solve/NorthWest", this.model,data => {
            var resultMatrices: Array<ResultMatrix> = data;

            console.log(JSON.stringify(resultMatrices));

        }).fail();
    }

    calculate() {
        this.buildMatrix();

    }

    ngAfterViewInit() {


    }

}