package org.example.backend.dto;

public class RegistroPacienteDTO {
    private String nombre;
    private String username;
    private String clave;
    private String confirmClave;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }

    public String getConfirmClave() { return confirmClave; }
    public void setConfirmClave(String confirmClave) { this.confirmClave = confirmClave; }
}
