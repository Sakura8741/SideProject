using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using WebAPI.Services;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    // AppDbContext 透過建構子注入
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // POST api/users/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
    {
        try
        {
            // 檢查帳號是否已存在
            if (_context.Users.Any(u => u.Account == dto.Account))
                return BadRequest(new { message = "帳號已存在" });

            // 使用 BCrypt 進行密碼雜湊
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // 建立新使用者
            var user = new Users
            {
                Name = dto.Username,
                Account = dto.Account,
                Password = passwordHash
            };

            // 將使用者新增到資料庫
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "註冊成功" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

        // POST api/users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto, [FromServices] JwtService jwtService)
        {
            try
            {
                // 根據帳號查找使用者
                var user = await _context.Users.SingleOrDefaultAsync(u => u.Account == dto.Account);

                // 如果使用者不存在或密碼不正確，回傳 401 Unauthorized
                if (user == null)
                    return Unauthorized(new { message = "使用者不存在" });

                if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                    return Unauthorized(new { message = "帳號或密碼錯誤" });

                // 產生 JWT
                var token = jwtService.GenerateToken(user.Id, user.Name, user.Role);

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

