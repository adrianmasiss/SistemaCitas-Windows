// backend/src/main/java/org/example/backend/dto/HorarioDTO.java
package org.example.backend.dto;

public class HorarioDTO {
    private String diaSemana;        // "LUNES", "MARTES", ...
    private String horaInicio;       // "08:00"
    private String horaFin;          // "12:00"
    private int frecuencia;          // En minutos
    private Long medicoId;           // ID del médico

    // Getters y Setters
    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }
    public String getHoraInicio() { return horaInicio; }
    public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }
    public String getHoraFin() { return horaFin; }
    public void setHoraFin(String horaFin) { this.horaFin = horaFin; }
    public int getFrecuencia() { return frecuencia; }
    public void setFrecuencia(int frecuencia) { this.frecuencia = frecuencia; }
    public Long getMedicoId() { return medicoId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }
}
