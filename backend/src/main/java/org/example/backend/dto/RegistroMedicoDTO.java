package org.example.backend.dto;

import java.time.LocalTime;

public class RegistroMedicoDTO {
    private String nombre;
    private String username;
    private String clave;
    private String confirmClave;
    private String especialidad;
    private Double costoConsulta;
    private String localidad;
    private String foto;
    private String presentacion;
    private String diaInicioTrabajo; // Usa String para facilitar paso por JSON
    private String diaFinTrabajo;    // Usa String para facilitar paso por JSON
    private LocalTime horaInicioTrabajo;
    private LocalTime horaFinTrabajo;
    private int frecuencia;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }

    public String getConfirmClave() { return confirmClave; }
    public void setConfirmClave(String confirmClave) { this.confirmClave = confirmClave; }

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

    public LocalTime getHoraInicioTrabajo() { return horaInicioTrabajo; }
    public void setHoraInicioTrabajo(LocalTime horaInicioTrabajo) { this.horaInicioTrabajo = horaInicioTrabajo; }

    public LocalTime getHoraFinTrabajo() { return horaFinTrabajo; }
    public void setHoraFinTrabajo(LocalTime horaFinTrabajo) { this.horaFinTrabajo = horaFinTrabajo; }

    public int getFrecuencia() { return frecuencia; }
    public void setFrecuencia(int frecuencia) { this.frecuencia = frecuencia; }
}
