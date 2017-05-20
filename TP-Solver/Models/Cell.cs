namespace TP_Solver.Models
{
    public sealed class Cell
    {
        public Cell()
        {
            Allocated = CellState.NotAllocated;
        }

        public double Value { get; set; }
        public double Allocated { get; set; }
    }
}