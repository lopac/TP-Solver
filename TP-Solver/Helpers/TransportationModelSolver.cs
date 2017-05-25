using System.Collections.Generic;
using System.Linq;
using TP_Solver.Models;

namespace TP_Solver.Helpers
{
    public class TransportationModelSolver
    {
        public List<Matrix> SolveNorthWest(Matrix matrix)
        {
            var solutionMatrices = new List<Matrix>();


            while (matrix.Supplies.Any(x => x != CellState.Allocated) &&
                   matrix.Demands.Any(x => x != CellState.Allocated))
            {
                for (var row = 0; row < matrix.GetLength(0); row++)
                {
                    for (var column = 0; column < matrix.GetLength(1); column++)
                    {
                        if (matrix[row, column].Allocated is CellState.NotAllocated)
                        {
                            matrix.Allocate(row, column);
                            solutionMatrices.Add(matrix.GetCopy());
                        }
                    }
                }
            }

            return solutionMatrices;
        }
    }
}