using Microsoft.EntityFrameworkCore;
using ProductCatalogSPA.API.Data;
using ProductCatalogSPA.API.Models;

namespace ProductCatalogSPA.API.Repositories
{
    public class BrandRepository : IBrandRepository
    {
        private readonly AppDbContext _context;

        public BrandRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Brand>> GetAllBrandsAsync()
        {
            return await _context.Brands.Include(b => b.Product).ToListAsync();
        }

        public async Task<Brand?> GetBrandByIdAsync(int id)
        {
            return await _context.Brands.Include(b => b.Product).FirstOrDefaultAsync(m => m.BrandId == id);
        }

        public async Task AddBrandAsync(Brand brand)
        {
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBrandAsync(Brand brand)
        {
            _context.Entry(brand).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBrandAsync(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand != null)
            {
                _context.Brands.Remove(brand);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> BrandExistsAsync(int id)
        {
            return await _context.Brands.AnyAsync(e => e.BrandId == id);
        }
    }
}
