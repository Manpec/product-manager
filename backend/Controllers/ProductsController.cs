using Microsoft.AspNetCore.Mvc;
using productManagerApi.Models;

namespace productManagerApi.Controllers;

[Route("[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IEnumerable<Product> GetProducts()
    {
        var products = new List<Product>();

        return products;
    }
}

