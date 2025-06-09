package org.example.backend.controller;

import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/{usuarioId}")
    public ResponseEntity<Usuario> obtenerPerfil(@PathVariable Long usuarioId) {
        return usuarioService.buscarPorId(usuarioId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{usuarioId}")
    public ResponseEntity<?> actualizarPerfil(@PathVariable Long usuarioId, @RequestBody Usuario datosActualizados) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId).orElse(null);
        if (usuario == null) return ResponseEntity.notFound().build();

        usuario.setNombre(datosActualizados.getNombre());
        usuario.setEspecialidad(datosActualizados.getEspecialidad());
        usuario.setCostoConsulta(datosActualizados.getCostoConsulta());
        usuario.setLocalidad(datosActualizados.getLocalidad());
        usuario.setFoto(datosActualizados.getFoto());
        usuario.setPresentacion(datosActualizados.getPresentacion());
        usuarioService.actualizarUsuario(usuario);

        return ResponseEntity.ok("Perfil actualizado correctamente");
    }
}
