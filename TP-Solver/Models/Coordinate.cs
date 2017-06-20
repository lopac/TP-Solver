using TP_Solver.Interfaces;

namespace TP_Solver.Models
{
    public class Coordinate : ICoordinate
    {
        public int Row { get; set; }
        public int Column { get; set; }
    }
}
