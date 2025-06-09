package org.example.backend.controller;

import org.example.backend.entidad.Cita;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.CitaService;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico-citas")
public class HistoricoCitasController {

    @Autowired
    private CitaService citaService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/paciente/{pacienteId}")
    public List<Cita> historicoPorPaciente(
            @PathVariable Long pacienteId,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String medico // nombre parcial del médico
    ) {
        Usuario paciente = usuarioService.buscarPorId(pacienteId).orElse(null);
        if (paciente == null) return List.of();
        return citaService.buscarCitasPacienteFiltradas(paciente, estado, medico);
    }
}
