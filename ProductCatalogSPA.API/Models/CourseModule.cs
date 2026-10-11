using System.ComponentModel.DataAnnotations;

namespace ProductCatalogSPA.API.Models
{
    public class CourseModule
    {
        [Key]
        public int ModuleId { get; set; }

        [Required]
        [StringLength(100)]
        public string ModuleName { get; set; } = string.Empty;

        [Required]
        public int CourseId { get; set; }

        public Course? Course { get; set; }
    }
}
