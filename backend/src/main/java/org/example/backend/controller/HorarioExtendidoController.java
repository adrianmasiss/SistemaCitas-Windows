// backend/src/main/java/org/example/backend/controller/HorarioExtendidoController.java

package org.example.backend.controller;

import org.example.backend.dto.EspacioDTO;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.HorarioService;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/horario-extendido")
public class HorarioExtendidoController {

    @Autowired
    private HorarioService horarioService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public Map<String, Object> horarioExtendido(
            @RequestParam Long medicoId,
            @RequestParam(defaultValue = "1") int offset,
            @RequestParam(defaultValue = "7") int dias
    ) {
        if (offset < 1) offset = 1;
        if (dias < 1) dias = 1;
        if (dias > 30) dias = 30;

        Usuario medico = usuarioService.buscarPorId(medicoId).orElse(null);
        Map<String, Object> resp = new HashMap<>();
        if (medico == null) return resp;

        resp.put("medico", medico);

        LocalDate fechaBase = LocalDate.now().plusDays(offset);
        // *** Nuevo método: devuelve todos los días aunque estén vacíos ***
        List<Map<String, Object>> espaciosAgrupados = horarioService.calcularDiasConVacíos(medico, fechaBase, dias);

        resp.put("espaciosAgrupados", espaciosAgrupados);
        return resp;
    }
}
