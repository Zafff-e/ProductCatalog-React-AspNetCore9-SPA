using Microsoft.EntityFrameworkCore;
using ProductCatalogSPA.API.Data;
using ProductCatalogSPA.API.Models;
using ProductCatalogSPA.API.Repositories;
using Xunit;

namespace ProductCatalogSPA.Tests
{
    public class RepositoryTests
    {
        private AppDbContext CreateDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        private async Task<Product> CreateSampleProductAsync(AppDbContext context)
        {
            var category = new Category { CategoryName = "Electronics" };
            context.Categories.Add(category);
            await context.SaveChangesAsync();

            var product = new Product
            {
                ProductName = "Gaming Laptop",
                Price = 1499.99m,
                IsAvailable = true,
                ManufacturingDate = DateTime.UtcNow,
                CategoryId = category.CategoryId,
                ModelNo = "LAPTOP12345" // exactly 11 chars
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();
            return product;
        }

        [Fact]
        public async Task BrandRepository_AddAndGetById_ReturnsBrand()
        {
            // Arrange
            using var context = CreateDbContext();
            var product = await CreateSampleProductAsync(context);
            var repository = new BrandRepository(context);
            var brand = new Brand 
            { 
                BrandName = "Asus ROG",
                Stock = 25,
                ProductId = product.ProductId
            };

            // Act
            await repository.AddBrandAsync(brand);
            var result = await repository.GetBrandByIdAsync(brand.BrandId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Asus ROG", result.BrandName);
            Assert.Equal(25, result.Stock);
            Assert.Equal(product.ProductId, result.ProductId);
        }

        [Fact]
        public async Task BrandRepository_GetAllBrands_ReturnsAllAddedBrands()
        {
            // Arrange
            using var context = CreateDbContext();
            var product = await CreateSampleProductAsync(context);
            var repository = new BrandRepository(context);
            await repository.AddBrandAsync(new Brand { BrandName = "Intel", Stock = 10, ProductId = product.ProductId });
            await repository.AddBrandAsync(new Brand { BrandName = "AMD", Stock = 15, ProductId = product.ProductId });

            // Act
            var brands = await repository.GetAllBrandsAsync();

            // Assert
            Assert.Equal(2, brands.Count());
        }

        [Fact]
        public async Task BrandRepository_UpdateBrand_ModifiesPersistedBrand()
        {
            // Arrange
            using var context = CreateDbContext();
            var product = await CreateSampleProductAsync(context);
            var repository = new BrandRepository(context);
            var brand = new Brand { BrandName = "Nvidia", Stock = 5, ProductId = product.ProductId };
            await repository.AddBrandAsync(brand);

            // Act
            brand.BrandName = "Nvidia GeForce";
            brand.Stock = 8;
            await repository.UpdateBrandAsync(brand);
            var updated = await repository.GetBrandByIdAsync(brand.BrandId);

            // Assert
            Assert.NotNull(updated);
            Assert.Equal("Nvidia GeForce", updated.BrandName);
            Assert.Equal(8, updated.Stock);
        }

        [Fact]
        public async Task BrandRepository_DeleteBrand_RemovesBrandFromDatabase()
        {
            // Arrange
            using var context = CreateDbContext();
            var product = await CreateSampleProductAsync(context);
            var repository = new BrandRepository(context);
            var brand = new Brand { BrandName = "Corsair", Stock = 12, ProductId = product.ProductId };
            await repository.AddBrandAsync(brand);

            // Act
            await repository.DeleteBrandAsync(brand.BrandId);
            var result = await repository.GetBrandByIdAsync(brand.BrandId);
            var exists = await repository.BrandExistsAsync(brand.BrandId);

            // Assert
            Assert.Null(result);
            Assert.False(exists);
        }

        [Fact]
        public async Task CategoryRepository_AddAndGet_ReturnsCategory()
        {
            // Arrange
            using var context = CreateDbContext();
            var repository = new CategoryRepository(context);
            var category = new Category { CategoryName = "Processors" };

            // Act
            await repository.AddCategoryAsync(category);
            var result = await repository.GetCategoryByIdAsync(category.CategoryId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Processors", result.CategoryName);
            Assert.True(await repository.CategoryExistsAsync(category.CategoryId));
        }

        [Fact]
        public async Task ProductRepository_AddAndGet_ReturnsProduct()
        {
            // Arrange
            using var context = CreateDbContext();
            var categoryRepo = new CategoryRepository(context);
            var category = new Category { CategoryName = "Graphics Cards" };
            await categoryRepo.AddCategoryAsync(category);

            var productRepo = new ProductRepository(context);
            var product = new Product
            {
                ProductName = "GeForce RTX 4090",
                Price = 1999.99m,
                IsAvailable = true,
                ManufacturingDate = DateTime.UtcNow,
                CategoryId = category.CategoryId,
                ModelNo = "RTX40901234" // exactly 11 chars
            };

            // Act
            await productRepo.AddProductAsync(product);
            var result = await productRepo.GetProductByIdAsync(product.ProductId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("GeForce RTX 4090", result.ProductName);
            Assert.Equal(1999.99m, result.Price);
            Assert.True(await productRepo.ProductExistsAsync(product.ProductId));
        }
    }
}
