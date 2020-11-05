using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using IdentityService.Models.DAO;
using IdentityService.Models.DTO;


namespace IdentityService.Controllers
{
    [ApiController]
    [Route("identity")]
    public class IdentityController : ControllerBase
    {
        private readonly IConfiguration _cfg;
        private readonly UserDAO _userDao;

        public IdentityController(IConfiguration cfg, UserDAO userDao) {
            _cfg = cfg;
            _userDao = userDao;
        }

        [Route("crear")]
        [HttpPost]
        public IActionResult AddCuenta([FromBody] User user) {
            var result = _userDao.AddCuenta(user);
            if(result) 
                return Ok();
            return BadRequest();
        }

        [Route("update")]
        [HttpPost]
        public IActionResult UpdatePassword([FromBody] User user) {
            var result = _userDao.UpdatePassword(user);
            if(result) 
                return Ok();
            return BadRequest();
        }

        [Route("login")]
        [HttpPost]
        public IActionResult Login([FromBody] User user) {
            user = _userDao.Login(user);
            if(user.Estado == 1) {
                return CreateToken(user);
            } else if(user.Estado == -1) {
                return Unauthorized("Las credenciales son incorrectas");
            } else {
                return Unauthorized("La cuenta ha sido desactivada");
            }
        }

        public IActionResult CreateToken(User user) {
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, (user.Id + user.Cedula)),
                new Claim(JwtRegisteredClaimNames.Jti, System.Guid.NewGuid().ToString()),
                new Claim("Id", user.Id),
                new Claim("Nombres", user.Nombres),
                new Claim("Rol", user.Rol.Descripcion)
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_cfg["Tokens:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var result = new JwtSecurityToken(_cfg["Tokens:Issuer"], _cfg["Tokens:Audience"], claims, 
                notBefore: DateTime.UtcNow ,expires: DateTime.UtcNow.AddHours(5), signingCredentials: credentials);
            var results = new {
                id = user.Id,
                nombres = user.Nombres,
                token = new {
                    id =  new JwtSecurityTokenHandler().WriteToken(result),
                    expiration = result.ValidTo
                },
                rol = new {
                    descripcion = user.Rol.Descripcion
                }
            };
            return Ok(results);
        } 
    }
}
