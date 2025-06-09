package org.example.backend.controller;

import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/medicos")
    public List<Usuario> listarMedicos() {
        return usuarioService.buscarTodosLosMedicos();
    }

    @PostMapping("/aprobar")
    public ResponseEntity<?> aprobarMedico(@RequestParam Long medicoId) {
        usuarioService.aprobarMedico(medicoId);
        return ResponseEntity.ok("Médico aprobado");
    }
}
