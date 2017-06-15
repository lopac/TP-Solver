namespace TP_Solver.Models
{
    public interface ICell
    {
        int Allocated { get; set; }
        int Value { get; set; }
        State State { get; set; }
    }
}