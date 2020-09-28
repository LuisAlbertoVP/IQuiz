using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using IdentityService.Models.DAO;
using IdentityService.Models.DTO;


namespace IdentityService.Controllers
{
    [ApiController]
    [Route("identity/usuarios")]
    [Authorize(Policy = "Administradores")]
    public class UserController : ControllerBase
    {
        private readonly UserDAO _userDao;

        public UserController(UserDAO userDao) {
            _userDao = userDao;
        }

        [HttpGet]
        public IActionResult GetUsuarios() {
            var usuarios = _userDao.GetUsuarios();
            if(usuarios.Count > 0)
                return Ok(usuarios);
            return NotFound();
        }

        [HttpGet("{id}")]
        public IActionResult GetUsuario(string id) {
            var user = _userDao.GetUsuario(id);
            if(!string.IsNullOrEmpty(user.Id))
                return Ok(user);
            return NotFound();
        }  

        [HttpPost]
        public IActionResult AddUser(User user) {
            var result = _userDao.AddUser(user);
            if(result) 
                return Ok();
            return BadRequest();
        }      

        [Route("{id}/enabled")]
        [HttpPost]
        public IActionResult Enabled(string id) {
            var result = _userDao.Enabled(id);
            if(result)
                return Ok();
            return BadRequest();
        }

        [Route("{id}/disabled")]
        [HttpPost]
        public IActionResult Disabled(string id) {
            var result = _userDao.Disabled(id);
            if(result)
                return Ok();
            return BadRequest();
        }
    }
}
