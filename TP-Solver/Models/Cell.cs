namespace TP_Solver.Models
{
    public sealed class Cell : ICell
    {
        public Cell()
        {
            State = State.NotAllocated;
        }

        public int Value { get; set; }
        public int Allocated { get; set; }
        public State State { get; set; }

    }
}