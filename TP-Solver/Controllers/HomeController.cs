using System.Linq;
using System.Web.Mvc;
using TP_Solver.Helpers;
using TP_Solver.Models;

namespace TP_Solver.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
    }
}