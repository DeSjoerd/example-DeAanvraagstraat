using Autofac;
using Autofac.Integration.Owin;
using Autofac.Integration.WebApi;
using DeAanvraagstraat.WebApi;
using Microsoft.Owin;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

[assembly: OwinStartup(typeof(Startup))]
namespace DeAanvraagstraat.WebApi
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var container = BuildContainer();

            app.UseAutofacMiddleware(container);

            ConfigureWebApi(app, container);
        }

        private ILifetimeScope BuildContainer()
        {
            var thisAssembly = typeof(Startup).Assembly;
            var builder = new ContainerBuilder();
            
            builder.RegisterApiControllers(thisAssembly);

            return builder.Build();
        }
    }
}