package org.example.backend.servicio;

import org.example.backend.entidad.Cita;
import org.example.backend.entidad.Usuario;
import org.example.backend.repositorio.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepository;

    // Agendar (crear) una nueva cita
    public Cita agendarCita(Cita cita) {
        return citaRepository.save(cita);
    }

    // Actualizar cita (estado, anotaciones, etc)
    public Cita actualizarCita(Cita cita) {
        return citaRepository.save(cita);
    }

    public Optional<Cita> obtenerCitaPorId(Long id) {
        return citaRepository.findById(id);
    }

    public List<Cita> listarCitasPorMedico(Usuario medico) {
        return citaRepository.findByMedicoOrderByFechaHoraDesc(medico);
    }

    public List<Cita> listarCitasPorPaciente(Usuario paciente) {
        return citaRepository.findByPacienteOrderByFechaHoraDesc(paciente);
    }

    // Verifica si el paciente ya tiene una cita ese día/hora
    public boolean pacienteYaTieneCitaEnEseMomento(Usuario paciente, LocalDateTime fechaHora) {
        return citaRepository.findByPacienteOrderByFechaHoraDesc(paciente).stream()
                .anyMatch(c -> c.getFechaHora().equals(fechaHora));
    }

    // Busca citas del paciente con filtros (estado, médico)
    public List<Cita> buscarCitasPacienteFiltradas(Usuario paciente, String estado, String nombreMedico) {
        return citaRepository.findByPacienteOrderByFechaHoraDesc(paciente).stream()
                .filter(c -> estado == null || estado.isEmpty() || c.getEstado().equalsIgnoreCase(estado))
                .filter(c -> nombreMedico == null || nombreMedico.isEmpty()
                        || (c.getMedico() != null && c.getMedico().getNombre().toLowerCase().contains(nombreMedico.toLowerCase())))
                .toList();
    }

    public List<Cita> buscarCitasMedicoFiltradas(Usuario medico, String estado, String nombrePaciente) {
        return citaRepository.findByMedicoOrderByFechaHoraDesc(medico).stream()
                .filter(c -> estado == null || estado.isEmpty() || c.getEstado().equalsIgnoreCase(estado))
                .filter(c -> nombrePaciente == null || nombrePaciente.isEmpty()
                        || (c.getPaciente() != null && c.getPaciente().getNombre().toLowerCase().contains(nombrePaciente.toLowerCase())))
                .toList();
    }
}
