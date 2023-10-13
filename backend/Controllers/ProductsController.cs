using Microsoft.AspNetCore.Mvc;
using productManagerApi.Data;
using productManagerApi.Models;

namespace productManagerApi.Controllers;

[Route("[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext context;

    public ProductsController(ApplicationDbContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public IEnumerable<Product> GetProducts()
    {
        var products = context.Products.ToList();

        return products;
    }
}

