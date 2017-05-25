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
            var matrix = new Matrix(matrixView.Rows, matrixView.Columns)
            {
                Demands = matrixView.Demands,
                Supplies = matrixView.Supplies
            };

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

            var resultMatrices = solver.SolveNorthWest(GetMatrixFromViewModel(matrixView));

            return Ok(new
            {
                matrices = resultMatrices?.Select(GetResultViewModelFromMatrix).ToList(),
                resultFunction = resultMatrices.Last().ResultFunction
            });
        }

        [HttpPost, Route("api/Solve/LeastCost")]
        public IHttpActionResult LeastCost(MatrixViewModel matrixView)
        {
            return Ok();
        }
    }
}