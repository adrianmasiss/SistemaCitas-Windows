import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Base URL del controlador en el backend
const API_URL = '/api/horario-extendido';

export default function HorarioExtendido() {
    const [params] = useSearchParams();
    const medicoId = params.get('medicoId');
    const offset = parseInt(params.get('offset') || '1', 10);

    const [medico, setMedico] = useState({});
    const [espacios, setEspacios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${API_URL}?medicoId=${medicoId}&offset=${offset}&dias=7`);
            if (!res.ok) return;
            const data = await res.json();
            setMedico(data.medico || {});
            setEspacios(data.espaciosAgrupados || []);
        };

        fetchData();
        // eslint-disable-next-line
    }, [medicoId, offset]);

    return (
        <div>
            <div className="horario-ext-card">
                {/* Navegación y médico */}
                <div className="fila-superior">
                    <div>
                        {offset > 1 && (
                            <button
                                className="btn-navegacion"
                                onClick={() => navigate(`/horarioExtendido?medicoId=${medicoId}&offset=${offset - 1}`)}
                            >
                                ← Prev
                            </button>
                        )}
                    </div>
                    <div className="info-medico">
                        <img
                            src={medico.foto && medico.foto !== "" ? medico.foto : "/images/profile.png"}
                            alt="Foto"
                        />
                        <div>
                            <b style={{ color: "#2c3e50" }}>{medico.nombre}</b><br />
                            <span style={{ color: "#27ae60" }}>₡{medico.costoConsulta}</span><br />
                            <span>{medico.especialidad}</span>
                        </div>
                    </div>
                    <div>
                        {offset + 1 <= 30 && (
                            <button
                                className="btn-navegacion"
                                onClick={() => navigate(`/horarioExtendido?medicoId=${medicoId}&offset=${offset + 1}`)}
                            >
                                Next →
                            </button>
                        )}
                    </div>
                </div>
                <div className="ubicacion">{medico.localidad}</div>
                {/* Horarios por día */}
                <div className="horarios-toggle">
                    {espacios.length === 0 ? (
                        <span style={{ color: "#888" }}>No hay horarios para mostrar.</span>
                    ) : (
                        espacios.map(grupo => (
                            <div key={grupo.fecha} className="fecha-col">
                                <h4>{grupo.fecha}</h4>
                                {grupo.slots.map((slot, idx) => (
                                    <div
                                        key={idx}
                                        className={`slot${!slot.disponible ? ' reservado' : ''}`}
                                    >
                                        {slot.disponible ? (
                                            <a
                                                href={`/confirmarCita?medicoId=${medicoId}&fechaHora=${slot.fechaHoraFormateada}`}
                                            >
                                                {slot.hora}
                                            </a>
                                        ) : (
                                            <span>{slot.hora}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="volver-container" style={{ textAlign: "center", marginTop: "2rem" }}>
                <button className="btn-volver-ext" onClick={() => navigate('/buscarCita')}>← Volver a buscar</button>
            </div>
        </div>
    );
}
