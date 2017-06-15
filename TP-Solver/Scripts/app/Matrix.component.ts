import
{
    Component, ComponentRef, ViewChild, ViewChildren, QueryList, ElementRef, ViewContainerRef,
    ComponentFactoryResolver
} from "@angular/core";
import { Matrix } from "./Matrix.js";
import { MatrixService } from "./MatrixService.js";
import { CellComponent } from "./Cell.component.js";
import { Cell } from "./Cell.js";
import { ResultMatrixComponent } from "./ResultMatrix.component.js";

interface IResult
{
    InitialMatrix: Matrix;
    ModiStepsMatrices: Array<Matrix>;
    StepsMatrices: Array<Matrix>;
    UsedFeasibleMethod: string;
}

@Component({
    selector: "matrix",
    template: `
        <div #matrix>
            <div class="matrix">
                <div class="column">
                    <p *ngFor="let s of rows" class="{{s.Class}}">{{s.Title}}<sub>{{s.value}}</sub></p>
                </div>

                <div class="column" *ngFor="let col of columns">
                    <p class="mhead text-center">{{col.Title}}<sub>{{col.Value}}</sub></p>
                    <cell *ngFor="let row of cells" #cell row="{{row.id}}" col="{{col.id}}" class="{{row.Class}} {{col.Class}}"></cell>
                </div>
            </div>
            <button (click)="calculate()" class="btn btn-primary btn-block btn-lg">Izračunaj</button>
            <button (click)="setCellsValueToRandom()" id="rand-btn" style="display: none;" class="btn btn-info btn-block btn-lg">Nasumični brojevi</button>
            <button (click)="reset()" class="btn btn-default btn-block btn-lg">Resetiraj</button>
        </div>

        <p class="text-center"><i class="glyphicon green-circle"> </i> Alokacija</p>
        <p class="text-center"><i class="glyphicon red-circle"> </i> Relativni trošak</p>

        <p #resultTitle class="title" style="max-width: 600px;display: block; word-wrap: break-word;"></p>
        <p #result></p>


        <p #resultStepsTitle class="title"></p>
        <div #info class="info text-center"></div>

`
})
export class MatrixComponent
{

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

    @ViewChild("info")
    infoDiv: ElementRef;

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
                ? { Class: "finalColumn", Title: "I", Value: ``, id: i }
                : { Class: "", Title: "O ", Value: `${i + 1}`, id: i });
        }


        for (let i = 0; i < this._rows; i++)
        {
            this.cells.push(i === this._rows - 1
                ? { Class: "finalRow", id: i }
                : { Class: "", id: i });


            this.rows.push(i !== this._rows - 1
                ? { Class: "mhead", Title: "I ", value: `${i + 1}` }
                : { Class: "mhead last", Title: "O", value: "" });
        }
    }

    private setCellsValueToRandom()
    {
        for (let cell of this.cellsArray.toArray())
        {
            cell.value = Math.floor((Math.random() * 80) + 1);
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
                console.log(e);
            }
        });
    }

    private showResult(result: IResult)
    {
        for (let matrix of this.resultMatrices)
        {
            matrix.destroy();
        }

        this.resultTitle.nativeElement.innerHTML = "Rezultat:";
        this.resultView.nativeElement.innerHTML = result.StepsMatrices[result.StepsMatrices.length - 1].ResultFunction;



        const factory = this.componentFactoryResolver.resolveComponentFactory(ResultMatrixComponent);
        const component = this.target.createComponent(factory);
        this.resultMatrices.push(component);
        component.instance.setResultMatrix(result.InitialMatrix);

        this.infoDiv.nativeElement.innerHTML = `<p>Korištena metoda za pronalazak početnog rasporeda:<p/><p>${result.UsedFeasibleMethod}</p><p>Inicijalna matrica:</p>`;


        if (result.StepsMatrices.length > 0)
        {
            this.resultStepsTitle.nativeElement.innerHTML = "Koraci: ";


            for (let resultMatrix of result.StepsMatrices)
            {
                const factory = this.componentFactoryResolver.resolveComponentFactory(ResultMatrixComponent);
                const component = this.target.createComponent(factory);
                this.resultMatrices.push(component);
                component.instance.setResultMatrix(resultMatrix);
            }


            let isFirst = true;

            for (let resultMatrix of result.ModiStepsMatrices)
            {
                const factory = this.componentFactoryResolver.resolveComponentFactory(ResultMatrixComponent);
                const component = this.target.createComponent(factory);
                this.resultMatrices.push(component);
                if (resultMatrix == result.ModiStepsMatrices[result.ModiStepsMatrices.length - 1])
                {
                    component.instance.setModiResultMatrix(resultMatrix, true);
                } else
                {
                    component.instance.setModiResultMatrix(resultMatrix, false, isFirst);
                    isFirst = false;
                }

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
        this.infoDiv.nativeElement.innerHTML = "";

    }


}