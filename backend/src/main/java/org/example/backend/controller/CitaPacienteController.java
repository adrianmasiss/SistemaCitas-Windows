package org.example.backend.controller;

import org.example.backend.entidad.Cita;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.CitaService;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/citas/paciente")
public class CitaPacienteController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private CitaService citaService;

    // Confirmar una cita
    @PostMapping("/confirmar")
    public ResponseEntity<?> confirmarCita(
            @RequestParam Long pacienteId,
            @RequestParam Long medicoId,
            @RequestParam String fechaHora // en formato "yyyy-MM-dd'T'HH:mm"
    ) {
        Usuario paciente = usuarioService.buscarPorId(pacienteId).orElse(null);
        Usuario medico = usuarioService.buscarPorId(medicoId).orElse(null);
        if (paciente == null || medico == null) return ResponseEntity.badRequest().body("Usuario no encontrado");

        LocalDateTime fechaHoraParsed;
        try {
            fechaHoraParsed = LocalDateTime.parse(fechaHora);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Formato de fecha/hora inválido");
        }

        if (citaService.pacienteYaTieneCitaEnEseMomento(paciente, fechaHoraParsed)) {
            return ResponseEntity.badRequest().body("Ya tienes una cita programada para ese momento.");
        }

        Cita cita = new Cita();
        cita.setFechaHora(fechaHoraParsed);
        cita.setEstado("PENDIENTE");
        cita.setMedico(medico);
        cita.setPaciente(paciente);
        citaService.agendarCita(cita);

        return ResponseEntity.ok(cita); // Devuelve la cita creada
    }

    // Ver detalle de una cita
    @GetMapping("/detalle/{citaId}")
    public ResponseEntity<Cita> verDetalleCita(@PathVariable Long citaId) {
        return citaService.obtenerCitaPorId(citaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
