using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using TP_Solver.Helpers;
using TP_Solver.Interfaces;

namespace TP_Solver.Models
{
    public class Matrix
    {
        private int?[] _u;
        private int?[] _v;

        public Matrix(int rows, int columns)
        {
            Array = new ICell[rows, columns];

            Supplies = new int[rows];

            Demands = new int[columns];

            for (var row = 0; row < Rows; row++)
            {
                for (var column = 0; column < Columns; column++)
                {
                    this[row, column] = new Cell();
                }
            }
        }

        public ICell[,] Array { get; }

        public int Rows
        {
            get { return Array.GetLength(0); }
        }

        public int Columns
        {
            get { return Array.GetLength(1); }
        }

        public int[] U
        {
            get
            {
                this.CalculateUandV();
                return _u.Select(x => x ?? 0).ToArray();
            }
        }


        public int[] V
        {
            get
            {
                this.CalculateUandV();
                return _v.Select(x => x ?? 0).ToArray();
            }
        }

        [JsonIgnore]
        public IEnumerable<Penalty> ColumnDifferences
        {
            get
            {
                for (var i = 0; i < Rows; i++)
                {
                    var row = new List<ICell>();

                    for (var j = 0; j < Columns; j++)
                    {
                        row.Add(Array[i, j]);
                    }

                    row = row.Where(x => x.State == State.NotAllocated).OrderBy(x => x.Value).ToList();

                    if (row.Count > 1)
                    {
                        yield return new Penalty
                        {
                            Id = i,
                            Value = (row[1].Value - row[0].Value)
                        };
                    }
                    else
                    {
                        yield return null;
                    }
                }
            }
        }

        [JsonIgnore]
        public IEnumerable<Penalty> RowDifferences
        {
            get
            {
                for (var j = 0; j < Columns; j++)
                {
                    var column = new List<ICell>();

                    for (var i = 0; i < Rows; i++)
                    {
                        column.Add(Array[i, j]);
                    }

                    column = column.Where(x => x.State == State.NotAllocated).OrderBy(x => x.Value).ToList();

                    if (column.Count > 1)
                    {
                        yield return new Penalty
                        {
                            Id = j,
                            Value = (column[1].Value - column[0].Value)
                        };
                    }
                    else
                    {
                        yield return null;
                    }
                }
            }
        }

        public ICell this[int i, int j]
        {
            get { return Array[i, j]; }
            set { Array[i, j] = value; }
        }


        public int[] Supplies { get; set; }

        public int[] Demands { get; set; }

        public string ResultFunction
        {
            get
            {
                var result = 0;
                var resultFunction = string.Empty;
                for (var i = 0; i < Rows; i++)
                {
                    for (var j = 0; j < Columns; j++)
                    {
                        if (this[i, j].State == State.Allocated)
                        {
                            resultFunction += $"({this[i, j].Allocated} * {this[i, j].Value})";
                            resultFunction += $" + ";
                            result += this[i, j].Allocated * this[i, j].Value;
                        }
                    }
                }


                resultFunction = resultFunction.ReplaceLastOccurrence(" + ", string.Empty);

                resultFunction += $" = {result}";

                return resultFunction;
            }
        }

        private void CalculateUandV()
        {

            var tryCount = 0;

            do
            {
                _u = new int?[Rows];
                _v = new int?[Columns];

                //sidro rekurzije

                //Cij = ui + vj;

                //vj = Cij - ui;
                //ui = Cij - vj;

                _u[0] = 0;

                var count = 0;

                while ((_u.ToList().Any(x => x == null) || _v.ToList().Any(x => x == null)) && count < 200)
                {
                    for (var i = 0; i < Rows; i++)
                    {
                        for (var j = 0; j < Columns; j++)
                        {
                            if (this[i, j].State == State.Allocated)
                            {
                                if (_v[j] == null && _u[i] != null)
                                {
                                    _v[j] = this[i, j].Value - _u[i];
                                }

                                if (_u[i] == null && _v[j] != null)
                                {
                                    _u[i] = this[i, j].Value - _v[j];
                                }
                            }
                        }
                    }

                    count++;
                }

                if (_u.Any(x => x == null) && _v.Any(x => x == null))
                {

                    var column = _v.ToList().IndexOf(_v.FirstOrDefault(v => v == null));

                    for (int i = 0; i < this.Rows; i++)
                    {
                        var cell = Array[i, column];
                        if (cell.State == State.Processed)
                        {
                            cell.State = State.Allocated;
                            cell.Allocated = 0;
                            break;
                        }
                    }
                }


            } while ((_u.Any(x => x == null) && _v.Any(x => x == null)) && ++tryCount < 200);
        }

        public IEnumerable<ICell> Flatten()
        {
            for (var row = 0; row < Rows; row++)
            {
                for (var column = 0; column < Columns; column++)
                {
                    yield return this[row, column];
                }
            }
        }

        public ICoordinate CoordinatesOf(ICell cell)
        {
            for (var i = 0; i < Rows; ++i)
            {
                for (var j = 0; j < Columns; ++j)
                {
                    if (this[i, j].Equals(cell))
                        return new Coordinate {Row = i, Column = j};
                }
            }

            return new Coordinate {Row = -1, Column = -1};
        }

        private void AllocateRow(int row, int column)
        {
            for (var j = 0; j < Columns; j++)
            {
                if (this[row, j].State == State.NotAllocated)
                {
                    this[row, j].State = State.Processed;
                }
            }
        }

        private void AllocateColumn(int row, int column)
        {
            for (var i = 0; i < Rows; i++)
            {
                if (this[i, column].State == State.NotAllocated)
                {
                    this[i, column].State = State.Processed;
                }
            }
        }

        public int GetCellAllocation(int row, int column)
        {
            int allocation;

            if (Supplies[row].CompareTo(Demands[column]) < 0)
            {
                allocation = Demands[column] - Supplies[row];
            }
            else if (Supplies[row].CompareTo(Demands[column]) > 0)
            {
                allocation = Supplies[row] - Demands[column];
            }
            else // if equal
            {
                allocation = Supplies[row];
            }

            return allocation;
        }

        public void Allocate(int row, int column)
        {
            if (Supplies[row].CompareTo(Demands[column]) < 0)
            {
                this[row, column].Allocated = Supplies[row];
                Demands[column] -= Supplies[row];
                Supplies[row] = 0;

                AllocateRow(row, column);
            }
            else if (Supplies[row].CompareTo(Demands[column]) > 0)
            {
                this[row, column].Allocated = Demands[column];

                Supplies[row] -= Demands[column];
                Demands[column] = 0;

                AllocateColumn(row, column);
            }
            else // if equal
            {
                this[row, column].Allocated = Supplies[row];

                Supplies[row] = 0;
                Demands[column] = 0;

                AllocateRow(row, column);
                AllocateColumn(row, column);
            }

            this[row, column].State = State.Allocated;
        }

        public Matrix GetCopy()
        {
            var matrix = new Matrix(Rows, Columns);

            for (var i = 0; i < Demands.Length; i++)
            {
                matrix.Demands[i] = Demands[i];
            }

            for (var i = 0; i < Supplies.Length; i++)
            {
                matrix.Supplies[i] = Supplies[i];
            }

            for (var i = 0; i < Rows; i++)
            {
                for (var j = 0; j < Columns; j++)
                {
                    matrix[i, j] = new Cell
                    {
                        Value = this[i, j].Value,
                        Allocated = this[i, j].Allocated,
                        State = this[i, j].State
                    };
                }
            }

            return matrix;
        }
    }
}