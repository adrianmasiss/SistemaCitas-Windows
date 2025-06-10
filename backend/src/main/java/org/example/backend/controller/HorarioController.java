// backend/src/main/java/org/example/backend/controller/HorarioController.java
package org.example.backend.controller;

import org.example.backend.dto.HorarioDTO;
import org.example.backend.dto.HorarioRangoDTO;
import org.example.backend.entidad.Horario;
import org.example.backend.entidad.DiaSemana;
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

    @GetMapping("/medico/{id}")
    public ResponseEntity<?> listarPorMedico(@PathVariable Long id) {
        Usuario medico = usuarioService.buscarPorId(id).orElse(null);
        if (medico == null) return ResponseEntity.badRequest().body("Médico no encontrado");
        return ResponseEntity.ok(horarioService.listarHorariosPorMedico(medico));
    }

    @PostMapping("/crearPorRango")
    public ResponseEntity<?> crearPorRango(@RequestBody HorarioRangoDTO dto) {
        Usuario medico = usuarioService.buscarPorId(dto.getMedicoId()).orElse(null);
        if (medico == null) return ResponseEntity.badRequest().body("Médico no encontrado");
        try {
            DiaSemana inicio = DiaSemana.valueOf(dto.getDiaInicio());
            DiaSemana fin = DiaSemana.valueOf(dto.getDiaFin());
            LocalTime horaInicio = LocalTime.parse(dto.getHoraInicio());
            LocalTime horaFin = LocalTime.parse(dto.getHoraFin());
            int frecuencia = dto.getFrecuencia();

            for (DiaSemana dia : obtenerDiasLaborales(inicio, fin)) {
                java.util.List<Horario> existentes = horarioService.buscarPorMedicoYDia(medico, dia.name());
                Horario h;
                if (existentes.isEmpty()) {
                    h = new Horario(dia.name(), horaInicio, horaFin, frecuencia, medico);
                } else {
                    h = existentes.get(0);
                    for (int i = 1; i < existentes.size(); i++) {
                        horarioService.eliminarHorario(existentes.get(i).getId());
                    }
                }
                h.setHoraInicio(horaInicio);
                h.setHoraFin(horaFin);
                h.setFrecuencia(frecuencia);
                h.setMedico(medico);
                h.setDiaSemana(dia.name());
                horarioService.crearHorario(h);
            }
            return ResponseEntity.ok("Horarios actualizados");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear horarios: " + e.getMessage());
        }
    }

    private java.util.List<DiaSemana> obtenerDiasLaborales(DiaSemana inicio, DiaSemana fin) {
        DiaSemana[] dias = DiaSemana.values();
        java.util.List<DiaSemana> resultado = new java.util.ArrayList<>();
        int start = inicio.ordinal();
        int end = fin.ordinal();
        int i = start;
        do {
            resultado.add(dias[i]);
            i = (i + 1) % dias.length;
        } while (i != (end + 1) % dias.length);
        return resultado;
    }
}