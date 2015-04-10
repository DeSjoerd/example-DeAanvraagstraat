using DeAanvraagstraat.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DeAanvraagstraat.WebApi.Contract
{
    public class CalculatieRequestMessage
    {
        public Situatie Situatie { get; set; }
    }

    public class CalculatieResponseMessage
    {
        public double Premie { get; set; }
    }
}