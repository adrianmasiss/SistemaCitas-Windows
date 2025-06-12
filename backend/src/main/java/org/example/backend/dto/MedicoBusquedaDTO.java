package org.example.backend.dto;

import org.example.backend.entidad.Usuario;

public class MedicoBusquedaDTO {
    private Long id;
    private String nombre;
    private String especialidad;
    private Double costoConsulta;
    private String localidad;
    private String foto;

    public MedicoBusquedaDTO() {
    }

    public MedicoBusquedaDTO(Usuario medico) {
        if (medico != null) {
            this.id = medico.getId();
            this.nombre = medico.getNombre();
            this.especialidad = medico.getEspecialidad();
            this.costoConsulta = medico.getCostoConsulta();
            this.localidad = medico.getLocalidad();
            this.foto = medico.getFoto();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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
}