using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;
    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetProductsList([FromQuery] string? category, [FromQuery] int page = 1, [FromQuery] int pageSize = 9)
    {
        var query = _context.Products.AsQueryable();

        // 篩選類別
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category == category);
        }

        // 總數
        var total = query.Count();

        // 分頁
        var items = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new
        {
            total,
            page,
            pageSize,
            items
        });
    }

    [HttpGet("{category}/{id}")]
    public ActionResult<Products> GetProduct(string category , int id)
    {
        var product = _context.Products.FirstOrDefault(p => p.Category == category && p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = $"Product with category '{category}' and ID {id} not found." });
        }

        return Ok(product);
    }

    [HttpGet("search")]

    public ActionResult<IEnumerable<Products>> SearchProducts([FromQuery] string keyword)
    {
        var results = _context.Products
            .Where(p => p.Name.Contains(keyword))
            .Select(p => new { value = p.Name , id = p.Id , category = p.Category})
            .ToList();
        return Ok(results);
    }
}
