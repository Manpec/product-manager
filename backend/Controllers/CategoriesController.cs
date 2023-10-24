using Microsoft.AspNetCore.Mvc;
using productManagerApi.Data;
using productManagerApi.Models;

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
    public IEnumerable<CategoryDTO> GetCategory([FromQuery] string? name)
    {
        IEnumerable<Category> categories = name is not null
            ? context.Categories.Where(p => p.Name.Contains(name))
            : context.Categories.ToList();

        var categoryDtos = categories.Select(MapToCategoryDto);

        return categoryDtos;
    }

    private CategoryDTO MapToCategoryDto(Category category)
        => new()
        {
            Id = category.Id,
            Name = category.Name,
        };
}

public class CategoryDTO
{
    public int Id { get; set; }

    public string Name { get; set; }
}
