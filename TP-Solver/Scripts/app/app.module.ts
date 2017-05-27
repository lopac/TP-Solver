import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContainerComponent } from './Container.component.js';
import { CellComponent } from './Cell.component.js';
import { MatrixComponent } from './Matrix.component.js';
import { ResultMatrixComponent } from './ResultMatrix.component.js';
import { MatrixService } from "./MatrixService.js";

@NgModule({
    imports: [BrowserModule],
    declarations: [ContainerComponent, MatrixComponent, CellComponent,ResultMatrixComponent],
    entryComponents: [MatrixComponent,ResultMatrixComponent],
    providers: [MatrixService],
    exports: [ContainerComponent],
    bootstrap: [ContainerComponent]

})
export class AppModule {
}