package org.example.backend.servicio;

import org.example.backend.entidad.Usuario;
import org.example.backend.repositorio.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Registrar un usuario (paciente o médico)
    public Usuario registrarUsuario(Usuario usuario) {
        // Si el rol es médico, queda pendiente de aprobación
        if ("MEDICO".equalsIgnoreCase(usuario.getRol())) {
            usuario.setAprobado(false);
        } else {
            usuario.setAprobado(true);
        }
        usuario.setClave(passwordEncoder.encode(usuario.getClave()));
        return usuarioRepository.save(usuario);
    }

    // Actualizar datos de usuario (perfil)
    public Usuario actualizarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Autenticar usuario por username y clave (login)
    public Usuario autenticarApi(String username, String clave) {
        return usuarioRepository.findByUsername(username)
                .filter(u -> passwordEncoder.matches(clave, u.getClave()))
                .orElse(null);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public boolean existeUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    // Buscar todos los médicos, sin importar si están aprobados
    public List<Usuario> buscarTodosLosMedicos() {
        return usuarioRepository.findByRol("MEDICO");
    }

    // Buscar solo los médicos aprobados
    public List<Usuario> buscarTodosLosMedicosAprobados() {
        List<Usuario> medicos = usuarioRepository.findByRol("MEDICO");
        medicos.removeIf(m -> !Boolean.TRUE.equals(m.getAprobado()));
        return medicos;
    }

    // Buscar médicos por filtros
    public List<Usuario> buscarMedicos(String especialidad, String ciudad) {
        List<Usuario> medicos = usuarioRepository.findByRol("MEDICO");
        if (especialidad != null && !especialidad.isEmpty()) {
            medicos.removeIf(m -> m.getEspecialidad() == null ||
                    !m.getEspecialidad().toLowerCase().contains(especialidad.toLowerCase()));
        }
        if (ciudad != null && !ciudad.isEmpty()) {
            medicos.removeIf(m -> m.getLocalidad() == null ||
                    !m.getLocalidad().toLowerCase().contains(ciudad.toLowerCase()));
        }
        medicos.removeIf(m -> !Boolean.TRUE.equals(m.getAprobado()));
        return medicos;
    }

    // Aprobar médico por ID
    public void aprobarMedico(Long medicoId) {
        usuarioRepository.findById(medicoId).ifPresent(medico -> {
            medico.setAprobado(true);
            usuarioRepository.save(medico);
        });
    }
}
