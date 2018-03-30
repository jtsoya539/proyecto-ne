package ne;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.RequestDispatcher;
//import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
//import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
//import javax.servlet.http.HttpSession;

@WebServlet(name = "ConfirmAccount", urlPatterns = {"/ConfirmAccount"})
public class ConfirmAccount extends HttpServlet {

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
        response.setContentType("text/html");
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
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);

        // Obtener parametros
        System.out.println("obtengo el token");
        String token = request.getParameter("t");

        BaseDatos db = new BaseDatos();
        String resultado = null;

        try {
            db.conectar("ne", "ruffus");
            resultado = db.ejecutarFuncionString("f_activa_usuario('" + token + "')");
            db.cerrar();
        } catch (SQLException ex) {
            resultado = ex.getMessage();
        }

        /*try {
            db.conectar("ne", "ruffus");
            db.ejecutarProcedimiento("k_sistema.p_set_usuario('" + usuario + "')");
            menu = db.ejecutarFuncionClob("k_aplicacion_web.f_menu('WEB')");
            db.cerrar();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }*/

        /*HttpSession sesion = request.getSession();
        sesion.setAttribute("usuario", usuario);
        sesion.setAttribute("clave", clave);
        sesion.setMaxInactiveInterval(60 * 15); // 15 minutos

        // Agregar cookie
        Cookie cookie = new Cookie("usuario", usuario);
        cookie.setPath("/ProyectoNE");
        cookie.setMaxAge(60 * 60); // 60 minutos
        response.addCookie(cookie);*/

        if (resultado != null) {

            System.out.println("Retorno el resultado"+resultado);
            try (PrintWriter out = response.getWriter()) {
                RequestDispatcher rd = request.getRequestDispatcher("index.html");
                rd.include(request, response);

                out.println(resultado);
                out.close();
            }

        }

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
