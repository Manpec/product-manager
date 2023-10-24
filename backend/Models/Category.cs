using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace productManagerApi.Models;

[Index(nameof(Name), IsUnique = true)]
public class Category
{
    public int Id { get; set; }

    [MaxLength(50)]
    public required string Name { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();

}
