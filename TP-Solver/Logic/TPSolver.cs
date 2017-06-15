using System.Collections.Generic;
using System.Linq;
using TP_Solver.Models;
using WebGrease.Css.Extensions;

namespace TP_Solver.Helpers
{
    public static class TPSolver
    {
        /// <summary>
        ///     Get Feasible solution using North West Corner Rule
        /// </summary>
        /// <param name="matrix"></param>
        /// <returns>List&lt;Matrix&gt;</returns>
        //public static List<Matrix> GetFeasibleSolution(this Matrix matrix)
        //{
        //    var solutionMatrices = new List<Matrix>();

        //    while (matrix.Supplies.Any(x => x != 0) && matrix.Demands.Any(x => x != 0))
        //    {
        //        for (var row = 0; row < matrix.Rows; row++)
        //        {
        //            for (var column = 0; column < matrix.Columns; column++)
        //            {
        //                if (matrix[row, column].State == State.NotAllocated)
        //                {
        //                    matrix.Allocate(row, column);
        //                    solutionMatrices.Add(matrix.GetCopy());
        //                }
        //            }
        //        }
        //    }

        //    return solutionMatrices;
        //}


        /// <summary>
        ///     Get Feasible solution using Vogel Approximation Method
        /// </summary>
        /// <param name="matrix"></param>
        /// <returns>List&lt;Matrix&gt;</returns>
        public static List<Matrix> GetFeasibleSolution(this Matrix matrix)
        {
            var solutionMatrices = new List<Matrix>();

            while (matrix.Supplies.Any(x => x != 0) && matrix.Demands.Any(x => x != 0))
            {
                Penalty maxRow = null;
                Penalty maxColumn = null;

                if (matrix.RowDifferences.Count(x => x != null) > 1)
                {
                    maxRow = matrix.RowDifferences.Where(x => x != null).OrderByDescending(x => x.Value).First();
                }

                if (matrix.ColumnDifferences.Count(x => x != null) > 1)
                {
                    maxColumn = matrix.ColumnDifferences.Where(x => x != null).OrderByDescending(x => x.Value).First();
                }
                if (maxRow != null && maxColumn != null)
                {
                    bool isRowChoosen;

                    var minColumnCell = matrix[maxColumn.Id, 0];
                    for (int j = 1; j < matrix.Columns; j++)
                    {
                        var cell = matrix[maxColumn.Id, j];

                        if (cell.Value < minColumnCell.Value && cell.State == State.NotAllocated)
                        {
                            minColumnCell = matrix[maxColumn.Id, j];
                        }
                    }

                    if (minColumnCell.State == State.Allocated)
                    {
                        minColumnCell = null;
                    }

                    var minRowCell = matrix[0, maxRow.Id];
                    for (int i = 1; i < matrix.Rows; i++)
                    {
                        var cell = matrix[i, maxRow.Id];
                        if (cell.Value < minRowCell.Value && cell.State == State.NotAllocated)
                        {
                            minRowCell = matrix[i, maxRow.Id];
                        }
                    }

                    if (minRowCell.State == State.Allocated)
                    {
                        minRowCell = null;
                    }

                    if (maxColumn.Value == maxRow.Value)
                    {
                        if (minRowCell?.Value == minColumnCell?.Value)
                        {
                            var rowCellCoordinates = matrix.CoordinatesOf(minRowCell);
                            var columnCellCoordinates = matrix.CoordinatesOf(minColumnCell);

                            var rowAllocation =
                                matrix.GetCellAllocation(rowCellCoordinates.Row, rowCellCoordinates.Column);
                            var columnAllocation =
                                matrix.GetCellAllocation(columnCellCoordinates.Row, columnCellCoordinates.Column);


                            isRowChoosen = rowAllocation > columnAllocation;
                        }
                        else if ((minRowCell?.Value ?? 0) > (minColumnCell?.Value ?? 0))
                        {
                            isRowChoosen = false;
                        }
                        else // if less
                        {
                            isRowChoosen = true;
                        }
                    }
                    else if (maxColumn.Value > maxRow.Value)
                    {
                        isRowChoosen = false;
                    }
                    else
                    {
                        isRowChoosen = true;
                    }

                    if (isRowChoosen)
                    {

                        var coordinates = matrix.CoordinatesOf(minRowCell ?? minColumnCell);



                        matrix.Allocate(coordinates.Row, coordinates.Column);
                    }
                    else
                    {
                        var coordinates = matrix.CoordinatesOf(minColumnCell ?? minRowCell);
                        matrix.Allocate(coordinates.Row, coordinates.Column);
                    }

                    solutionMatrices.Add(matrix.GetCopy());
                }
                else
                {
                    foreach (var cell in matrix.Flatten())
                    {
                        if (cell.State == State.NotAllocated)
                        {
                            var coordinates = matrix.CoordinatesOf(cell);
                            matrix.Allocate(coordinates.Row, coordinates.Column);

                            solutionMatrices.Add(matrix.GetCopy());
                        }
                    }
                }

            }

            return solutionMatrices;
        }

