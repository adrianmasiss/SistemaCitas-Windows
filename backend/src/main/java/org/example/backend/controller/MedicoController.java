package org.example.backend.controller;

import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.example.backend.dto.MedicoBusquedaDTO;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/aprobados")
    public List<MedicoBusquedaDTO> listarMedicosAprobados() {
        return usuarioService.buscarTodosLosMedicosAprobados().stream()
                .map(MedicoBusquedaDTO::new)
                .toList();
    }

    // Opcional: buscar con filtros especialidad/ciudad
    @GetMapping("/buscar")
    public List<MedicoBusquedaDTO> buscarMedicos(
            @RequestParam(required = false) String especialidad,
            @RequestParam(required = false) String ciudad) {
        return usuarioService.buscarMedicos(especialidad, ciudad).stream()
                .map(MedicoBusquedaDTO::new)
                .toList();
    }
}
