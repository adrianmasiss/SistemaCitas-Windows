package org.example.backend.dto;

import org.example.backend.entidad.Usuario;

public class MedicoAdminDTO {
    private Long id;
    private String nombre;
    private String especialidad;
    private Boolean aprobado;

    public MedicoAdminDTO() {}

    public MedicoAdminDTO(Usuario medico) {
        if (medico != null) {
            this.id = medico.getId();
            this.nombre = medico.getNombre();
            this.especialidad = medico.getEspecialidad();
            this.aprobado = medico.getAprobado();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    public Boolean getAprobado() { return aprobado; }
    public void setAprobado(Boolean aprobado) { this.aprobado = aprobado; }
}