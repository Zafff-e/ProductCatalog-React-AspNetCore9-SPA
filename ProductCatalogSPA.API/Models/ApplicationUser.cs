using Microsoft.AspNetCore.Identity;

namespace ProductCatalogSPA.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
    }
}
