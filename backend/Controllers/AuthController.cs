using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using productManagerApi.Data;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using productManagerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace productManagerApi.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext context;
    private readonly IConfiguration config;

    public AuthController(ApplicationDbContext context, IConfiguration config)
    {
        this.context = context;
        this.config = config;
    }

    [HttpPost]
    public ActionResult<TokenDto> Authenticate(AuthenticateRequest authenticateRequest)
    {
        var user = context.Users
            .Include(x => x.Roles) // Load all roles for the user
            .FirstOrDefault(x => 
                x.UserName == authenticateRequest.UserName
             && x.Password == authenticateRequest.Password);
        
        if (user == null)
        {
            return Unauthorized(); //401 
        }

        var tokenDto = new TokenDto
        {
            Token = GenerateToken(user)
        };

        return tokenDto; // 200 OK
    }

    private string GenerateToken(User user)
    {
        var signingKey = Convert.FromBase64String(config["Jwt:SigningSecret"]);

        var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.FullName)
            };

        foreach (var role in user.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role.Name));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(signingKey),
                SecurityAlgorithms.HmacSha256Signature),
            Subject = new ClaimsIdentity(claims)
        };

        var jwtTokenHandler = new JwtSecurityTokenHandler();

        var jwtSecurityToken = jwtTokenHandler
          .CreateJwtSecurityToken(tokenDescriptor);


        return jwtTokenHandler.WriteToken(jwtSecurityToken);
    }
}
public class TokenDto
{
    public string Token { get; set; }
}

public class AuthenticateRequest
{
    public string UserName { get; set; }

    public string Password { get; set; }
}