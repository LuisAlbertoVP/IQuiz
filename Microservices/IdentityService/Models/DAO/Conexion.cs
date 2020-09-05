using System;
using MySql.Data.MySqlClient;


namespace IdentityService.Models.DAO
{
    public class Conexion
    {
        private static Conexion instance;
        private readonly MySqlConnection _cnn;

        private Conexion() {
            var url = "server=localhost;port=3306;database=dbIdentity;user=lavp;password=tesis2020";
            _cnn = new MySqlConnection(url);
            try {
                _cnn.Open();
            } catch(Exception) {
                _cnn.Close();
            }
        }

        public static Conexion GetInstance() {
            if (instance == null)
                instance = new Conexion();
            return instance;
        }

        public MySqlConnection GetConnection() {
            return _cnn;
        }
    }
}
