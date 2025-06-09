package org.example.backend.controller;

import org.example.backend.entidad.Cita;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.CitaService;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medico")
public class MedicoGestionController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private CitaService citaService;

    // GET: /api/medico/citas?estado=ATENDIDA&paciente=Juan
    @GetMapping("/citas")
    public ResponseEntity<?> listarCitasMedico(
            Principal principal,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String paciente
    ) {
        if (principal == null) return ResponseEntity.status(401).body("No autenticado");
        String username = principal.getName();
        Usuario medico = usuarioService.buscarPorUsername(username).orElse(null);
        if (medico == null) return ResponseEntity.status(401).body("No autenticado");

        List<Cita> citas = citaService.listarCitasPorMedico(medico);

        // Filtros como en el código bueno
        if (estado != null && !estado.trim().isEmpty()) {
            citas = citas.stream()
                    .filter(c -> c.getEstado() != null && c.getEstado().equalsIgnoreCase(estado))
                    .toList();
        }

        if (paciente != null && !paciente.trim().isEmpty()) {
            citas = citas.stream()
                    .filter(c -> c.getPaciente() != null &&
                            c.getPaciente().getNombre().toLowerCase().contains(paciente.toLowerCase()))
                    .toList();
        }

        return ResponseEntity.ok(citas);
    }

    // POST: /api/medico/completarCita con { "citaId": 123, "anotaciones": "..." }
    @PostMapping("/completarCita")
    public ResponseEntity<?> completarCita(
            @RequestBody Map<String, String> body,
            Principal principal
    ) {
        if (principal == null) return ResponseEntity.status(401).body("No autenticado");
        String username = principal.getName();
        Usuario medico = usuarioService.buscarPorUsername(username).orElse(null);
        if (medico == null) return ResponseEntity.status(401).body("No autenticado");

        Long citaId;
        try {
            citaId = Long.parseLong(body.get("citaId"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("citaId invalido");
        }

        String anotaciones = body.get("anotaciones");
        Cita cita = citaService.obtenerCitaPorId(citaId).orElse(null);
        if (cita == null || cita.getMedico() == null || !cita.getMedico().getId().equals(medico.getId())) {
            return ResponseEntity.status(403).body("No permitido");
        }
        cita.setEstado("ATENDIDA");
        if (anotaciones != null && !anotaciones.trim().isEmpty()) {
            cita.setAnotaciones(anotaciones);
        }
        citaService.actualizarCita(cita);
        return ResponseEntity.ok("Cita completada");
    }
}
