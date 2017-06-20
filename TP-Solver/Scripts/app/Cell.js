"use strict";
var State;
(function (State) {
    State[State["NotAllocated"] = -1] = "NotAllocated";
    State[State["Allocated"] = 0] = "Allocated";
    State[State["Processed"] = 1] = "Processed";
    State[State["RelativeAllocated"] = 2] = "RelativeAllocated";
})(State = exports.State || (exports.State = {}));
var Cell = (function () {
    function Cell() {
        this.Allocated = 0;
        this.Value = 0;
        this.State = State.NotAllocated;
    }
    return Cell;
}());
exports.Cell = Cell;
//# sourceMappingURL=Cell.js.map