using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace productManagerApi.Models;

    [Index(nameof(Sku), IsUnique = true)]
public class Product
{
    public int Id { get; set; }
    
    [MaxLength(50)]
    public required string Name { get; set; }

    [Column (TypeName = "nchar(6)")]
    public required string Sku { get; set; }

    [MaxLength(500)]
    public required string Description { get; set; }
    
    [MaxLength(100)]
    public required string Image { get; set; }

    [Range(0, 10000)]
    [Column(TypeName = "decimal(18, 2)")]
    public required decimal Price { get; set; } = decimal.Zero;

    public ICollection<Category> Categories { get; set; } = new List<Category>();
}
