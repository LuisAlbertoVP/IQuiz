using System;
using System.Text.Json;
using System.Collections.Generic;


namespace IdentityService.Models.DTO
{
    public class User
    {
        public string Id { get; set; }

        public string Cedula { get; set; }
        
        public string Nombres { get; set; }

        public string CorreoInstitucional { get; set; }

        public string CorreoPersonal { get; set; }

        public string Clave { get; set; }

        public int Estado { get; set; }

        public string UsuarioIngreso { get; set; }

        public DateTime? FechaIngreso { get; set; }

        public string UsuarioModificacion { get; set; }

        public DateTime? FechaModificacion { get; set; }

        public Rol Rol { get; set; }

        public List<string> Cursos { get; set; }

        public string ToJSON() {
            var serializeOptions = new JsonSerializerOptions {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            return JsonSerializer.Serialize(this, serializeOptions);
        }
    }
}
