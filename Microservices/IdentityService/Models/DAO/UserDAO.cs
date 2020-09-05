using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using IdentityService.Models.DTO;


namespace IdentityService.Models.DAO
{
    public class UserDAO
    {
        private readonly MySqlConnection _cnn;

        public UserDAO() {
            _cnn = Conexion.GetInstance().GetConnection();
        }

        public User Login(User user) {
            user.Estado = -1;
            try { 
                var command = new MySqlCommand("call login(@cedula, @clave)", _cnn);
                command.Parameters.AddWithValue("@cedula", user.Cedula);
                command.Parameters.AddWithValue("@clave", user.Clave);
                using MySqlDataReader oReader = command.ExecuteReader();
                while (oReader.Read()) {
                    user.Id = oReader["id"].ToString();
                    user.Nombres = oReader["nombres"].ToString();
                    user.Estado = int.Parse(oReader["estado"].ToString());
                    user.Rol = new Rol { Descripcion = oReader["descripcion"].ToString() };
                }
                return user;
            } catch (Exception) {
                return user;
            }
        }

        public bool AddUser(User user) {
            try {
                var command = new MySqlCommand("call add_usuario(@json)", _cnn);
                command.Parameters.AddWithValue("@json", user.ToJSON());
                return command.ExecuteNonQuery() > 0;
            } catch (Exception) {
                return false;
            }
        }

        public List<string> GetCursos(string id) {
            var cursos = new List<string>();
            try {
                var command = new MySqlCommand("call usuario_cursos(@id)", _cnn);
                command.Parameters.AddWithValue("@id", id);
                using (var oReader = command.ExecuteReader()) {
                    while (oReader.Read()) {
                        cursos.Add(oReader["curso_id"].ToString());
                    }
                }
                return cursos;
            } catch (Exception) {
                return cursos;
            }
        } 

        public User GetUsuario(string id) {
            var user = new User();
            try {
                var command = new MySqlCommand("call usuario_por_id(@id)", _cnn);
                command.Parameters.AddWithValue("@id", id);
                using (var oReader = command.ExecuteReader()) {
                    while (oReader.Read()) {
                        user.Id = oReader["usuario_id"].ToString();
                        user.Cedula = oReader["cedula"].ToString();
                        user.Nombres = oReader["nombres"].ToString();
                        user.CorreoInstitucional = oReader["correo_institucional"].ToString();
                        user.CorreoPersonal = oReader["correo_personal"].ToString();
                        user.Rol = new Rol { Id = oReader["rol_id"].ToString() };
                    }
                }
                user.Cursos = GetCursos(id);
                return user;
            } catch (Exception) {
                return user;
            }
        }

        public List<User> GetUsuarios() {
            var users = new List<User>();
            try {
                var command = new MySqlCommand("call usuarios()", _cnn);
                using (var oReader = command.ExecuteReader()) {
                    while (oReader.Read()) {
                        var user = new User();
                        user.Id = oReader["id"].ToString();
                        user.Cedula = oReader["cedula"].ToString();
                        user.Nombres = oReader["nombres"].ToString();
                        user.CorreoInstitucional = oReader["correo_institucional"].ToString();
                        user.CorreoPersonal = oReader["correo_personal"].ToString();
                        user.Estado = int.Parse(oReader["estado"].ToString());
                        user.UsuarioIngreso = oReader["usuario_ingreso"].ToString();
                        user.FechaIngreso = Parse(oReader["fecha_ingreso"].ToString());
                        user.UsuarioModificacion = oReader["usuario_modificacion"].ToString();
                        user.FechaModificacion = Parse(oReader["fecha_modificacion"].ToString());
                        user.Rol = new Rol { Descripcion = oReader["descripcion"].ToString() };
                        users.Add(user);
                    }
                }
                return users;
            } catch (Exception) {
                return users;
            }
        }

        public bool Enabled(string id) {
            try {
                var command = new MySqlCommand("call activar_usuario(@id)", _cnn);
                command.Parameters.AddWithValue("@id", id);
                return command.ExecuteNonQuery() > 0;
            } catch (Exception) {
                return false;
            }
        }

        public bool Disabled(string id) {
            try {
                var command = new MySqlCommand("call desactivar_usuario(@id)", _cnn);
                command.Parameters.AddWithValue("@id", id);
                return command.ExecuteNonQuery() > 0;
            } catch (Exception) {
                return false;
            }
        } 

        private DateTime? Parse(string date) {
            if(date.Length > 0)
                return DateTime.Parse(date);
            return null;
        }
    }
}
