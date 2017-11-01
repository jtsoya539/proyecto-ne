package ne;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
//import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "GetDatos", urlPatterns = {"/GetDatos"})
public class GetDatos extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
    }

    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);

        //Obtengo datos de la sesion
        HttpSession session = request.getSession();
        String usuario = (String)session.getAttribute("usuario");
        String clave = (String)session.getAttribute("clave");

        // leo el parametro Cliente
        String origen = request.getParameter("ori");
        String parametro = request.getParameter("p");
        // sentencia para tomar los datos de la cuenta y su regimen
        if (parametro == null)
            parametro = "";

        BaseDatos db = new BaseDatos();
        String resultado = null;

        try {
            db.conectar("ne", "ruffus");
            // Agregar --> validar que usuario no sea null. Sesion iniciada
            db.ejecutarProcedimiento("k_sistema.p_set_usuario('" + usuario + "')");
            resultado = db.ejecutarFuncionClob("f_" + origen + "('" + parametro + "')");
            db.cerrar();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }

        // Agregar cookie
        /*Cookie cookie = new Cookie("usuario", usuario);
        cookie.setPath("/ProyectoNE");
        cookie.setMaxAge(60 * 60); // 60 minutos
        response.addCookie(cookie);*/

        if (resultado != null) {

            try (PrintWriter out = response.getWriter()) {
                out.println(resultado);
                out.close();
            }

        }

    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
