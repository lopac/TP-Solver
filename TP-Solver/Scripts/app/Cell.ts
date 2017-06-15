export enum State
{
    NotAllocated = -1,
    Allocated,
    Processed,
    RelativeAllocated
}

export class Cell
{
    public Allocated: number;
    public Value: number;
    public State: State;

    constructor() {
        this.Allocated = 0;
        this.Value = 0;
        this.State = State.NotAllocated;
    }
}