using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductCatalogSPA.API.Data;
using ProductCatalogSPA.API.Models;

namespace ProductCatalogSPA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStat>> GetStats()
        {
            var stats = await _context.DashboardStats
                                      .FromSqlRaw("EXEC sp_GetDashboardStats")
                                      .ToListAsync();
                                      
            if (stats == null || stats.Count == 0) return NotFound();
            
            return Ok(stats[0]);
        }
    }
}
