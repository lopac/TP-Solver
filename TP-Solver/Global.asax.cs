using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Http;
using System.Web.Optimization;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using TP_Solver.App_Start;

namespace TP_Solver
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);


            var config = new HttpConfiguration();

            //ConfigureCamelCase(config);
        }


        /// <summary>
        /// Configure all JSON responses to have camel case property names.
        /// </summary>
        private void ConfigureCamelCase(HttpConfiguration config)
        {
            var jsonFormatter = config.Formatters.JsonFormatter;
            // This next line is not required for it to work, but here for completeness - ignore data contracts.
            jsonFormatter.UseDataContractJsonSerializer = false;
            var settings = jsonFormatter.SerializerSettings;
#if DEBUG
            // Pretty json for developers.
            settings.Formatting = Formatting.Indented;
#else
        settings.Formatting = Formatting.None;
#endif
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}