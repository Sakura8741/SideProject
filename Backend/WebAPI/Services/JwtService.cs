using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
namespace WebAPI.Services
{
    // JWT Service
    public class JwtService
    {
        private readonly IConfiguration _config;
        public JwtService(IConfiguration configuration)
        {
            _config = configuration;
        }

        // 產生 token：接受 userId, username, role 三個資料然後回傳字串型的 JWT
        public string GenerateToken(int userId, string username , string role)
        {

            // 1) 建立要放進 token 的 claims（payload 內的資料）
            var claims = new[]
            {
                new Claim("userId", userId.ToString()),
                new Claim("username", username),
                new Claim(ClaimTypes.Role , role)
            };

            // 2) 取得對稱加密金鑰（從設定檔或環境變數）
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            // 3) 用金鑰建立簽章憑證（指定演算法）
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 4) 建立 JwtSecurityToken (包含 issuer, audience, claims, expiry, signingCredentials)
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
                );

            // 5) 把 JwtSecurityToken 轉成字串 (compact JWT)
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
