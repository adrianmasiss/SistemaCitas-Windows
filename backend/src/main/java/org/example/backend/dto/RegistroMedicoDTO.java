package org.example.backend.dto;

public class RegistroMedicoDTO {
    private String nombre;
    private String username;
    private String clave;
    private String especialidad;
    private Double costoConsulta;
    private String localidad;
    private String foto;
    private String presentacion;
    private String diaInicioTrabajo;   // Ejemplo: "LUNES"
    private String diaFinTrabajo;      // Ejemplo: "VIERNES"
    private String horaInicioTrabajo;  // Ejemplo: "08:00"
    private String horaFinTrabajo;     // Ejemplo: "12:00"
    private Integer frecuencia;        // Ejemplo: 30

    // Getters y setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    public Double getCostoConsulta() { return costoConsulta; }
    public void setCostoConsulta(Double costoConsulta) { this.costoConsulta = costoConsulta; }
    public String getLocalidad() { return localidad; }
    public void setLocalidad(String localidad) { this.localidad = localidad; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public String getPresentacion() { return presentacion; }
    public void setPresentacion(String presentacion) { this.presentacion = presentacion; }
    public String getDiaInicioTrabajo() { return diaInicioTrabajo; }
    public void setDiaInicioTrabajo(String diaInicioTrabajo) { this.diaInicioTrabajo = diaInicioTrabajo; }
    public String getDiaFinTrabajo() { return diaFinTrabajo; }
    public void setDiaFinTrabajo(String diaFinTrabajo) { this.diaFinTrabajo = diaFinTrabajo; }
    public String getHoraInicioTrabajo() { return horaInicioTrabajo; }
    public void setHoraInicioTrabajo(String horaInicioTrabajo) { this.horaInicioTrabajo = horaInicioTrabajo; }
    public String getHoraFinTrabajo() { return horaFinTrabajo; }
    public void setHoraFinTrabajo(String horaFinTrabajo) { this.horaFinTrabajo = horaFinTrabajo; }
    public Integer getFrecuencia() { return frecuencia; }
    public void setFrecuencia(Integer frecuencia) { this.frecuencia = frecuencia; }
}
