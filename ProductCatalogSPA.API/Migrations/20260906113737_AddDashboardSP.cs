using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProductCatalogSPA.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDashboardSP : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE PROCEDURE sp_GetDashboardStats
                AS
                BEGIN
                    SELECT 
                        (SELECT COUNT(*) FROM Categories) as TotalCategories,
                        (SELECT COUNT(*) FROM Products) as TotalProducts,
                        (SELECT COUNT(*) FROM Brands) as TotalBrands,
                        (SELECT COUNT(*) FROM Students) as TotalStudents
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE sp_GetDashboardStats");
        }
    }
}
