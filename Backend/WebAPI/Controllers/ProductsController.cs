using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WebAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // AppDbContext 透過建構子注入
    private readonly AppDbContext _context;
    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/products 依照類別篩選並分頁
    [HttpGet]
    public IActionResult GetProductsList([FromQuery] string? category, [FromQuery] int page = 1, [FromQuery] int pageSize = 9)
    {
        try
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
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/products/{category}/{id} 依照類別和ID取得單一商品
    [HttpGet("{category}/{id}")]
    public ActionResult<Products> GetProduct(string category, int id)
    {
        try
        {
            // 根據類別和ID查找商品
            var product = _context.Products.FirstOrDefault(p => p.Category == category && p.Id == id);

            // 如果找不到商品，回傳 404 Not Found
            if (product == null)
            {
                return NotFound(new { message = $"Product with category '{category}' and ID {id} not found." });
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/products/search?keyword=xxx 依照關鍵字搜尋商品
    [HttpGet("search")]
    public ActionResult<IEnumerable<Products>> SearchProducts([FromQuery] string keyword)
    {
        try
        {
            // 根據關鍵字搜尋商品名稱
            var results = _context.Products
                .Where(p => p.Name.Contains(keyword))
                .Select(p => new { value = p.Name, id = p.Id, category = p.Category })
                .ToList();
            if (results.Count == 0)
            {
                return NotFound(new { message = "沒有找到對應的商品" });
            }
            return Ok(results);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // 管理端專用的API
    [Authorize(Roles = "Admin")]
    // GET api/products/management/list 商品管理分頁取得所有商品
    [HttpGet("management/list")]
    public IActionResult GetAllProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 9)
    {
        try
        {
            // 商品總數
            var total = _context.Products.Count();
            // 分頁取得商品
            var products = _context.Products
                                   .OrderBy(p => p.Id)
                                   .Skip((page - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToList();

            return Ok(new { items = products, total });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    // 管理端專用的API
    [Authorize(Roles = "Admin")]
    // POST api/products/management/add 商品管理分頁新增商品
    [HttpPost("management/add")]
    public async Task<IActionResult> AddProduct([FromBody] Products newProduct)
    {
        try
        {
            // 將新商品加入資料庫
            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();
            return Ok(new { message = "新增商品成功" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // 管理端專用的API
    [Authorize(Roles = "Admin")]
    // PUT api/products/management/update 商品管理分頁更新商品
    [HttpPut("management/update")]
    public async Task<IActionResult> UpdateProduct([FromBody] Products updatedProduct)
    {
        try
        {
            // 根據ID查找商品
            var product = await _context.Products.FindAsync(updatedProduct.Id);
            if (product == null)
            {
                return NotFound(new { message = "找不到該商品" });
            }

            // 更新商品資訊
            product.Name = updatedProduct.Name;
            product.Price = updatedProduct.Price;
            product.Stock = updatedProduct.Stock;
            product.Descriptions = updatedProduct.Descriptions;
            product.Image = updatedProduct.Image;
            product.Category = updatedProduct.Category;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // 管理端專用的API
    [Authorize(Roles = "Admin")]
    // DELETE api/products/management/delete?id=xxx 商品管理分頁刪除商品
    [HttpDelete("management/delete")]
    public async Task<IActionResult> DeleteProduct([FromQuery] int id)
    {
        // 根據ID查找商品
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = "沒有找到該商品" });
        }
        // 刪除商品
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return Ok(new { message = "刪除商品成功" });
    }
}
