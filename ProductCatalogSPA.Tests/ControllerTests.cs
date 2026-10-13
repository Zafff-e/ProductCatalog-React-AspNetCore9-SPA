using Microsoft.AspNetCore.Mvc;
using Moq;
using ProductCatalogSPA.API.Controllers;
using ProductCatalogSPA.API.Models;
using ProductCatalogSPA.API.Repositories;
using Xunit;

namespace ProductCatalogSPA.Tests
{
    public class ControllerTests
    {
        [Fact]
        public async Task BrandsController_GetBrands_ReturnsOkResultWithListOfBrands()
        {
            // Arrange
            var mockRepo = new Mock<IBrandRepository>();
            var sampleBrands = new List<Brand>
            {
                new Brand { BrandId = 1, BrandName = "Apple" },
                new Brand { BrandId = 2, BrandName = "Dell" }
            };
            mockRepo.Setup(r => r.GetAllBrandsAsync()).ReturnsAsync(sampleBrands);
            var controller = new BrandsController(mockRepo.Object);

            // Act
            var actionResult = await controller.GetBrands();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedBrands = Assert.IsAssignableFrom<IEnumerable<Brand>>(okResult.Value);
            Assert.Equal(2, returnedBrands.Count());
        }

        [Fact]
        public async Task BrandsController_GetBrand_ExistingId_ReturnsOkWithBrand()
        {
            // Arrange
            var mockRepo = new Mock<IBrandRepository>();
            var brand = new Brand { BrandId = 10, BrandName = "Logitech" };
            mockRepo.Setup(r => r.GetBrandByIdAsync(10)).ReturnsAsync(brand);
            var controller = new BrandsController(mockRepo.Object);

            // Act
            var actionResult = await controller.GetBrand(10);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedBrand = Assert.IsType<Brand>(okResult.Value);
            Assert.Equal("Logitech", returnedBrand.BrandName);
        }

        [Fact]
        public async Task BrandsController_GetBrand_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            var mockRepo = new Mock<IBrandRepository>();
            mockRepo.Setup(r => r.GetBrandByIdAsync(999)).ReturnsAsync((Brand?)null);
            var controller = new BrandsController(mockRepo.Object);

            // Act
            var actionResult = await controller.GetBrand(999);

            // Assert
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task CategoriesController_GetCategories_ReturnsOkWithCategories()
        {
            // Arrange
            var mockRepo = new Mock<ICategoryRepository>();
            var categories = new List<Category>
            {
                new Category { CategoryId = 1, CategoryName = "Laptops" }
            };
            mockRepo.Setup(r => r.GetAllCategoriesAsync()).ReturnsAsync(categories);
            var controller = new CategoriesController(mockRepo.Object);

            // Act
            var actionResult = await controller.GetCategories();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returned = Assert.IsAssignableFrom<IEnumerable<Category>>(okResult.Value);
            Assert.Single(returned);
        }

        [Fact]
        public async Task CoursesController_GetCourses_ReturnsOkWithCourses()
        {
            // Arrange
            var mockRepo = new Mock<ICourseRepository>();
            var courses = new List<Course>
            {
                new Course { CourseId = 1, CourseName = "Enterprise .NET Core" }
            };
            mockRepo.Setup(r => r.GetAllCoursesAsync()).ReturnsAsync(courses);
            var controller = new CoursesController(mockRepo.Object);

            // Act
            var actionResult = await controller.GetCourses();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returned = Assert.IsAssignableFrom<IEnumerable<Course>>(okResult.Value);
            Assert.Single(returned);
        }
    }
}
