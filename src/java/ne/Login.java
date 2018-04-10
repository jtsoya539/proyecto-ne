package ne;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "Login", urlPatterns = {"/Login"})
public class Login extends HttpServlet {

    BaseDatos db;
    int errorCode;
    String message;

    public Login() {
        this.db = new BaseDatos();
    }

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
        response.setContentType("text/html; charset=UTF-8");
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

        String responsePage;
        this.errorCode = 0;
        this.message = null;

        // Obtener parametros
        String usuario = request.getParameter("usuario");
        String clave = request.getParameter("clavemd5");

        String mensaje = null;
        String menu = null;
        //String seleccionJugadores = null;

        try {
            db.conectar("ne", "ruffus");
            mensaje = db.ejecutarFuncionString("f_valida_usuario('" + usuario + "', '" + clave + "')");
            db.cerrar();
        } catch (SQLException ex) {
            errorCode = ex.getErrorCode();
            message = ex.getMessage();
        }

        if (errorCode != 0) {
            try {
                db.conectar("ne", "ruffus");
                mensaje = db.ejecutarFuncionString("k_aplicacion_web.f_mensaje('" + db.limpiarMensajeError(message) + "')");
                db.cerrar();
            } catch (SQLException ex) {
                errorCode = ex.getErrorCode();
                message = ex.getMessage();
                System.out.println("SQLException: " + errorCode + ' ' + message);
            }

        } else {

            try {
                db.conectar("ne", "ruffus");
                db.ejecutarProcedimiento("k_sistema.p_set_usuario('" + usuario + "')");
                menu = db.ejecutarFuncionClob("k_aplicacion_web.f_menu('WEB')");
                //seleccionJugadores = db.ejecutarFuncionClob("k_aplicacion_web.f_seleccion_jugadores('WEB')");
                db.cerrar();
            } catch (SQLException ex) {
                errorCode = ex.getErrorCode();
                message = ex.getMessage();
            }

            if (errorCode != 0) {
                try {
                    db.conectar("ne", "ruffus");
                    mensaje = db.ejecutarFuncionString("k_aplicacion_web.f_mensaje('" + db.limpiarMensajeError(message) + "')");
                    db.cerrar();
                } catch (SQLException ex) {
                    errorCode = ex.getErrorCode();
                    message = ex.getMessage();
                    System.out.println("SQLException: " + errorCode + ' ' + message);
                }

            } else {
                // Agregar sesion
                HttpSession sesion = request.getSession();
                sesion.setAttribute("usuario", usuario);
                sesion.setAttribute("clave", clave);
                sesion.setMaxInactiveInterval(60 * 15); // 15 minutos

                // Agregar cookie
                Cookie cookie = new Cookie("usuario", usuario);
                cookie.setPath("/ProyectoNE");
                cookie.setMaxAge(60 * 60); // 60 minutos
                response.addCookie(cookie);

            }

        }

        try (PrintWriter out = response.getWriter()) {
            if (errorCode != 0) {
                responsePage = "index.html";
            } else {
                responsePage = "base.html";
            }
            RequestDispatcher rd = request.getRequestDispatcher(responsePage);
            rd.include(request, response);
            if (mensaje != null) {
                out.println(mensaje);
            }
            if (menu != null) {
                out.println(menu);
            }
            /*if (seleccionJugadores != null) {
                out.println(seleccionJugadores);
            }*/
            out.close();
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
