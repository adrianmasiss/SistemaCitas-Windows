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

    private String dayOfWeekToSpanish(java.time.DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return "LUNES";
            case TUESDAY: return "MARTES";
            case WEDNESDAY: return "MIERCOLES";
            case THURSDAY: return "JUEVES";
            case FRIDAY: return "VIERNES";
            case SATURDAY: return "SABADO";
            case SUNDAY: return "DOMINGO";
            default: throw new IllegalArgumentException("Día inválido: " + dayOfWeek);
        }
    }

    public List<EspacioDTO> calcularNdias(Usuario medico, LocalDate inicio, int cantidadDias) {
        if (medico == null) return Collections.emptyList();
        List<Horario> horarios = horarioRepository.findByMedico(medico);
        if (horarios == null || horarios.isEmpty()) return Collections.emptyList();
        List<EspacioDTO> espacios = new ArrayList<>();
        for (int i = 0; i < cantidadDias; i++) {
            LocalDate fecha = inicio.plusDays(i);
            String diaSemana = dayOfWeekToSpanish(fecha.getDayOfWeek()); // CAMBIO AQUÍ
            for (Horario h : horarios) {
                if (!h.getDiaSemana().equalsIgnoreCase(diaSemana)) continue;
                java.time.LocalTime horaActual = h.getHoraInicio();
                while (!horaActual.isAfter(h.getHoraFin().minusMinutes(h.getFrecuencia()))) {
                    java.time.LocalDateTime fechaHora = java.time.LocalDateTime.of(fecha, horaActual);
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

    public List<Horario> buscarPorMedicoYDia(Usuario medico, String diaSemana) {
        return horarioRepository.findByMedicoAndDiaSemana(medico, diaSemana);
    }

    public void eliminarHorario(Long id) {
        horarioRepository.deleteById(id);
    }

    public List<Map<String, Object>> calcularDiasConVacíos(Usuario medico, LocalDate inicio, int cantidadDias) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        // Obtén todos los espacios para el rango de días
        List<EspacioDTO> espacios = calcularNdias(medico, inicio, cantidadDias);
        // Agrupa los espacios por fecha (String)
        Map<String, List<EspacioDTO>> agrupados = new HashMap<>();
        for (EspacioDTO esp : espacios) {
            String fecha = esp.getFecha().toString();
            agrupados.computeIfAbsent(fecha, f -> new ArrayList<>()).add(esp);
        }
        // Para cada día del rango, arma el objeto (aunque no haya espacios)
        for (int i = 0; i < cantidadDias; i++) {
            LocalDate fecha = inicio.plusDays(i);
            String fechaStr = fecha.toString();
            Map<String, Object> dia = new HashMap<>();
            dia.put("fecha", fechaStr);
            dia.put("slots", agrupados.getOrDefault(fechaStr, new ArrayList<>()));
            resultado.add(dia);
        }
        return resultado;
    }

}
