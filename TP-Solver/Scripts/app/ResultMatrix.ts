import {Cell} from './Cell.js'


export class ResultMatrix {
    columns: number;
    rows: number;
    demands: Array<number>;
    supplies: Array<number>;
    matrix: Array<Array<Cell>>;
    resultFunction: string;

    constructor(columns: number, rows: number, demands: number[], supplies: number[], matrix: number[][], resultFunction: string) {
        this.columns = 0;
        this.rows = 0;
        this.demands = [];
        this.supplies = [];
        this.matrix = [];
        this.resultFunction = "";
    }
}