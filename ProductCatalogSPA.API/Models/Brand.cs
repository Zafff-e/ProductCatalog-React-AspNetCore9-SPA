using System.ComponentModel.DataAnnotations;

namespace ProductCatalogSPA.API.Models
{
    public class Brand
    {
        public int BrandId { get; set; }

        [Required(ErrorMessage = "Brand name is required.")]
        [StringLength(20, ErrorMessage = "Brand name cannot exceed 20 characters.")]
        public string BrandName { get; set; } = string.Empty;

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative.")]
        public int Stock { get; set; }

        [Required]
        public int ProductId { get; set; }

        public Product? Product { get; set; }
    }
}
