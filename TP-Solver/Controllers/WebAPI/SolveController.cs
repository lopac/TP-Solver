using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TP_Solver.Helpers;
using TP_Solver.Models;

namespace TP_Solver.Controllers.WebAPI
{
    public class MatrixViewModel
    {
        public int Rows { get; set; }
        public int Columns { get; set; }
        public double[][] Matrix { get; set; }
        public double[] Supplies { get; set; }
        public double[] Demands { get; set; }
    }

    public class ResultMatrixViewModel
    {
        public int Rows { get; set; }
        public int Columns { get; set; }
        public Cell[][] Matrix { get; set; }
        public double[] Supplies { get; set; }
        public double[] Demands { get; set; }
    }

    public class SolveController : ApiController
    {
        private Matrix GetMatrixFromViewModel(MatrixViewModel matrixView)
        {
            Matrix matrix;

            if (matrixView.Demands.Sum() > matrixView.Supplies.Sum())
            {
                matrix = new Matrix(matrixView.Rows + 1, matrixView.Columns)
                {
                    Demands = matrixView.Demands,
                };


                var diff = matrixView.Demands.Sum() - matrixView.Supplies.Sum();


                for (int i = 0; i < matrix.Supplies.Length; i++)
                {
                    if (i != matrix.Supplies.Length - 1)
                    {
                        matrix.Supplies[i] = matrixView.Supplies[i];
                    }
                    else
                    {
                        matrix.Supplies[i] = diff;
                    }
                }

            }
            else if (matrixView.Supplies.Sum() > matrixView.Demands.Sum())
            {
                matrix = new Matrix(matrixView.Rows, matrixView.Columns + 1)
                {
                    Supplies = matrixView.Supplies
                };

                var diff = matrixView.Supplies.Sum() - matrixView.Demands.Sum();

                for (int i = 0; i < matrix.Demands.Length; i++)
                {
                    if (i != matrix.Demands.Length - 1)
                    {
                        matrix.Demands[i] = matrixView.Demands[i];
                    }
                    else
                    {
                        matrix.Demands[i] = diff;
                    }
                }
            }
            else
            {
                matrix = new Matrix(matrixView.Rows, matrixView.Columns)
                {
                    Demands = matrixView.Demands,
                    Supplies = matrixView.Supplies
                };
            }

            for (int i = 0; i < matrixView.Rows; i++)
            {
                for (int j = 0; j < matrixView.Columns; j++)
                {
                    matrix[i, j] = new Cell
                    {
                        Value = matrixView.Matrix[i][j]
                    };
                }
            }

            return matrix;
        }

        private ResultMatrixViewModel GetResultViewModelFromMatrix(Matrix matrix)
        {
            var resultMatrix = new ResultMatrixViewModel
            {
                Rows = matrix.GetLength(0),
                Columns = matrix.GetLength(1),
                Demands = matrix.Demands,
                Supplies = matrix.Supplies,
                Matrix = new Cell[matrix.GetLength(0)][]
            };

            for (int i = 0; i < resultMatrix.Rows; i++)
            {
                resultMatrix.Matrix[i] = new Cell[resultMatrix.Columns];

                for (int j = 0; j < resultMatrix.Columns; j++)
                {
                    resultMatrix.Matrix[i][j] = matrix[i, j];
                }
            }

            return resultMatrix;
        }


        [HttpPost, Route("api/Solve/NorthWest")]
        public IHttpActionResult NorthWest(MatrixViewModel matrixView)
        {
            var solver = new TransportationModelSolver();


            var matrix = GetMatrixFromViewModel(matrixView);
            var builtMatrix = matrix.GetCopy();

            var resultMatrices = solver.SolveNorthWest(matrix);


            var matrices = new List<ResultMatrixViewModel> {GetResultViewModelFromMatrix(builtMatrix)};


            resultMatrices.ForEach(x => matrices.Add(GetResultViewModelFromMatrix(x)));


            var result = new
            {
                matrices,
                resultFunction = resultMatrices.Last().ResultFunction
            };

            return Ok(result);
        }

        [HttpPost, Route("api/Solve/LeastCost")]
        public IHttpActionResult LeastCost(MatrixViewModel matrixView)
        {
            return Ok();
        }
    }
}