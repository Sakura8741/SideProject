using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize(Roles = "Admin")]
    [HttpGet("management/list")]
    public IActionResult GetAllProducts([FromQuery] int page = 1 , [FromQuery] int pageSize = 9)
    {
        var total = _context.Products.Count();
        var products = _context.Products
                               .OrderBy(p => p.Id)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToList();

        return Ok(new { items = products, total });
    }


    [Authorize(Roles = "Admin")]
    [HttpPost("management/add")]
    public async Task<IActionResult> AddProduct([FromBody] Products newProduct)
    {
        _context.Products.Add(newProduct);
        await _context.SaveChangesAsync();
        return Ok(new { message = "新增商品成功" });
    }


    [Authorize(Roles = "Admin")]
    [HttpPut("management/update")]
    
    public async Task<IActionResult> UpdateProduct([FromBody] Products updatedProduct)
    {
        Console.WriteLine(updatedProduct);
        var product = await _context.Products.FindAsync(updatedProduct.Id);
        if (product == null)
        {
            return NotFound(new { message = "Product not found" });
        }
        product.Name = updatedProduct.Name;
        product.Price = updatedProduct.Price;
        product.Stock = updatedProduct.Stock;
        product.Descriptions = updatedProduct.Descriptions;
        product.Image = updatedProduct.Image;
        product.Category = updatedProduct.Category;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Product updated successfully" });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("management/delete")]
    public async Task<IActionResult> DeleteProduct([FromQuery] int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = "沒有找到該商品" });
        }
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return Ok(new { message = "刪除商品成功" });
    }
}
