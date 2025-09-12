using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using WebAPI.Models;

public class TextController : ControllerBase
{
    private readonly AppDbContext _context;
    public TextController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("test-db")]
    public IActionResult TestDatabase()
    {
        try
        {
            // 嘗試連線並取得一筆資料
            var product = _context.Products.FirstOrDefault();

            if (product == null)
                return Ok("資料庫連線成功，但目前沒有資料。");

            return Ok(new { message = "資料庫連線成功！", firstProduct = product });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "資料庫連線失敗", error = ex.Message });
        }
    }

}
