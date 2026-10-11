using System.ComponentModel.DataAnnotations;

namespace ProductCatalogSPA.API.Models
{
    public class Category
    {
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(20, ErrorMessage = "Category name cannot exceed 20 characters.")]
        public string CategoryName { get; set; } = string.Empty;

        public ICollection<Product>? Products { get; set; }
    }
}
