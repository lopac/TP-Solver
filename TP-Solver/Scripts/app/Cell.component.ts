import { Component, Input, AfterViewInit, ElementRef } from "@angular/core";

@Component({
    selector: "cell",
    template: `
        <div class="form-group" >
            <input class="form-control" value="0" type="number" required/>
        </div>
        `
})
export class CellComponent implements AfterViewInit
{
    private readonly element: ElementRef;
    @Input()
    row: number = -1;

    @Input()
    col: number = -1;


    get value(): number { return Number($(this.element.nativeElement).find("input").val()); }

    set value(value: number)
    {
        $(this.element.nativeElement).find("input").val(value);
    }

    constructor(element: ElementRef)
    {
        this.element = element;
    }

    ngAfterViewInit(): void
    {
    }

}