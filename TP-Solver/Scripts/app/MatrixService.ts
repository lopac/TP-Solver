import { Injectable } from '@angular/core';


export class MatrixSize {
    private static _instance = new MatrixSize();

    static get Instance(): MatrixSize {
        return this._instance;
    }

    constructor() {
        this._rows = 0;
        this._columns = 0;
    }

    get rows(): number { return this._rows; }

    set rows(value: number) {
        this._rows = value;
    }

    get columns(): number { return this._columns; }

    set columns(value: number) {
        this._columns = value;
    }
    private _columns = 0;
    private _rows = 0;
}

@Injectable()
export class MatrixService {
    matrixSize: MatrixSize = MatrixSize.Instance;
}