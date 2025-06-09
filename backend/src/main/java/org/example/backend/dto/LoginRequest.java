package org.example.backend.dto;

public class LoginRequest {
    private String username;
    private String clave;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }
}
