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

    [HttpDelete("{sku}")]
    public ActionResult DeleteProduct(string sku)
    {
        var product = context.Products.FirstOrDefault(p => p.Sku == sku);

        if(product is null)
        {
            return NotFound(new { StatusCode = 404, Message = "Product hittas inte." });
        }

        context.Products.Remove(product);
        context.SaveChanges();

        return NoContent(); //204 Not Content
    }

    [HttpPut("{sku}")]
    public ActionResult UpdateProduct(string sku, UpdateProductRequest updateProductRequest)
    {
        if (updateProductRequest.Sku != sku)
        {
            return BadRequest("ID does not match"); //400 Bad Request
        };

        var product = context.Products.FirstOrDefault(p => p.Sku == sku);

        //Om produkten inte finns ska 404 Not Found returneras.
        if (product is null)
        {
            return NotFound(new { StatusCode = 404, Message = "Produkt hittas inte." });
        };

        var updatedProduct = MapToProductFromUpdateRequest(updateProductRequest);

        product.Price = updatedProduct.Price;
        product.Description = updatedProduct.Description;
        product.Name = updatedProduct.Name;
        product.Image = updatedProduct.Image; 
        
        context.SaveChanges();

        //Om produkten uppdaterades ska 204 No Content returneras.
        return NoContent();
    }

    private Product MapToProductFromUpdateRequest(UpdateProductRequest updateProductRequest)
        => new()
        {
            Id = updateProductRequest.Id,
            Name = updateProductRequest.Name,
            Sku = updateProductRequest.Sku,
            Description = updateProductRequest.Description,
            Image = updateProductRequest.Image,
            Price = updateProductRequest.Price,
            
        };

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

public class UpdateProductRequest
{
    public int Id { get; set; }
    [MaxLength(50)]
    [Required]
    public string Name { get; set; }

    [Column(TypeName = "nchar(6)")]
    [Required]
    public string Sku { get; set; }

    [MaxLength(500)]
    [Required]
    public string Description { get; set; }

    [MaxLength(100)]
    [Required]
    public string Image { get; set; }

    [Range(0, 10000)]
    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; } = decimal.Zero;
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
    [Required]
    public string Description { get; set; }

    [MaxLength(100)]
    [Required]
    public string Image { get; set; }

    [Range(0, 10000)]
    [Required]
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

