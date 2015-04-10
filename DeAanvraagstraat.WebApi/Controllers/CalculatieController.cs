using DeAanvraagstraat.WebApi.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace DeAanvraagstraat.WebApi.Controllers
{
    public class CalculatieController : ApiController
    {
        [HttpPost, Route("api/calculatie")]
        public IHttpActionResult Post(CalculatieRequestMessage requestMessage)
        {

            return Ok(new CalculatieResponseMessage
            {
                Premie = requestMessage.Situatie.Inkomen * 0.0123d
            });
        }
    }
}