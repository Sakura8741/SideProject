using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]

    public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
    {
        if (_context.Users.Any(u => u.Account == dto.Account))
            return BadRequest(new { message = "帳號已存在" });


        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new Users
        {
            Name = dto.Username,
            Account = dto.Account,
            Password = passwordHash
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "註冊成功" });
    }

    [HttpPost("login")]

    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Account == dto.Account);
        
        if (user == null )
            return BadRequest(new { message = "使用者不存在" });

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            return BadRequest(new { message = "帳號或密碼錯誤" });

        return Ok(new { message = "登入成功", userId = user.Id , username = user.Name });
    }
}

