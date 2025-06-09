package org.example.backend.servicio;

import org.example.backend.dto.EspacioDTO;
import org.example.backend.dto.EspacioCitaDTO;
import org.example.backend.entidad.Horario;
import org.example.backend.entidad.Usuario;
import org.example.backend.repositorio.HorarioRepository;
import org.example.backend.repositorio.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;
    @Autowired
    private CitaRepository citaRepository;

    // Calcular espacios disponibles para los próximos N días de un médico
    public List<EspacioDTO> calcularNdias(Usuario medico, LocalDate inicio, int cantidadDias) {
        if (medico == null) return Collections.emptyList();
        List<Horario> horarios = horarioRepository.findByMedico(medico);
        if (horarios == null || horarios.isEmpty()) return Collections.emptyList();
        List<EspacioDTO> espacios = new ArrayList<>();
        for (int i = 0; i < cantidadDias; i++) {
            LocalDate fecha = inicio.plusDays(i);
            String diaSemana = fecha.getDayOfWeek().name(); // Ejemplo: MONDAY
            for (Horario h : horarios) {
                if (!h.getDiaSemana().equalsIgnoreCase(diaSemana)) continue;
                LocalTime horaActual = h.getHoraInicio();
                while (!horaActual.isAfter(h.getHoraFin().minusMinutes(h.getFrecuencia()))) {
                    LocalDateTime fechaHora = LocalDateTime.of(fecha, horaActual);
                    boolean reservado = citaRepository.findByMedicoAndFechaHora(medico, fechaHora).isPresent();
                    espacios.add(new EspacioDTO(fecha, horaActual, !reservado));
                    horaActual = horaActual.plusMinutes(h.getFrecuencia());
                }
            }
        }
        return espacios;
    }

    // Genera una lista de EspacioCitaDTO para todos los médicos en un rango de días
    public List<EspacioCitaDTO> espaciosMedicosParaFechas(List<Usuario> medicos, LocalDate inicio, int dias) {
        List<EspacioCitaDTO> resultado = new ArrayList<>();
        for (Usuario medico : medicos) {
            List<EspacioDTO> espacios = this.calcularNdias(medico, inicio, dias);
            for (EspacioDTO espacio : espacios) {
                resultado.add(new EspacioCitaDTO(espacio, medico));
            }
        }
        return resultado;
    }

    public List<Horario> listarHorariosPorMedico(Usuario medico) {
        if (medico == null) return Collections.emptyList();
        return horarioRepository.findByMedico(medico);
    }

    public Horario crearHorario(Horario horario) {
        return horarioRepository.save(horario);
    }

    public void eliminarHorario(Long id) {
        horarioRepository.deleteById(id);
    }
}
