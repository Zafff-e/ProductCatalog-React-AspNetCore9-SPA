using System.ComponentModel.DataAnnotations;

namespace ProductCatalogSPA.API.Models
{
    public class Course
    {
        public int CourseId { get; set; }

        [Required]
        [StringLength(100)]
        public string CourseName { get; set; } = string.Empty;

        public ICollection<CourseModule>? CourseModules { get; set; }
        public ICollection<Student>? Students { get; set; }
    }
}
