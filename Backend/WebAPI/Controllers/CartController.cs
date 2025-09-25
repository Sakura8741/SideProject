
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    // AppDbContext 透過建構子注入
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    //需有登入權限
    [Authorize]
    // Get api/cart/{userId} 取得使用者購物車
    [HttpGet("{userId}")]
    public ActionResult<IEnumerable<Cart>> GetCartItems(int userId)
    {
        try
        {
            // 根據 userId 取得購物車項目，並包含相關的產品資訊
            var cartItems = _context.Cart
                .Where(u => u.UserId == userId)
                .Include(u => u.Product)
                .ToList();

            // 如果購物車為空，回傳 404 Not Found
            if (cartItems == null || cartItems.Count == 0)
            {
                return NotFound(new { message = "購物車為空" });
            }
            return Ok(cartItems);
        }catch(Exception ex)
        {
            return BadRequest(new { message = ex });
        }
    }

    //需有登入權限
    [Authorize]
    // Post api/cart/add 新增商品到購物車
    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] Cart item)
    {
        try
        {
            // 檢查商品是否存在購物車中
            var cartitem = _context.Cart.FirstOrDefault(c => c.UserId == item.UserId && c.ProductId == item.ProductId);
            
            // 如果商品已存在，更新數量
            if (cartitem != null)
            {
                cartitem.Qty += item.Qty;
            }
            // 如果商品不存在，新增到購物車
            else
            {
                _context.Cart.Add(item);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "商品已加入購物車" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex });
        }
    }

    //需有登入權限
    [Authorize]
    // Put api/cart/update/{id} 更新購物車商品數量
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateCartItem(int id, [FromBody] Cart item)
    {
        try
        {
            // 查找購物車項目
            var cartitem = await _context.Cart.FindAsync(id);

            // 如果找到，更新數量
            if (cartitem != null)
            {
                cartitem.Qty = item.Qty;
                await _context.SaveChangesAsync();
                return Ok(new { message = "購物車已更新" });
            }
            // 如果沒找到，回傳 404 Not Found
            return NotFound(new { message = "該商品不存在購物車" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex });
        }
    }

    //需有登入權限
    [Authorize]
    // Delete api/cart/remove/{id} 從購物車移除商品
    [HttpDelete("remove/{id}")]
    public async Task<IActionResult> RemoveCartItem(int id)
    {
        try
        {
            // 查找購物車項目
            var cartitem = await _context.Cart.FindAsync(id);

            // 如果找到，刪除該項目
            if (cartitem != null)
            {
                _context.Cart.Remove(cartitem);
                await _context.SaveChangesAsync();

                return Ok(new { message = "刪除成功" });
            }

            // 如果沒找到，回傳 404 Not Found
            return NotFound(new { message = "該商品不存在購物車" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex });
        }
    }
}
