package org.example.backend.controller;

import org.example.backend.dto.LoginRequest;
import org.example.backend.dto.LoginResponse;
import org.example.backend.dto.RegistroPacienteDTO;
import org.example.backend.dto.RegistroMedicoDTO;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.UsuarioService;
import org.example.backend.seguridad.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Usuario usuario = usuarioService.autenticarApi(req.getUsername(), req.getClave());
        if (usuario == null) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
        String token = jwtUtils.generateToken(usuario.getUsername(), usuario.getRol());
        return ResponseEntity.ok(new LoginResponse(token, usuario.getRol(), usuario.getNombre(), usuario.getId()));
    }

    @PostMapping("/registerPaciente")
    public ResponseEntity<?> registerPaciente(@RequestBody RegistroPacienteDTO dto) {
        if (!dto.getClave().equals(dto.getConfirmClave())) {
            return ResponseEntity.badRequest().body("Las contraseñas no coinciden.");
        }
        if (usuarioService.existeUsername(dto.getUsername())) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya está en uso.");
        }
        Usuario nuevo = new Usuario();
        nuevo.setNombre(dto.getNombre());
        nuevo.setUsername(dto.getUsername());
        nuevo.setClave(dto.getClave());
        nuevo.setRol("PACIENTE");
        nuevo.setAprobado(true);

        usuarioService.registrarUsuario(nuevo);
        return ResponseEntity.ok("Paciente registrado correctamente");
    }

    @PostMapping("/registerMedico")
    public ResponseEntity<?> registerMedico(@RequestBody RegistroMedicoDTO dto) {
        if (!dto.getClave().equals(dto.getConfirmClave())) {
            return ResponseEntity.badRequest().body("Las contraseñas no coinciden.");
        }
        if (usuarioService.existeUsername(dto.getUsername())) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya está en uso.");
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setUsername(dto.getUsername());
        usuario.setClave(dto.getClave());
        usuario.setRol("MEDICO");
        usuario.setAprobado(false);
        usuario.setPrimerIngreso(true);
        usuario.setEspecialidad(dto.getEspecialidad());
        usuario.setCostoConsulta(dto.getCostoConsulta());
        usuario.setLocalidad(dto.getLocalidad());
        usuario.setFoto(dto.getFoto());
        usuario.setPresentacion(dto.getPresentacion());
        usuario.setDiaInicioTrabajo(dto.getDiaInicioTrabajo());
        usuario.setDiaFinTrabajo(dto.getDiaFinTrabajo());

        usuarioService.registrarUsuario(usuario);
        // Puedes crear horarios iniciales aquí si lo deseas
        return ResponseEntity.ok("Médico registrado correctamente. Queda pendiente de aprobación.");
    }
}
