/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mail;

import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 *
 * @author damia_000
 */
public class Email implements Runnable {
    
    private String remitente, clave, destinatario, asunto, cuerpo;

    private void sendEmail() {
        Properties props = new Properties();//System.getProperties();

        // Nombre del host de correo, es smtp.gmail.com
        props.put("mail.smtp.host", "smtp.gmail.com");  //El servidor SMTP de Google

        // TLS si está disponible
        props.put("mail.smtp.starttls.enable", "true"); //Para conectar de manera segura al servidor SMTP

        // Puerto de gmail para envio de correos
        props.put("mail.smtp.port", "587"); //El puerto SMTP seguro de Google

        // Nombre del usuario
        //props.put("mail.smtp.user", remitente);
        //props.put("mail.smtp.clave", "miClaveDeGMail");    //La clave de la cuenta

        // Si requiere o no usuario y password para conectarse.
        props.put("mail.smtp.auth", "true");    //Usar autenticación mediante usuario y clave

        // obtener nuestra instancia de Session
        System.out.println("Trato de conectarme...");
        Session session = Session.getInstance(props,
          new javax.mail.Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(remitente, clave);
                }
          });
        //session.setDebug(true);

        System.out.println("Trato de enviar el correo...");
        try {
            MimeMessage message = new MimeMessage(session);

            // Quien envia el correo
            message.setFrom(new InternetAddress(remitente));
            // A quien va dirigido
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(destinatario));
            //message.addRecipient(Message.RecipientType.TO, new InternetAddress(destinatario));   //Se podrían añadir varios de la misma manera

            message.setSubject(asunto);
            //message.setText(cuerpo);
            message.setText(
            cuerpo,
            "ISO-8859-1",
            "html");

            Transport transport = session.getTransport("smtp");
            transport.connect("smtp.gmail.com", remitente, clave);
            transport.sendMessage(message, message.getAllRecipients());
            transport.close();

            System.out.println("Envio de correo concluido");
        }
        catch (MessagingException me) {
            me.printStackTrace();   //Si se produce un error
        }
    }

    /*
    public static void main(String[] args) {
        Email email = new Email();
        email.setRemitente("");
        email.setClave("");

        email.setDestinatario("xxx@hotmail.com, yyy@gmail.com"); //A quien le quieres escribir. Si es mas de un correo debe ir separado por ',' (coma).
        email.setAsunto("Correo de prueba enviado desde Java");
        email.setCuerpo("<div style=\"color:#000;background-color:#bbb;padding-top:48px;padding-bottom:48px;padding:0.01em 16px;margin-top:16px;margin-bottom:16px\">\n" +
                        "    <div style=\"box-shadow:0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19); max-width:980px;margin:auto; color:#000; background-color:#d2eafd; max-width:600px\">\n" +
                        //"        <img src=\"http://localhost:8080/proyecto-ne/img/cesped.jpg\" style=\"width:100%\">\n" +
                        "        <div  style=\"padding:0.01em 16px;margin-top:16px;margin-bottom:16px;max-width:600px\">\n" +
                        "            <div style=\"text-align:justify\">\n" +
                        "                <h1>Activacion de Cuenta NE</h1>\n" +
                        "                <h3>Hola &NOMBRE_USUARIO,</h3>\n" +
                        "                <p >Por favor confirma tu direccion de correo para activar tu nueva cuenta NE.</p>\n" +
                        "                <p >Solo haz click o toca el boton de abajo.</p>\n" +
                        "                <p >Si no creó esta cuenta, es posible que otra persona haya escrito mal su dirección de correo electrónico.</p>\n" +
                        "                <p >Si la cuenta no es activada, todos los detalles se eliminarán en 28 días y su dirección de correo electrónico nunca será utilizado para correos electrónicos promocionales de NE o cualquiera de sus socios.</p>\n" +
                        "                <p >Saludos,</p>\n" +
                        "                <p >Soporte NE</p>\n" +
                        "                <div style=\"text-align:center; padding:0.01em 16px;margin-top:16px;margin-bottom:16px;\">\n" +
                        "                    <a id=\"confirm\" href=\"http://localhost:8080/proyecto-ne/ConfirmAccount?t=&TOKEN_VALIDACION\" style=\"border:none;display:inline-block;outline:0;padding:8px 16px;vertical-align:middle;overflow:hidden;text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;white-space:nowrap; color:#fff; background-color:#074b83; padding:8px 16px; margin-bottom:16px;\">Activar Cuenta</a>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "        <!-- Footer -->\n" +
                        "        <footer  style=\"text-align:center; color:#fff; background-color:#0b78d1;padding:0.01em 16px;margin-top:16px;margin-bottom:16px;padding-top:32px;padding-bottom:32px;\">\n" +
                        "            <p>Creado por <a href=\"https://twitter.com/jtsoya539\" target=\"_blank\">@jtsoya539</a></p>\n" +
                        "        </footer>\n" +
                        "    </div>\n" +
                        "</div>") ;

        (new Thread(email)).start();
        System.out.println("Proceso concluido");
        //sendEmail(destinatario, asunto, cuerpo);
    }
    */

    @Override
    public void run() {
        this.sendEmail();
    }
    
        public String getRemitente() {
        return remitente;
    }

    public void setRemitente(String remitente) {
        this.remitente = remitente;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(String destinatario) {
        this.destinatario = destinatario;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getCuerpo() {
        return cuerpo;
    }

    public void setCuerpo(String cuerpo) {
        this.cuerpo = cuerpo;
    }

}
