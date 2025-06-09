package org.example.backend.controller;

import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class HomeController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/home")
    public Map<String, Object> homeInfo(Principal principal) {
        Map<String, Object> response = new HashMap<>();

        if (principal == null) {
            response.put("error", "No autenticado");
            response.put("redirect", "/login");
            return response;
        }

        String username = principal.getName();
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorUsername(username);

        if (usuarioOpt.isEmpty()) {
            response.put("error", "Usuario no encontrado");
            response.put("redirect", "/login?error");
            return response;
        }

        Usuario usuario = usuarioOpt.get();
        String rol = usuario.getRol().toUpperCase().trim();

        response.put("username", usuario.getUsername());
        response.put("rol", rol);

        switch (rol) {
            case "ADMIN":
                response.put("redirect", "/admin/medicosPendientes");
                break;
            case "MEDICO":
                if (!usuario.getAprobado()) {
                    response.put("error", "Médico no aprobado");
                    response.put("redirect", "/login?noAprobado");
                    return response;
                }
                response.put("primerIngreso", usuario.getPrimerIngreso());
                if (usuario.getPrimerIngreso()) {
                    response.put("redirect", "/medico/perfil");
                } else {
                    response.put("redirect", "/medico/gestionCitas");
                }
                break;
            case "PACIENTE":
                response.put("redirect", "/buscarCita");
                break;
            default:
                response.put("error", "Rol desconocido");
                response.put("redirect", "/login?error");
        }

        return response;
    }
}
