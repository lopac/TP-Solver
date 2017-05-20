import { Component } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { MatrixComponent } from "./Matrix.component.js";
import { MatrixSize } from "./MatrixService.js";
//import { CellComponent } from "./Cell.component.js";


@Component({
    selector: 'container',
    template: `<p class="lead pull-left text-center">Rows</p>
        <p class="lead pull-right text-center">Columns</p>
        <span class="clear"></span>

        <div class="buttons">
            <button class="btn btn-default pull-left" (click)="decrementRows()"><span class="glyphicon glyphicon-minus"></span></button>
            <p class="pull-left">{{rows - 1}}</p>
            <button class="btn btn-default pull-left" (click)="incrementRows()"><span class="glyphicon glyphicon-plus"></span></button>

            <button class="btn btn-default pull-right" (click)="incrementCols()"><span class="glyphicon glyphicon-plus"></span></button>
            <p class="pull-right">{{columns - 1}}</p>
            <button class="btn btn-default pull-right" (click)="decrementCols()"><span class="glyphicon glyphicon-minus"></span></button>

            <span class="clear"></span>
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

        this.resetMatrix(4, 5);
    }


}