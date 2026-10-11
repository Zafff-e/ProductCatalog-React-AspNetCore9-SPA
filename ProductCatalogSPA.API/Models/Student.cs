using System.ComponentModel.DataAnnotations;

namespace ProductCatalogSPA.API.Models
{
    public class Student
    {
        public int StudentId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int CourseId { get; set; }

        public Course? Course { get; set; }
    }
}
