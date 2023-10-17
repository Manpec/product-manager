using Microsoft.AspNetCore.Mvc;
using productManagerApi.Data;
using productManagerApi.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

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
    public IEnumerable<ProductDTO> GetProducts([FromQuery] string? name)
    {
        IEnumerable<Product> products = name is not null
            ? context.Products.Where(p => p.Name.Contains(name))
            : context.Products.ToList();

        var productDtos = products.Select(MapToProductDto);

        return productDtos;
    }

    [HttpGet("{sku}")]
    public ActionResult<ProductDTO> GetProductBySku(string sku)
    {
        var product = context.Products.FirstOrDefault(p => p.Sku == sku);

        if (product is null) 
        {
            return NotFound(); //"404 Mot Found"
        }

        var productDto = MapToProductDto(product);

        return productDto; //Status kod "200 OK"
    }

    [HttpPost]
    public ActionResult<ProductDTO> CreateProduct(CreateProductRequest createProductRequest)
    {
        var product = MapToProduct(createProductRequest);

        if(product.Name is null or "")
        {
            return BadRequest(); // 400 Bad Request
        }

        context.Products.Add(product);

        context.SaveChanges();

        var productDto = MapToProductDto(product);

        return Created("", productDto); //om det lyckas return "201 Created" 
    }

    private Product MapToProduct(CreateProductRequest createProductRequest)
        => new()
        {
            Name = createProductRequest.Name,
            Sku = createProductRequest.Sku,
            Description = createProductRequest.Description,
            Image = createProductRequest.Image,
            Price = createProductRequest.Price,
        };

    private ProductDTO MapToProductDto(Product product)
        => new()
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            Description = product.Description,
            Image = product.Image,
            Price = product.Price,
        };

}

public class CreateProductRequest
{
    [MaxLength(50)]
    [Required]
    public string Name { get; set; }

    [Column(TypeName = "nchar(6)")]
    [Required]
    public string Sku { get; set; }

    [MaxLength(500)]
    public string Description { get; set; }

    [MaxLength(100)]
    public string Image { get; set; }

    [Range(0, 10000)]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; } = decimal.Zero;
}

public class ProductDTO
{
    public int Id { get; set; }

    public string Name { get; set; }

    public  string Sku { get; set; }

    public  string Description { get; set; }

    public  string Image { get; set; }

    public  decimal Price { get; set; } = decimal.Zero;
}

