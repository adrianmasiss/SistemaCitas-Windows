package org.example.backend.controller;

import org.example.backend.entidad.Cita;
import org.example.backend.servicio.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citas")
public class CompletarCitaController {

    @Autowired
    private CitaService citaService;

    @PutMapping("/completar/{citaId}")
    public ResponseEntity<?> completarCita(
            @PathVariable Long citaId,
            @RequestParam(required = false) String anotaciones
    ) {
        Cita cita = citaService.obtenerCitaPorId(citaId).orElse(null);
        if (cita == null) return ResponseEntity.notFound().build();

        cita.setEstado("ATENDIDA");
        if (anotaciones != null && !anotaciones.trim().isEmpty()) {
            cita.setAnotaciones(anotaciones);
        }

        citaService.actualizarCita(cita);
        return ResponseEntity.ok("Cita completada");
    }
}
