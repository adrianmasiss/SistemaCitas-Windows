package org.example.backend.dto;

public class HorarioRangoDTO {
    private Long medicoId;
    private String diaInicio;   // "LUNES"
    private String diaFin;      // "VIERNES"
    private String horaInicio;  // "08:00"
    private String horaFin;     // "12:00"
    private Integer frecuencia; // minutos

    public Long getMedicoId() { return medicoId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }
    public String getDiaInicio() { return diaInicio; }
    public void setDiaInicio(String diaInicio) { this.diaInicio = diaInicio; }
    public String getDiaFin() { return diaFin; }
    public void setDiaFin(String diaFin) { this.diaFin = diaFin; }
    public String getHoraInicio() { return horaInicio; }
    public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }
    public String getHoraFin() { return horaFin; }
    public void setHoraFin(String horaFin) { this.horaFin = horaFin; }
    public Integer getFrecuencia() { return frecuencia; }
    public void setFrecuencia(Integer frecuencia) { this.frecuencia = frecuencia; }
}