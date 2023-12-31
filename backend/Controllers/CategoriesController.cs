﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using productManagerApi.Data;
using productManagerApi.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace productManagerApi.Controllers;
[Authorize]
[Route("[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext context;

    public CategoriesController(ApplicationDbContext context)
    {
        this.context = context;
    }


    /// <summary>
    /// Hämta alla kategorier 
    /// </summary>
    /// <param name="name">Name att filtrerar på</param>
    /// <returns>Array av kategorier</returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IEnumerable<CategoryDTO> GetCategory([FromQuery] string? name)
    {
        IEnumerable<Category> categories = name is not null
          ? context.Categories.Include(c => c.Products).Where(p => p.Name.Contains(name))
           : context.Categories.Include(c => c.Products).ToList();

        
       var categoryDtos = categories.Select(MapToCategoryDto);

        return categoryDtos;
    }

    /// <summary>
    /// Lägg till ny kategori
    /// </summary>
    /// <param name="createCategoryRequest">Information om kategorin</param>
    /// <returns>Kategori</returns>
    [Authorize(Roles = "Administrator")]
    [HttpPost("new")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult<CategoryDTO> CreateCategory(CreateCategoryRequest createCategoryRequest)
    {
        var category = new Category
                      { Name = createCategoryRequest.Name };

        if (category.Name is null or "")
        {
            return BadRequest();
        }

        context.Categories.Add(category);

        context.SaveChanges();

        var categoryDto = MapToCategoryDto(category);

        return Created("", categoryDto);
    }

    /// <summary>
    /// Lägg till produkt till kategori
    /// </summary>
    /// <param name="productRequest">Information om produkt </param>
    /// <returns>Kategori</returns>
    [Authorize(Roles = "Administrator")]
    [HttpPost("{id}/products")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult<CategoryDTO> AddProductInCategory(int id, [FromBody] ProductRequest productRequest)
    {
        var product = MapToProduct(productRequest);

        var category = context.Categories.FirstOrDefault(c => c.Id == id);
        product = context.Products.FirstOrDefault(p => p.Sku == productRequest.Sku);


        if (category is null || product is null)
        {
            return BadRequest();
        }

        if (product.Categories.Any(c => c.Id == category.Id))
        {
            return NoContent(); // The association already exists, so no action is needed.
        }

        
        product.Categories.Add(category); // Lägg till kategorin för produkten.
        category.Products.Add(product);   // lägg till producten för kategorin. 
       
        context.SaveChanges();


        var categoryDto = MapToCategoryDto(category);

        return Created("", categoryDto);
    }


    private Product MapToProduct(ProductRequest productRequest)
        => new()
        {
            Name = productRequest.Name,
            Sku = productRequest.Sku,
            Description = productRequest.Description,
            Image = productRequest.Image,
            Price = productRequest.Price,
        };


    private CategoryDTO MapToCategoryDto(Category category)
        => new()
        {
            Id = category.Id,
            Name = category.Name,
            Products = category.Products.Select(product => new ProductDTO
            {
                Id = product.Id,
                Sku = product.Sku,
                Name = product.Name,
                Description = product.Description,
                Image = product.Image,
                Price = product.Price,
            }).ToList()
        };
}

public class ProductRequest
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

public class CreateCategoryRequest
{
    [MaxLength(50)]
    [Required]
    public string Name { get; set; }
}
public class CategoryDTO
{
    public int Id { get; set; }

    public string Name { get; set; }

    public ICollection<ProductDTO> Products { get; set; } = new List<ProductDTO>();

}
