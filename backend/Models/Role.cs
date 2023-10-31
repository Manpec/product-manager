using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace productManagerApi.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Role
    {
        public int Id { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        // Navigation property
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
