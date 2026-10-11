using ProductCatalogSPA.API.Models;

namespace ProductCatalogSPA.API.Repositories
{
    public interface IBrandRepository
    {
        Task<IEnumerable<Brand>> GetAllBrandsAsync();
        Task<Brand?> GetBrandByIdAsync(int id);
        Task AddBrandAsync(Brand brand);
        Task UpdateBrandAsync(Brand brand);
        Task DeleteBrandAsync(int id);
        Task<bool> BrandExistsAsync(int id);
    }
}
