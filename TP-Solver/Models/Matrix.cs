using System.Collections.Generic;

namespace TP_Solver.Models
{
    public struct CellState
    {
        public const double NotAllocated = -1;
        public const double Allocated = 0;
    }

    public sealed class Cell
    {
        public Cell()
        {
            Allocated = CellState.NotAllocated;
        }

        public double Value { get; set; }
        public double Allocated { get; set; }
    }


    public class Matrix
    {
        private readonly Cell[,] _array;


        public Matrix(int rows, int columns)
        {
            _array = new Cell[rows, columns];

            Supplies = new double[rows];

            Demands = new double[columns];

            for (var row = 0; row < _array.GetLength(0); row++)
            {
                for (var column = 0; column < _array.GetLength(1); column++)
                {
                    _array[row, column] = new Cell();
                }
            }
        }


        public Cell this[int i, int j]
        {
            get { return _array[i, j]; }
            set { _array[i, j] = value; }
        }


        public double[] Supplies { get; set; }

        public double[] Demands { get; set; }

        public IEnumerable<Cell> Flatten()
        {
            for (var row = 0; row < _array.GetLength(0); row++)
            {
                for (var column = 0; column < _array.GetLength(1); column++)
                {
                    yield return _array[row, column];
                }
            }
        }

        public int GetLength(int id)
        {
            return _array.GetLength(id);
        }

        private void AllocateRow(int row, int column)
        {
            for (var j = column + 1; j < _array.GetLength(0); j++)
            {
                _array[row, j].Allocated = CellState.Allocated;
            }
        }

        private void AllocateColumn(int row, int column)
        {
            for (var i = row + 1; i < _array.GetLength(0); i++)
            {
                _array[i, column].Allocated = CellState.Allocated;
            }
        }

        public void Allocate(int row, int column)
        {
            if (Supplies[row].CompareTo(Demands[column]) < 0)
            {
                _array[row, column].Allocated = Supplies[row];
                Demands[column] -= Supplies[row];
                Supplies[row] = 0;

                AllocateRow(row, column);
            }
            else if (Supplies[row].CompareTo(Demands[column]) > 0)
            {
                _array[row, column].Allocated = Demands[column];

                Supplies[row] -= Demands[column];
                Demands[column] = 0;

                AllocateColumn(row, column);
            }
            else // if equal
            {
                _array[row, column].Allocated = Supplies[row];

                Supplies[row] = 0;
                Demands[column] = 0;

                AllocateRow(row, column);
                AllocateColumn(row, column);
            }
        }
    }
}