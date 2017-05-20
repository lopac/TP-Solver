import { Component, Input } from "@angular/core";

@Component({
    selector: "cell",
    template: `
        <div class="form-group" >
            <input class="form-control" #cell (keyup)="refreshValue(cell.value);" cell.value value="{{value}}" type="number" required/>
        </div>
        `
})
export class CellComponent {
    value: number = 0;

    @Input()
    row: number = -1;

    @Input()
    col: number = -1;

    public refreshValue(value: number) {
        this.value = value;
    }
}