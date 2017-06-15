import { Component } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { MatrixComponent } from "./Matrix.component.js";
import { MatrixSize } from "./MatrixService.js";
//import { CellComponent } from "./Cell.component.js";


@Component({
    selector: 'container',
    template: `

        <div class="buttons row text-center" style="margin: 0;">
            <p class="lead col-md-3 col-md-offset-2 col-sm-4 col-sm-offset-2 col-xs-4 col-xs-offset-2 text-center">Ishodišta</p>

            <button class="btn btn-default col-md-2 col-sm-2 col-xs-2" (click)="decrementRows()"><span class="glyphicon glyphicon-minus"></span></button>
            <p class="col-md-1 col-sm-1 col-xs-1">{{rows - 1}}</p>
            <button class="btn btn-default col-md-2 col-sm-2 col-xs-2" (click)="incrementRows()"><span class="glyphicon glyphicon-plus"></span></button>
        </div>

        <div class="buttons row text-center" style="margin: 0;">
            <p class="lead col-md-3 col-md-offset-2  col-sm-4  col-sm-offset-2 col-xs-4  col-xs-offset-2 text-center">Odredišta</p>

            <button class="btn btn-default col-md-2  col-sm-2 col-xs-2" (click)="decrementCols()"><span class="glyphicon glyphicon-minus"></span></button>
            <p class="col-md-1 col-sm-1 col-xs-1">{{columns - 1}}</p>
            <button class="btn btn-default col-md-2 col-sm-2 col-xs-2" (click)="incrementCols()"><span class="glyphicon glyphicon-plus"></span></button>

        </div>
        `
})
export class ContainerComponent {

    rows: number;
    columns: number;
    matrixRef: any = null;

    resetMatrix(rows: number, cols: number) {

        if (this.matrixRef) {
            this.matrixRef.destroy();
        }

        this.rows = rows;
        this.columns = cols;

        MatrixSize.Instance.rows = this.rows;
        MatrixSize.Instance.columns = this.columns;

        const factory = this.componentFactoryResolver.resolveComponentFactory(MatrixComponent);
        this.matrixRef = this.viewContainerRef.createComponent(factory);

        this.matrixRef.changeDetectorRef.detectChanges();
    }

    decrementRows() {
        if (this.rows > 2) {
            this.resetMatrix(this.rows - 1, this.columns);
        }
    }

    incrementRows() {
        if ((this.rows - 1) < 20) {
            this.resetMatrix(this.rows + 1, this.columns);
        }
    }

    decrementCols() {
        if (this.columns > 2) {
            this.resetMatrix(this.rows, this.columns - 1);
        }
    }

    incrementCols() {
        if ((this.columns - 1) < 10) {
            this.resetMatrix(this.rows, this.columns + 1);
        }
    }

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef) {

        this.resetMatrix(4, 4);
    }


}