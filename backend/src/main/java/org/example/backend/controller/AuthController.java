package org.example.backend.controller;

import org.example.backend.dto.LoginRequest;
import org.example.backend.dto.LoginResponse;
import org.example.backend.dto.RegistroPacienteDTO;
import org.example.backend.dto.RegistroMedicoDTO;
import org.example.backend.entidad.DiaSemana;
import org.example.backend.entidad.Horario;
import org.example.backend.entidad.Usuario;
import org.example.backend.servicio.HorarioService;
import org.example.backend.servicio.UsuarioService;
import org.example.backend.seguridad.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private HorarioService horarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Usuario usuario = usuarioService.autenticarApi(req.getUsername(), req.getClave());
        if (usuario == null) {
            return usuarioService.buscarPorUsername(req.getUsername())
                    .filter(u -> "MEDICO".equalsIgnoreCase(u.getRol()) && !Boolean.TRUE.equals(u.getAprobado()))
                    .map(u -> ResponseEntity.status(403).body("Médico no aprobado"))
                    .orElseGet(() -> ResponseEntity.status(401).body("Credenciales inválidas"));
        }
        if (Boolean.TRUE.equals(usuario.getSesionActiva())) {
            return ResponseEntity.status(403).body("El usuario ya tiene una sesión activa");
        }
        usuario.setSesionActiva(true);
        usuarioService.actualizarUsuario(usuario);
        String token = jwtUtils.generateToken(usuario.getUsername(), usuario.getRol());
        return ResponseEntity.ok(new LoginResponse(token, usuario.getRol(), usuario.getNombre(), usuario.getId()));
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(name = "Authorization", required = false) String header) {
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtils.validateJwt(token)) {
                String username = jwtUtils.getUsernameFromJwt(token);
                usuarioService.buscarPorUsername(username).ifPresent(u -> {
                    u.setSesionActiva(false);
                    usuarioService.actualizarUsuario(u);
                });
            }
        }
        return ResponseEntity.ok("Sesión cerrada");
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
    public ResponseEntity<?> registrarMedico(@RequestBody RegistroMedicoDTO dto) {
        // Crear el usuario médico
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

        Usuario medicoGuardado = usuarioService.registrarUsuario(usuario);

        // Crear horarios iniciales según los datos del DTO
        try {
            DiaSemana inicio = DiaSemana.valueOf(dto.getDiaInicioTrabajo());
            DiaSemana fin = DiaSemana.valueOf(dto.getDiaFinTrabajo());
            LocalTime horaInicio = LocalTime.parse(dto.getHoraInicioTrabajo());
            LocalTime horaFin = LocalTime.parse(dto.getHoraFinTrabajo());
            Integer frecuencia = dto.getFrecuencia();

            List<DiaSemana> dias = obtenerDiasLaborales(inicio, fin);
            for (DiaSemana dia : dias) {
                Horario h = new Horario(
                        dia.name(),      // pasa el nombre del enum como String ("LUNES", etc.)
                        horaInicio,
                        horaFin,
                        frecuencia,
                        medicoGuardado
                );
                horarioService.crearHorario(h);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear los horarios del médico: " + e.getMessage());
        }

        return ResponseEntity.ok("Registro exitoso");
    }

    // Método auxiliar para calcular el rango de días
    private List<DiaSemana> obtenerDiasLaborales(DiaSemana inicio, DiaSemana fin) {
        DiaSemana[] dias = DiaSemana.values();
        List<DiaSemana> resultado = new ArrayList<>();
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
