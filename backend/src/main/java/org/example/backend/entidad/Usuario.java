package org.example.backend.entidad;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
public class Usuario implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Boolean getAprobado() {
        return aprobado;
    }

    public void setAprobado(Boolean aprobado) {
        this.aprobado = aprobado;
    }

    public Boolean getPrimerIngreso() {
        return primerIngreso;
    }

    public void setPrimerIngreso(Boolean primerIngreso) {
        this.primerIngreso = primerIngreso;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public Double getCostoConsulta() {
        return costoConsulta;
    }

    public void setCostoConsulta(Double costoConsulta) {
        this.costoConsulta = costoConsulta;
    }

    public String getLocalidad() {
        return localidad;
    }

    public void setLocalidad(String localidad) {
        this.localidad = localidad;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getPresentacion() {
        return presentacion;
    }

    public void setPresentacion(String presentacion) {
        this.presentacion = presentacion;
    }

    public String getDiaInicioTrabajo() {
        return diaInicioTrabajo;
    }

    public void setDiaInicioTrabajo(String diaInicioTrabajo) {
        this.diaInicioTrabajo = diaInicioTrabajo;
    }

    public String getDiaFinTrabajo() {
        return diaFinTrabajo;
    }

    public void setDiaFinTrabajo(String diaFinTrabajo) {
        this.diaFinTrabajo = diaFinTrabajo;
    }

    private String nombre;
    private String clave;
    private String rol;
    private Boolean aprobado;
    private Boolean primerIngreso;

    // Para médicos
    private String especialidad;
    private Double costoConsulta;
    private String localidad;
    private String foto;
    private String presentacion;

    // Opcional: días de trabajo (puedes ajustar según tu modelo)
    private String diaInicioTrabajo;
    private String diaFinTrabajo;

    public Usuario() {}

    // Getters y Setters
    // (Usa tu IDE para generarlos)
    // ... omitido aquí por espacio ...
}
