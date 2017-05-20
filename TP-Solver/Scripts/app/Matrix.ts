export class Matrix {
    public rows = 0;
    public columns = 0;

    public matrix: Array<Array<number>> = [];
    public supplies: Array<number> = [];
    public demands: Array<number> = [];

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;

        for (let i = 0; i < rows; i++) {
            this.matrix[i] = [];
        }
    }


}