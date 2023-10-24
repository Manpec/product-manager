using Microsoft.AspNetCore.Mvc;
using productManagerApi.Data;
using productManagerApi.Models;
using System.ComponentModel.DataAnnotations;

namespace productManagerApi.Controllers;

[Route("[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext context;

    public CategoriesController(ApplicationDbContext context)
    {
        this.context = context;
    }

    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IEnumerable<CategoryDTO> GetCategory([FromQuery] string? name)
    {
        IEnumerable<Category> categories = name is not null
            ? context.Categories.Where(p => p.Name.Contains(name))
            : context.Categories.ToList();

        var categoryDtos = categories.Select(MapToCategoryDto);

        return categoryDtos;
    }

    [HttpPost]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

    

    private CategoryDTO MapToCategoryDto(Category category)
        => new()
        {
            Id = category.Id,
            Name = category.Name,
        };
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
}
