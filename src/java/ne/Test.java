package ne;

import java.sql.SQLException;

/**
 *
 * @author JMEZA
 */
public class Test {

    public static void main(String[] args) {

        try {

            System.out.println(BaseDatos.URL_BASE_DATOS);

            BaseDatos db = new BaseDatos();
            db.conectar("ne", "ruffus");

            String ejecutarFuncionClob = db.ejecutarFuncionClob("f_menu()");

            System.out.println(ejecutarFuncionClob);

            db.ejecutarProcedimiento("k_sistema.p_set_usuario('jmeza')");
            String ejecutarFuncionString = db.ejecutarFuncionString("k_sistema.f_usuario");

            System.out.println(ejecutarFuncionString);

            db.cerrar();

        } catch (SQLException ex) {
            System.out.println("Excepcion: " + ex.getMessage());
        }
    }

}
