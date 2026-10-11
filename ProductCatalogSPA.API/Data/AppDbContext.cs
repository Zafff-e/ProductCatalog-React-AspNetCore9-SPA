using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProductCatalogSPA.API.Models;

namespace ProductCatalogSPA.API.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Brand> Brands { get; set; }

        // Students Domain
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseModule> CourseModules { get; set; }
        public DbSet<Student> Students { get; set; }

        // Keyless Entity for SP
        public DbSet<DashboardStat> DashboardStats { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure fixed length for ModelNo
            builder.Entity<Product>()
                .Property(p => p.ModelNo)
                .IsFixedLength();

            // Setup Identity ID starting at 300 to match original requirement for Categories
            builder.Entity<Category>()
                .Property(c => c.CategoryId)
                .UseIdentityColumn(300, 1);

            // Cascade deletes
            builder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Product>()
                .HasMany(p => p.Brands)
                .WithOne(b => b.Product)
                .HasForeignKey(b => b.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cascade for students domain
            builder.Entity<Course>()
                .HasMany(c => c.CourseModules)
                .WithOne(m => m.Course)
                .HasForeignKey(m => m.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
                
            builder.Entity<Course>()
                .HasMany(c => c.Students)
                .WithOne(s => s.Course)
                .HasForeignKey(s => s.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Keyless Entity for SP
            builder.Entity<DashboardStat>().HasNoKey();
        }
    }
}
