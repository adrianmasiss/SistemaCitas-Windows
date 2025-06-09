package org.example.backend.controller;

import org.example.backend.dto.EspacioDTO;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.HorarioService;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import java.time.LocalDate;
import java.util.List;

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
        List<EspacioDTO> espacios = horarioService.calcularNdias(medico, fechaBase, dias);

        var agrupados = espacios.stream()
                .collect(Collectors.groupingBy(e -> e.getFecha().toString()));

        var espaciosAgrupados = agrupados.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("fecha", e.getKey());
                    m.put("slots", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        resp.put("espaciosAgrupados", espaciosAgrupados);
        return resp;
    }
}
