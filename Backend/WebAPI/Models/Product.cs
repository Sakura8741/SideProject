using Microsoft.Extensions.Primitives;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Products
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Descriptions { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }
    public class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; } 
        public int ProductId { get; set; }
        public int Qty { get; set; }
        public Products? Product { get; set; } 

    }
    public class Users
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; 
    }
    public class UserRegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Account { get; set; }
        [Required]
        [MinLength(6)]
        public string Password { get; set; }
    }

    public class UserLoginDto
    {
        [Required]
        public string Account { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
