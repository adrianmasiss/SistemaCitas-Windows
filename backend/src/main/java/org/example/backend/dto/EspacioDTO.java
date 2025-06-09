package org.example.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class EspacioDTO {
    private LocalDate fecha;
    private LocalTime hora;
    private boolean disponible;

    // Constructores
    public EspacioDTO() {}

    public EspacioDTO(LocalDate fecha, LocalTime hora, boolean disponible) {
        this.fecha = fecha;
        this.hora = hora;
        this.disponible = disponible;
    }

    // Getters y Setters
    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }
    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public boolean isDisponible() {
        return disponible;
    }
    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    // Utilidad: Para armar el enlace en React
    public String getFechaHoraFormateada() {
        LocalDateTime fechaHora = LocalDateTime.of(fecha, hora);
        return fechaHora.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
    }
}
