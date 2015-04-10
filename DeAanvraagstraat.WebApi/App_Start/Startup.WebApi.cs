using Autofac;
using Autofac.Integration.WebApi;
using Newtonsoft.Json.Serialization;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace DeAanvraagstraat.WebApi
{
    public partial class Startup
    {
        public void ConfigureWebApi(IAppBuilder app, ILifetimeScope container)
        {
            var config = new HttpConfiguration();

            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            config.MapHttpAttributeRoutes();

            // use camelCase for output and input instead of PascalCase
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            app.UseAutofacWebApi(config);
            app.UseWebApi(config);
        }
    }
}