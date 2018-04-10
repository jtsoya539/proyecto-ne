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

@WebServlet(name = "Logout", urlPatterns = {"/Logout"})
public class Logout extends HttpServlet {

    BaseDatos db;
    int errorCode;
    String message;

    public Logout() {
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

        String responsePage;
        this.errorCode = 0;
        this.message = null;

        String mensaje = null;

        try {
            db.conectar("ne", "ruffus");
            mensaje = db.ejecutarFuncionClob("k_aplicacion_web.f_mensaje('Sesion cerrada')");
            db.cerrar();
        } catch (SQLException ex) {
            errorCode = ex.getErrorCode();
            message = ex.getMessage();
            System.out.println("SQLException: " + errorCode + ' ' + message);
        }

        HttpSession sesion = request.getSession(false);
        if (sesion != null) {
            sesion.invalidate();
        }

        // Eliminar cookie
        Cookie cookie = new Cookie("usuario", null);
        cookie.setPath("/ProyectoNE");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        try (PrintWriter out = response.getWriter()) {
            responsePage = "index.html";
            RequestDispatcher rd = request.getRequestDispatcher(responsePage);
            rd.include(request, response);
            if (mensaje != null) {
                out.println(mensaje);
            }
            out.close();
        }

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
