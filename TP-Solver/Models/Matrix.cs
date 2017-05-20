using System;
using System.Collections.Generic;
using TP_Solver.Helpers;

namespace TP_Solver.Models
{
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

        public Matrix GetCopy()
        {
            var rows = this.GetLength(0);
            var cols = this.GetLength(1);

            var matrix = new Matrix(rows, cols)
            {
            };

            for (var i = 0; i < this.Demands.Length; i++)
            {
                matrix.Demands[i] = this.Demands[i];
            }

            for (var i = 0; i < this.Supplies.Length; i++)
            {
                matrix.Supplies[i] = this.Supplies[i];
            }

            for (int i = 0; i < rows; i++)
            {
                for (int j = 0; j < cols; j++)
                {
                    matrix[i, j] = new Cell
                    {
                        Value = this[i, j].Value,
                        Allocated = this[i, j].Allocated
                    };
                }
            }

            return matrix;
        }

        public string ResultFunction
        {
            get
            {
                double result = 0;
                var resultFunction = string.Empty;
                for (int i = 0; i < this.GetLength(0); i++)
                {
                    for (int j = 0; j < this.GetLength(1); j++)
                    {
                        if (this[i, j].Allocated > 0)
                        {
                            resultFunction += $"({this[i, j].Allocated} * {this[i, j].Value})";
                            resultFunction += $" + ";

                            result += this[i, j].Allocated * this[i, j].Value;
                        }
                    }
                }


                resultFunction = resultFunction.ReplaceLastOccurrence(" + ", String.Empty);

                resultFunction += $" = {result}";

                return resultFunction;
            }
        }
    }
}