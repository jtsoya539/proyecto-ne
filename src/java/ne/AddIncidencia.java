package ne;

import java.io.BufferedReader;
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

@WebServlet(name = "AddIncidencia", urlPatterns = {"/AddIncidencia"})
public class AddIncidencia extends HttpServlet {

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

        System.out.println("obtengo el JSON del request");
        StringBuffer jb = new StringBuffer();
        String line = null;
        try {
          BufferedReader reader = request.getReader();
          while ((line = reader.readLine()) != null)
            jb.append(line);
        } catch (Exception e) { /*report an error*/ }

        String json = jb.toString();
        System.out.println("JSON --> " + json);
        /*try {
          JSONObject jsonObject =  HTTP.toJSONObject(jb.toString());
        } catch (JSONException e) {
          // crash and burn
          throw new IOException("Error parsing JSON request string");
        } */

        BaseDatos db = new BaseDatos();
        String resultado = null;
        String menu = null;

        try {
            db.conectar("ne", "ruffus");
            resultado = db.ejecutarFuncionString("f_registra_incidencia('" + json + "')");
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

            System.out.println("Retorno el resultado");
            try (PrintWriter out = response.getWriter()) {
                //RequestDispatcher rd = request.getRequestDispatcher("index.html");
                //rd.include(request, response);
                out.println(resultado);
                //out.println(menu);
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
