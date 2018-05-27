package ne;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mail.Email;
import org.json.JSONException;
import org.json.JSONObject;

@WebServlet(name = "UpdLeague", urlPatterns = {"/UpdLeague"})
public class UpdLeague extends HttpServlet {

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

        //Obtengo datos de la sesion
        HttpSession session = request.getSession();
        String usuario = (String)session.getAttribute("usuario");
        //String clave = (String)session.getAttribute("clave");

        System.out.println("obtengo el JSON del request");
        StringBuilder jb = new StringBuilder();
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
            db.ejecutarProcedimiento("k_sistema.p_set_usuario('" + usuario + "')");
            resultado = db.ejecutarFuncionString("f_registra_liga('" + json + "')");
            db.cerrar();
        } catch (SQLException ex) {
            resultado = ex.getMessage();
        }

        if (resultado != null) {

            //System.out.println("Retorno el resultado" + resultado);
            JSONObject json1, json2;
            String state = "", message = "", nombre = "", token = "", email = "", liga = "", usuarioAdmin = "";
            
            try {
                //Parsear la respuesta
                json1 = new JSONObject(resultado);
                state = json1.getString("state");
                message = json1.getString("message");
                if(state.equals("OK")) {
                    nombre = json1.getString("nombre");
                    token = json1.getString("token");
                    email = json1.getString("email");
                    liga = json1.getString("idLiga");
                    usuarioAdmin = json1.getString("usuarioAdmin");

                    //Generar una nueva respuesta
                    json2 = new JSONObject();
                    json2.put("state", state);
                    json2.put("message", message);
                    resultado = json2.toString();
                }

            } catch (JSONException ex) {
                Logger.getLogger(Register.class.getName()).log(Level.SEVERE, null, ex);
            }

            if(state.equals("OK")) {
                Properties prop=new Properties();
                prop.load(getServletContext().getResourceAsStream("/WEB-INF/classes/ne.properties"));
                
                String remitente = prop.getProperty("REMITENTE_EMAIL");
                String clave = prop.getProperty("CLAVE_EMAIL");
                String asunto = prop.getProperty("ASUNTO_INVITACION_LIGA");
                String cuerpo = prop.getProperty("EMAIL_INVITACION_LIGA");
                cuerpo = cuerpo.replaceFirst("&NOMBRE_USUARIO", nombre);
                cuerpo = cuerpo.replaceFirst("&TOKEN_VALIDACION", token);
                cuerpo = cuerpo.replaceAll("&ID_LIGA", liga);
                cuerpo = cuerpo.replaceFirst("&USUARIO_ADMIN", usuarioAdmin);

                //Envio de email de invitacion
                Email ema = new Email();
                ema.setRemitente(remitente);
                ema.setClave(clave);

                ema.setDestinatario(email); //A quien le quieres escribir. Si es mas de un correo debe ir separado por ',' (coma).
                ema.setAsunto(asunto);
                ema.setCuerpo(cuerpo);
                
                (new Thread(ema)).start();
            }

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
