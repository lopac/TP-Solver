using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Mvc;
using Newtonsoft.Json;
using TP_Solver.Helpers;
using TP_Solver.Models;

namespace TP_Solver.Controllers.WebAPI
{
    public class MatrixViewModel
    {
        public int Rows { get; set; }
        public int Columns { get; set; }
        public Cell[][] Array { get; set; }
        public List<int> Supplies { get; set; }
        public List<int> Demands { get; set; }

        public MatrixViewModel()
        {
            Supplies = new List<int>();
            Demands = new List<int>();
            //Array = new  [];
        }

        public Matrix ToMatrix()
        {
            if (Demands.Sum() > Supplies.Sum())
            {
                var difference = Demands.Sum() - Supplies.Sum();

                Supplies.Add(difference);
            }
            else if (Supplies.Sum() > Demands.Sum())
            {
                var difference = Supplies.Sum() - Demands.Sum();

                Demands.Add(difference);
            }


            var newMatrix = new Matrix(Supplies.Count, Demands.Count)
            {
                Demands = Demands.ToArray(),
                Supplies = Supplies.ToArray()
            };

            for (int i = 0; i < Rows; i++)
            {
                for (int j = 0; j < Columns; j++)
                {
                    newMatrix[i, j] = new Cell
                    {
                        Value = Array[i][j].Value,
                        State = State.NotAllocated
                    };
                }
            }

            return newMatrix;
        }
    }

    public class ResultViewModel
    {
        public Matrix InitialMatrix { get; set; }
        public Matrix ModiOptimalMatrix { get; set; }
        public IEnumerable<Matrix> VamStepsMatrices { get; set; }
    }
    public class SolveController : ApiController
    {
        [System.Web.Http.HttpPost, System.Web.Http.Route("api/Solve")]
        public IHttpActionResult Solve(MatrixViewModel matrixViewModel)
        {
            var matrix = matrixViewModel.ToMatrix();

            var builtMatrix = matrix.GetCopy();

            var feasibleMatrices = matrix.GetFeasibleSolution();

            var optimalMatrix = feasibleMatrices.Last().GetOptimalSolution();

            return Ok(new ResultViewModel
            {
                InitialMatrix = builtMatrix,
                VamStepsMatrices = feasibleMatrices,
                ModiOptimalMatrix = optimalMatrix
            });
        }
    }
}


//var optimalSolution = new Matrix(3, 5)
//{
//    [0, 0] = new Cell() { Value = 2, Allocated = 0 },
//    [1, 0] = new Cell() { Value = 3, Allocated = 5 },
//    [2, 0] = new Cell() { Value = 4, Allocated = 3 },
//    [0, 1] = new Cell() { Value = 3, Allocated = 0 },
//    [1, 1] = new Cell() { Value = 2, Allocated = 0 },
//    [2, 1] = new Cell() { Value = 1, Allocated = 10 },
//    [0, 2] = new Cell() { Value = 4, Allocated = 0 },
//    [1, 2] = new Cell() { Value = 5, Allocated = 0 },
//    [2, 2] = new Cell() { Value = 2, Allocated = 12 },
//    [0, 3] = new Cell() { Value = 5, Allocated = 0 },
//    [1, 3] = new Cell() { Value = 2, Allocated = 15 },
//    [2, 3] = new Cell() { Value = 3, Allocated = 0 },
//    [0, 4] = new Cell() { Value = 0, Allocated = 15 },
//    [1, 4] = new Cell() { Value = 0, Allocated = 0 },
//    [2, 4] = new Cell() { Value = 0, Allocated = 0 },
//}.GetOptimalSolution();

//var optimalSolution = new Matrix(3, 5)
//{
//    [0, 0] = new Cell() { Value = 0, Allocated = 15 },
//    [1, 0] = new Cell() { Value = 0, Allocated = 0 },
//    [2, 0] = new Cell() { Value = 0, Allocated = 0 },
//    [0, 1] = new Cell() { Value = 3, Allocated = 0 },
//    [1, 1] = new Cell() { Value = 2, Allocated = 0 },
//    [2, 1] = new Cell() { Value = 1, Allocated = 10 },
//    [0, 2] = new Cell() { Value = 4, Allocated = 0 },
//    [1, 2] = new Cell() { Value = 5, Allocated = 0 },
//    [2, 2] = new Cell() { Value = 2, Allocated = 12 },
//    [0, 3] = new Cell() { Value = 5, Allocated = 0 },
//    [1, 3] = new Cell() { Value = 2, Allocated = 15 },
//    [2, 3] = new Cell() { Value = 3, Allocated = 0 },
//    [0, 4] = new Cell() { Value = 2, Allocated = 0 },
//    [1, 4] = new Cell() { Value = 3, Allocated = 5 },
//    [2, 4] = new Cell() { Value = 4, Allocated = 3 },

//}.GetOptimalSolution();
//var optimalSolution = new Matrix(3, 4)
//{
//    [0, 0] = new Cell() { Value = 19, Allocated = 5, State = State.Allocated },
//    [1, 0] = new Cell() { Value = 70 },
//    [2, 0] = new Cell() { Value = 40 },
//    [0, 1] = new Cell() { Value = 30 },
//    [1, 1] = new Cell() { Value = 30 },
//    [2, 1] = new Cell() { Value = 8, Allocated = 8, State = State.Allocated },
//    [0, 2] = new Cell() { Value = 50 },
//    [1, 2] = new Cell() { Value = 40, Allocated = 7, State = State.Allocated },
//    [2, 2] = new Cell() { Value = 70 },
//    [0, 3] = new Cell() { Value = 10, Allocated = 2, State = State.Allocated },
//    [1, 3] = new Cell() { Value = 60, Allocated = 2, State = State.Allocated },
//    [2, 3] = new Cell() { Value = 20, Allocated = 10, State = State.Allocated },
//}.GetOptimalSolution();


//var optimalSolution = new Matrix(3, 4)
//{
//    [0, 0] = new Cell() { Value = 2, Allocated = 50, State = State.Allocated },
//    [1, 0] = new Cell() { Value = 1 },
//    [2, 0] = new Cell() { Value = 3 },
//    [0, 1] = new Cell() { Value = 5, Allocated = 0, State = State.Allocated },
//    [1, 1] = new Cell() { Value = 2, Allocated = 20, State = State.Allocated },
//    [2, 1] = new Cell() { Value = 1, Allocated = 20, State = State.Allocated },
//    [0, 2] = new Cell() { Value = 4 },
//    [1, 2] = new Cell() { Value = 1, Allocated = 70, State = State.Allocated },
//    [2, 2] = new Cell() { Value = 5 },
//    [0, 3] = new Cell() { Value = 5 },
//    [1, 3] = new Cell() { Value = 4 },
//    [2, 3] = new Cell() { Value = 2, Allocated = 40, State = State.Allocated },
//}.GetOptimalSolution();