using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TP_Solver.Helpers
{
    public static class StringExtensions
    {
        public static string ReplaceLastOccurrence(this string source, string find, string replace)
        {
            int place = source.LastIndexOf(find);

            if (place == -1)
            {
                return source;
            }

            string result = source.Remove(place, find.Length).Insert(place, replace);
            return result;
        }
    }
}
