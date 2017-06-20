import {Cell} from './Cell.js'


export class ResultMatrix {
    Columns: number;
    Rows: number;
    Demands: Array<number>;
    Supplies: Array<number>;
    Matrix: Array<Array<Cell>>;

    constructor(columns: number, rows: number, demands: number[], supplies: number[], matrix: number[][], resultFunction: string) {
        this.Columns = 0;
        this.Rows = 0;
        this.Demands = [];
        this.Supplies = [];
        this.Matrix = [];
    }
}