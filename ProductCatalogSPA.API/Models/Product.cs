using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductCatalogSPA.API.Models
{
    public class Product
    {
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(50, ErrorMessage = "Product name cannot exceed 50 characters.")]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Date)]
        public DateTime ManufacturingDate { get; set; }

        public bool IsAvailable { get; set; }

        [Required(ErrorMessage = "Model number is required.")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "Model number must be exactly 11 characters.")]
        [Column(TypeName = "char(11)")]
        public string ModelNo { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, 9999999999999999.99, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        public Category? Category { get; set; }
        public ICollection<Brand>? Brands { get; set; }
    }
}
