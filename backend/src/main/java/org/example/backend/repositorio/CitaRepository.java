package org.example.backend.repositorio;

import org.example.backend.entidad.Cita;
import org.example.backend.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    Optional<Cita> findByMedicoAndFechaHora(Usuario medico, LocalDateTime fechaHora);
    List<Cita> findByMedicoOrderByFechaHoraDesc(Usuario medico);
    List<Cita> findByPacienteOrderByFechaHoraDesc(Usuario paciente);
}
