// backend/src/main/java/org/example/backend/controller/HorarioController.java
package org.example.backend.controller;

import org.example.backend.dto.HorarioDTO;
import org.example.backend.entidad.Horario;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.HorarioService;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;

@RestController
@RequestMapping("/api/horarios")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody HorarioDTO dto) {
        Usuario medico = usuarioService.buscarPorId(dto.getMedicoId()).orElse(null);
        if (medico == null) return ResponseEntity.badRequest().body("Médico no encontrado");
        try {
            Horario horario = new Horario();
            horario.setMedico(medico);
            horario.setDiaSemana(dto.getDiaSemana());
            horario.setHoraInicio(LocalTime.parse(dto.getHoraInicio()));
            horario.setHoraFin(LocalTime.parse(dto.getHoraFin()));
            horario.setFrecuencia(dto.getFrecuencia());
            horarioService.crearHorario(horario);
            return ResponseEntity.ok("Horario creado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear horario: " + e.getMessage());
        }
    }
}
