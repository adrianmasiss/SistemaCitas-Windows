package org.example.backend.controller;

import org.example.backend.entidad.Cita;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.CitaService;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    @Autowired
    private CitaService citaService;
    @Autowired
    private UsuarioService usuarioService;

    // Agendar (crear) una nueva cita
    @PostMapping("/agendar")
    public ResponseEntity<?> agendar(@RequestBody Cita cita) {
        citaService.agendarCita(cita);
        return ResponseEntity.ok(Map.of("mensaje", "Cita agendada"));
    }

    // Listar citas por médico
    @GetMapping("/medico/{medicoId}")
    public List<Cita> citasPorMedico(@PathVariable Long medicoId) {
        Usuario medico = usuarioService.buscarPorId(medicoId).orElse(null);
        return citaService.listarCitasPorMedico(medico);
    }

    // Listar citas por paciente
    @GetMapping("/paciente/{pacienteId}")
    public List<Cita> citasPorPaciente(@PathVariable Long pacienteId) {
        Usuario paciente = usuarioService.buscarPorId(pacienteId).orElse(null);
        return citaService.listarCitasPorPaciente(paciente);
    }
}
