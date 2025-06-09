package org.example.backend.repositorio;

import org.example.backend.entidad.Horario;
import org.example.backend.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByMedico(Usuario medico);
}
