import {Cell} from './Cell.js';

export class Matrix {
    public Rows = 0;
    public Columns = 0;

    public Array: Array<Array<Cell>>;
    public Supplies: Array<number> = [];
    public Demands: Array<number> = [];

    public ResultFunction: string = "";

    constructor(rows: number, columns: number) {
        this.Rows = rows;
        this.Columns = columns;

        this.Array = new Array(this.Rows);

        for (let i = 0; i < rows; i++) {
            this.Array[i] = Array(this.Columns);
        }
    }


}