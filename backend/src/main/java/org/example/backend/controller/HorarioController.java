package org.example.backend.controller;

import org.example.backend.dto.EspacioDTO;
import org.example.backend.entidad.Horario;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.HorarioService;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/horarios")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/medico/{medicoId}")
    public List<Horario> listar(@PathVariable Long medicoId) {
        Usuario medico = usuarioService.buscarPorId(medicoId).orElse(null);
        return horarioService.listarHorariosPorMedico(medico);
    }
    // Devuelve los espacios disponibles para los próximos "dias" del médico
    @GetMapping("/medico/{medicoId}/espacios")
    public List<EspacioDTO> espaciosDisponibles(
            @PathVariable Long medicoId,
            @RequestParam(defaultValue = "3") int dias) {
        if (dias < 1) dias = 1;
        if (dias > 30) dias = 30;
        Usuario medico = usuarioService.buscarPorId(medicoId).orElse(null);
        return horarioService.calcularNdias(medico, LocalDate.now().plusDays(1), dias);
    }
    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody Horario horario) {
        horarioService.crearHorario(horario);
        return ResponseEntity.ok("Horario creado");
    }
}