        /// <summary>
        ///     Get optimal solution using Modified distribution method
        /// </summary>
        /// <param name="matrix"></param>
        /// <returns>List&lt;Matrix&gt;</returns>
        public static Matrix GetOptimalSolution(this Matrix matrix)
        {
            //ako je m + n - 1 != broj alociranih onda popravi matricu
            if (matrix.Rows + matrix.Columns - 1 != matrix.Flatten().Count(x => x.State == State.Allocated))
            {
                matrix.RemoveDegeneracy();
            }

            matrix.ComputeRelativeCosts();

            while (matrix.Flatten().Any(x => x.State == State.RelativeAllocated && x.Allocated > 0))
            {
                if (((matrix.Rows + matrix.Columns) - 1) != matrix.Flatten().Count(x => x.State == State.Allocated))
                {
                    matrix.RemoveDegeneracy();
                }

                if (matrix.ReallocateFreight() == false)
                {
                    break;
                }

                if (((matrix.Rows + matrix.Columns) - 1) != matrix.Flatten().Count(x => x.State == State.Allocated))
                {
                    matrix.RemoveDegeneracy();
                }

                matrix.ComputeRelativeCosts();
            }

            return matrix;
        }

        private static bool ReallocateFreight(this Matrix matrix)
        {
            var maximumCostCell = matrix.Flatten().Where(x => x.State == State.RelativeAllocated)
                .OrderByDescending(x => x.Allocated).First();

            var maxCostCellCoordinates = matrix.CoordinatesOf(maximumCostCell);

            var closedPathCells = new List<ICell> {maximumCostCell};


            // pronađi najdalji (lijevi ako je početni u zadnjoj koloni, dodaj desni ako nema lijevo) - u istom redu i dodaj
            // ga ako postoji donji (gornji ako je zadnji red)
            // dodaj taj najdalji donji (gornji ako je zadnji red) ako postoji lijevi ili desni u istoj koloni (redu?) ko početni inače dalje
            // dodaj onaj koji je u istoj koloni ko početni


            for (var i = 0; i < matrix.Columns; i++)
            {
                if (closedPathCells.Count < 4)
                {
                    var leftCell = matrix[maxCostCellCoordinates.Row, i];
                    if (leftCell.State == State.Allocated && leftCell != maximumCostCell)
                    {
                        for (var k = 0; k < matrix.Rows; k++)
                        {
                            var leftUpperCell = matrix[k, i];
                            if (leftUpperCell.State == State.Allocated && leftUpperCell != leftCell)
                            {
                                var rightUpperCell = matrix[k, maxCostCellCoordinates.Column];
                                if (rightUpperCell.State == State.Allocated)
                                {
                                    closedPathCells.Add(leftCell);
                                    closedPathCells.Add(leftUpperCell);
                                    closedPathCells.Add(rightUpperCell);
                                    break;
                                }
                            }
                        }
                    }
                }
                else
                {
                    break;
                }
            }

            var maximumCostCellValue = closedPathCells[0].Allocated;

            if (closedPathCells.Count == 4)
            {
                var minFreightCellAllocated = -1;
                var minFreightCellIndex = -1;
                var negativeFreightCellIndex = -1;

                if (closedPathCells[1].Allocated < closedPathCells[3].Allocated)
                {
                    minFreightCellAllocated = closedPathCells[1].Allocated;
                    minFreightCellIndex = 1;
                    negativeFreightCellIndex = 3;
                }
                else
                {
                    minFreightCellAllocated = closedPathCells[3].Allocated;
                    minFreightCellIndex = 3;
                    negativeFreightCellIndex = 1;
                }

                closedPathCells[minFreightCellIndex].Allocated = -maximumCostCellValue;
                closedPathCells[minFreightCellIndex].State = State.RelativeAllocated;

                closedPathCells[0].Allocated = minFreightCellAllocated;
                closedPathCells[0].State = State.Allocated;

                closedPathCells[negativeFreightCellIndex].Allocated -= minFreightCellAllocated;

                if (closedPathCells[negativeFreightCellIndex].Allocated == 0)
                {
                    closedPathCells[negativeFreightCellIndex].State = State.Processed;
                }

                closedPathCells[2].Allocated += minFreightCellAllocated;

                return true;
            }

            return false;
        }

