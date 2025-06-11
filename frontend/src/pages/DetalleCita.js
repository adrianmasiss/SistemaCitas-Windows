import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatFechaHora } from '../utils/dateUtils';

export default function DetalleCita() {
    const location = useLocation();
    const navigate = useNavigate();
    // Se espera cita completa por location.state
    const { cita } = location.state || {};

    if (!cita) {
        return (
            <div className="layout-wrapper">
                <div className="contenido-principal">
                    <div className="confirm-cita-wrapper">
                        <div className="confirm-cita-card">
                            <h2>No se encontraron datos de la cita</h2>
                            <button className="btn-volver-ext" onClick={() => navigate('/historicoCitas')}>
                                🔙 Volver a mis citas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const medico = cita.medico || {};

    return (
        <div className="layout-wrapper">
            <div className="contenido-principal">
                <div className="confirm-cita-wrapper">
                    <div className="confirm-cita-card">
                        <div className="confirm-cita-header">
                            <img
                                src={medico.foto && medico.foto !== "" ? medico.foto : "/images/profile.png"}
                                alt="Foto Médico"
                                className="doctor-photo"
                            />
                            <h2>{medico.nombre}</h2>
                        </div>
                        <div className="confirm-cita-info">
                            <p>
                                <i className="fas fa-calendar-alt"></i>
                                <strong>Fecha y Hora:</strong>{" "}
                                {cita.fechaHora ? formatFechaHora(cita.fechaHora) : ''}
                            </p>
                            <p>
                                <i className="fas fa-briefcase-medical"></i>
                                <strong>Especialidad:</strong> {medico.especialidad}
                            </p>
                            <p>
                                <i className="fas fa-map-marker-alt"></i>
                                <strong>Localidad:</strong> {medico.localidad}
                            </p>
                            <p>
                                <i className="fas fa-hand-holding-usd"></i>
                                <strong>Costo:</strong> ₡{medico.costoConsulta}
                            </p>
                            <p>
                                <i className="fas fa-clipboard-check"></i>
                                <strong>Estado:</strong> {cita.estado}
                            </p>
                            {cita.anotaciones &&
                                <p>
                                    <i className="fas fa-notes-medical"></i>
                                    <strong>Anotaciones:</strong> {cita.anotaciones}
                                </p>
                            }
                        </div>
                        <div className="confirm-cita-actions">
                            <button className="btn-volver-ext" onClick={() => navigate('/historicoCitas')}>
                                🔙 Volver a mis citas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
