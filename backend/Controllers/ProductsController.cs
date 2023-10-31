using Microsoft.AspNetCore.Mvc;
using productManagerApi.Data;
using productManagerApi.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace productManagerApi.Controllers;
[Authorize]
[Route("[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext context;

    public ProductsController(ApplicationDbContext context)
    {
        this.context = context;
    }


    /// <summary>
    /// Hämta alla produkter
    /// </summary>
    /// <param name="name">Name att filtrerar på</param>
    /// <returns>Array av produkt</returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IEnumerable<ProductDTO> GetProducts([FromQuery] string? name)
    {
        IEnumerable<Product> products = name is not null
            ? context.Products.Include(p => p.Categories).Where(p => p.Name.Contains(name))
            : context.Products.Include(p => p.Categories).ToList();

        var productDtos = products.Select(MapToProductDto);

        return productDtos;
    }

    /// <summary>
    /// Hämta produkt
    /// </summary>
    /// <param name="sku">SKU för produkt</param>
    /// <returns>Produkt</returns>
    [HttpGet("{sku}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<ProductDTO> GetProductBySku(string sku)
    {
        var product = context.Products.FirstOrDefault(p => p.Sku == sku);

        if (product is null) 
        {
            return NotFound(); 
        }

        var productDto = MapToProductDto(product);

        return productDto; 
    }


    /// <summary>
    /// Lägg till ny produkt
    /// </summary>
    /// <param name="createProductRequest">Information om produkten</param>
    /// <returns>Produkt</returns>
    [Authorize(Roles = "Administrator")]
    [HttpPost]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult<ProductDTO> CreateProduct(CreateProductRequest createProductRequest)
    {
        var product = MapToProduct(createProductRequest);

        if(product.Name is null or "")
        {
            return BadRequest(); 
        }

        context.Products.Add(product);

        context.SaveChanges();

        var productDto = MapToProductDto(product);

        return Created("", productDto); 
    }


    /// <summary>
    /// Radera produkt
    /// </summary>
    /// <param name="sku">SKU för produkt</param>
    [Authorize(Roles = "Administrator")]
    [HttpDelete("{sku}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult DeleteProduct(string sku)
    {
        var product = context.Products.FirstOrDefault(p => p.Sku == sku);

        if(product is null)
        {
            return NotFound(new { StatusCode = 404, Message = "Product hittas inte." });
        }

        context.Products.Remove(product);
        context.SaveChanges();

        return NoContent(); 
    }


    /// <summary>
    /// Uppdatera produkt
    /// </summary>
    /// <param name="sku">SKU för produkt</param>
    /// <param name="updateProductRequest">Information om produkten</param>
    [Authorize(Roles = "Administrator")]
    [HttpPut("{sku}")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult UpdateProduct(string sku, UpdateProductRequest updateProductRequest)
    {
        if (updateProductRequest.Sku != sku)
        {
            return BadRequest("SKU does not match"); 
        };

        var product = context.Products.FirstOrDefault(p => p.Sku == sku);

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
            Categories = product.Categories.Select(category => new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name,
              
            }).ToList()
        };

}

public class UpdateProductRequest
{
    public int Id { get; set; }
    [MaxLength(50)]
    [Required]
    public string Name { get; set; }

    /// <summary>
    /// SKU för produkten (6 tecken)
    /// </summary>
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

    /// <summary>
    /// SKU för produkten (6 tecken)
    /// </summary>
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

    public ICollection<CategoryDTO> Categories { get; set; } = new List<CategoryDTO>();
}

