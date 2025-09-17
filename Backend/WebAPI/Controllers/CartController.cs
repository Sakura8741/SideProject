
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

[ApiController]
[Route("api/[controller]")]

public class CartController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public CartController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public ActionResult<IEnumerable<Cart>> GetCartItems(int userId)
    {
        var cartItems = _context.Cart
            .Where(u => u.UserId == userId)
            .Include(u => u.Product)
            .ToList();
        return Ok(cartItems);
    }
    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] Cart item)
    {
        var cartitem = _context.Cart.FirstOrDefault(c => c.UserId == item.UserId && c.ProductId == item.ProductId);
        if (cartitem != null)
        {
            cartitem.Qty += item.Qty;
        }
        else
        {
            _context.Cart.Add(item);
        }
        await _context.SaveChangesAsync();
        return Ok(new { message = "商品已加入購物車" });
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateCartItem(int id ,[FromBody] Cart item)
    {
        var cartitem = await _context.Cart.FindAsync(id);
        if (cartitem != null)
        {
            cartitem.Qty = item.Qty;
            await _context.SaveChangesAsync();
            return Ok(new { message = "購物車已更新" });
        }
        return NotFound(new { message = "購物車項目不存在" });
    }

    [HttpDelete("remove/{id}")]
    public async Task<IActionResult> RemoveCartItem(int id)
    {
        var cartitem = await _context.Cart.FindAsync(id);
        if (cartitem != null)
        {
            _context.Cart.Remove(cartitem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "刪除成功" });
        }
        return NotFound(new { message = "購物車項目不存在" });
    }
}
