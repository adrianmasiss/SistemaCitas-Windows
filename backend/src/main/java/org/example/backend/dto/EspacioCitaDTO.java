package org.example.backend.dto;

import org.example.backend.entidad.Usuario;

public class EspacioCitaDTO extends EspacioDTO {
    private Long medicoId;
    private String medicoNombre;
    private String especialidad;
    private String localidad;
    private String foto;
    private Double costoConsulta;

    public EspacioCitaDTO() {}

    public EspacioCitaDTO(EspacioDTO base, Usuario medico) {
        super(base.getFecha(), base.getHora(), base.isDisponible());
        this.medicoId = medico.getId();
        this.medicoNombre = medico.getNombre();
        this.especialidad = medico.getEspecialidad();
        this.localidad = medico.getLocalidad();
        this.foto = medico.getFoto();
        this.costoConsulta = medico.getCostoConsulta();
    }

    // Getters y Setters
    public Long getMedicoId() { return medicoId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }

    public String getMedicoNombre() { return medicoNombre; }
    public void setMedicoNombre(String medicoNombre) { this.medicoNombre = medicoNombre; }

    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }

    public String getLocalidad() { return localidad; }
    public void setLocalidad(String localidad) { this.localidad = localidad; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public Double getCostoConsulta() { return costoConsulta; }
    public void setCostoConsulta(Double costoConsulta) { this.costoConsulta = costoConsulta; }
}