        private static void ComputeRelativeCosts(this Matrix matrix)
        {
            var u = matrix.U;
            var v = matrix.V;

            //resetiraj prijašnje relativne alokacije
            matrix.Flatten().Where(x => x.State == State.RelativeAllocated).ForEach(x => x.State = State.Processed);

            for (var i = 0; i < matrix.Rows; i++)
            {
                for (var j = 0; j < matrix.Columns; j++)
                {
                    var cell = matrix[i, j];
                    if (cell.State == State.Processed)
                    {
                        // Xij = (ui + vj) - Cij;

                        cell.Allocated = u[i] + v[j] - cell.Value;
                        cell.State = State.RelativeAllocated;
                    }
                }
            }
        }

        private static void RemoveDegeneracy(this Matrix matrix)
        {
            var connections = new List<int>[matrix.Columns];

            for (var j = 0; j < matrix.Columns; j++)
            {
                for (var i = 0; i < matrix.Rows; i++)
                {
                    if (matrix[i, j].Allocated > 0)
                    {
                        if (connections[j] == null)
                        {
                            connections[j] = new List<int>();
                        }

                        connections[j].Add(i);
                    }
                }
            }

            var connectedColumns = new List<int>();

            for (var i = 0; i < connections.Length; i++)
            {
                for (var j = i + 1; j < connections.Length; j++)
                {
                    foreach (var value in connections[i])
                    {
                        if (connections[j].Contains(value))
                        {
                            if (connectedColumns.Contains(i) == false)
                            {
                                connectedColumns.Add(i);
                            }
                            if (connectedColumns.Contains(j) == false)
                            {
                                connectedColumns.Add(j);
                            }
                        }
                    }
                }
            }

            var disconnectedColumn = -1;

            for (int i = 0; i < matrix.Columns; i++)
            {
                if (connectedColumns.Contains(i) == false)
                {
                    disconnectedColumn = i;
                    break;
                }
            }

            if (disconnectedColumn != -1)
            {
                for (var i = 0; i < matrix.Rows; i++)
                {
                    var cell = matrix[i, disconnectedColumn];
                    if (cell.State == State.Processed)
                    {
                        cell.State = State.Allocated;
                        break;
                    }
                }
            }
            else
            {
                var cell = matrix.Flatten().Where(x => x.State != State.Allocated && x.Value != 0).OrderBy(x => x.Value).First();
                cell.Allocated = 0;
                cell.State = State.Allocated;
            }
        }
    }
}