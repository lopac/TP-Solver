import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './App.component.js';
import { ContainerComponent } from './Container.component.js';
import { CellComponent } from './Cell.component.js';
import { MatrixComponent } from './Matrix.component.js';
import { MatrixService } from "./MatrixService.js";

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, ContainerComponent, MatrixComponent, CellComponent],
    entryComponents: [MatrixComponent],
    providers: [MatrixService],
    exports: [ContainerComponent],
    bootstrap: [ContainerComponent]

})
export class AppModule {
}