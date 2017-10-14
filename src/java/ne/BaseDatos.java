package ne;

import java.sql.Blob;
import java.sql.CallableStatement;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;

/**
 *
 * @author JMEZA
 */
public class BaseDatos {

    public Connection connection;
    private Statement statement;
    private ResultSet resultSet;
    public static final String URL_BASE_DATOS = "jdbc:oracle:thin:@127.0.0.1:1521:XE";
    // jdbc:oracle:thin:@hostname:portNumber:databaseName

    public BaseDatos() {
        this.statement = null;
        this.resultSet = null;
    }

    public void conectar(String username, String password) throws SQLException {
        if (connection == null) {
            DriverManager.registerDriver(new oracle.jdbc.OracleDriver());
        }
        connection = DriverManager.getConnection(URL_BASE_DATOS, username, password);
        System.out.println("Conectado a Base de Datos " + connection.getMetaData().getDatabaseProductName() + ": " + connection.getMetaData().getURL());
    }

    public void conectar(String username, String password, String url) throws SQLException {
        if (connection == null) {
            DriverManager.registerDriver(new oracle.jdbc.OracleDriver());
        }
        connection = DriverManager.getConnection(url, username, password);
        System.out.println("Conectado a Base de Datos " + connection.getMetaData().getDatabaseProductName() + ": " + connection.getMetaData().getURL());
    }

    public void desconectar() throws SQLException {
        if (connection != null) {
            connection.close();
        }
        System.out.println("Desconectado");
    }

    public void cerrar() throws SQLException {
        if (statement != null) {
            statement.close();
        }
        if (resultSet != null) {
            resultSet.close();
        }
        if (connection != null) {
            connection.close();
        }
        System.out.println("Cerrado");
    }

    public boolean conectado() throws SQLException {
        if (connection == null) {
            return false;
        } else {
            return !connection.isClosed();
        }
    }

    public int cantidadRegistros(String tabla, String condicion) throws SQLException {
        int resultado = 0;
        String sql;
        sql = "SELECT COUNT(*) CANTIDAD FROM " + tabla + " WHERE " + condicion;
        statement = connection.createStatement();
        resultSet = statement.executeQuery(sql);
        String nombreColumna = resultSet.getMetaData().getColumnName(1);
        while (resultSet.next()) {
            resultado = resultSet.getInt(1);
        }
        statement.close();
        resultSet.close();
        return resultado;
    }

    public String[] consultarPrimerRegitro(String sql) throws SQLException {
        statement = connection.createStatement();
        resultSet = statement.executeQuery(sql);
        String nombreColumna = resultSet.getMetaData().getColumnName(1);
        int cantidadColumnas = resultSet.getMetaData().getColumnCount();
        String[] resultado = new String[cantidadColumnas];
        while (resultSet.next()) {
            for (int columna = 0; columna < cantidadColumnas; columna++) {
                resultado[columna] = resultSet.getString(columna + 1);
            }
            break;
        }
        statement.close();
        resultSet.close();
        return resultado;
    }

    public Object[][] ejecutarConsultaObject(String sql) throws SQLException {
        int fila = 0;
        statement = connection.createStatement();
        resultSet = statement.executeQuery(sql);
        String nombreColumna = resultSet.getMetaData().getColumnName(1);
        int cantidadColumnas = resultSet.getMetaData().getColumnCount();
        Object[][] resultado = new Object[300][cantidadColumnas];
        while (resultSet.next()) {
            for (int columna = 0; columna < cantidadColumnas; columna++) {
                resultado[fila][columna] = resultSet.getString(columna + 1);
            }
            fila++;
        }
        statement.close();
        resultSet.close();
        return resultado;
    }

    public Clob ejecutarConsultaClob(String sql) throws SQLException {
        Clob resultado = null;
        statement = connection.createStatement();
        resultSet = statement.executeQuery(sql);
        while (resultSet.next()) {
            resultado = resultSet.getClob(1);
        }
        statement.close();
        resultSet.close();
        return resultado;
    }

    public byte[] ejecutarConsultaBlob(String sql) throws SQLException {
        byte[] resultado = null;
        Blob blob;
        statement = connection.createStatement();
        resultSet = statement.executeQuery(sql);
        int blobLength;
        while (resultSet.next()) {
            blob = resultSet.getBlob(1);
            blobLength = (int) blob.length();
            resultado = blob.getBytes(1, blobLength);
            break;
        }
        return resultado;
    }

    public boolean ejecutarDML(String sql) throws SQLException {
        statement = connection.createStatement();
        int cantidadFilas = statement.executeUpdate(sql);
        statement.close();
        System.out.println("ejecutarDML: " + sql);
        return true;
    }

    public String ejecutarFuncionString(String sql) throws SQLException {
        String resultado;
        String call = "{? = call " + sql + "}";
        CallableStatement cs = connection.prepareCall(call, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
        cs.registerOutParameter(1, Types.VARCHAR);
        cs.execute();
        resultado = cs.getString(1);
        cs.close();
        // connection.commit();
        System.out.println("ejecutarFuncionString: " + sql);
        return resultado;
    }

    public String ejecutarFuncionClob(String sql) throws SQLException {
        Clob resultado;
        String call = "{? = call " + sql + "}";
        CallableStatement cs = connection.prepareCall(call, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
        cs.registerOutParameter(1, Types.CLOB);
        cs.execute();
        resultado = cs.getClob(1);
        cs.close();
        // connection.commit();
        System.out.println("ejecutarFuncionClob: " + sql);
        return resultado.getSubString(1, (int) resultado.length());
    }

    public void ejecutarProcedimiento(String sql) throws SQLException {
        String call = "{call " + sql + "}";
        CallableStatement cs = connection.prepareCall(call, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
        cs.execute();
        cs.close();
        // connection.commit();
        System.out.println("ejecutarProcedimiento: " + sql);
    }

    // ======================================================================================
    public Connection getConnection() {
        return connection;
    }

    public Connection getConnection(String username, String password) throws SQLException {
        if (connection == null) {
            DriverManager.registerDriver(new oracle.jdbc.OracleDriver());
            connection = DriverManager.getConnection(URL_BASE_DATOS, username, password);
            System.out.println("Conectado a Base de Datos " + connection.getMetaData().getDatabaseProductName() + ": " + connection.getMetaData().getURL());
        }
        return connection;
    }

    public void setConnection(Connection connection) {
        this.connection = connection;
    }

    public Statement getStatement() {
        return statement;
    }

    public void setStatement(Statement statement) {
        this.statement = statement;
    }

    public ResultSet getResultSet() {
        return resultSet;
    }

    public ResultSet getResultSet(String sql) throws SQLException {
        statement = connection.createStatement();
        resultSet = statement.executeQuery(sql);
        statement.close();
        return resultSet;
    }

    public void setResultSet(ResultSet resultSet) {
        this.resultSet = resultSet;
    }
    // ======================================================================================

}
