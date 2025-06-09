import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const usuarioId = localStorage.getItem('usuarioId');
// Endpoint para obtener el historial del paciente logueado
const API_URL = `/api/historico-citas/paciente/${usuarioId}`;

export default function HistoricoCitas() {
    const [citas, setCitas] = useState([]);
    const [estado, setEstado] = useState('');
    const [medico, setMedico] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Cargar historial con filtros
    const fetchCitas = async () => {
        setLoading(true);
        try {
            let query = [];
            if (estado) query.push(`estado=${estado}`);
            if (medico) query.push(`medico=${encodeURIComponent(medico)}`);
            const url = query.length ? `${API_URL}?${query.join('&')}` : API_URL;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok) throw new Error("Error al cargar el historial");
            const data = await res.json();
            setCitas(data);
        } catch (err) {
            setCitas([]);
        }
        setLoading(false);
    };

    useEffect(() => { fetchCitas(); /* eslint-disable-next-line */ }, []);

    const handleBuscar = e => {
        e.preventDefault();
        fetchCitas();
    };

    // Ver detalle
    const verDetalle = (cita) => {
        navigate('/detalleCita', { state: { cita } });
    };

    return (
        <div className="layout-wrapper">
            <Header />
            <div className="contenido-principal">
                <div className="contenedor-citas">
                    <h1 style={{ textAlign: "center", color: "#2c3e50" }}>🕓 Histórico de Citas</h1>
                    <div className="filtros-citas">
                        <form className="formulario-filtros" onSubmit={handleBuscar}>
                            <div className="campo-filtro igualado">
                                <label htmlFor="estado">Estado:</label>
                                <select id="estado" value={estado} onChange={e => setEstado(e.target.value)}>
                                    <option value="">-- Todos --</option>
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="CONFIRMADA">Confirmada</option>
                                    <option value="CANCELADA">Cancelada</option>
                                    <option value="ATENDIDA">Atendida</option>
                                </select>
                            </div>
                            <div className="campo-filtro igualado">
                                <label htmlFor="medico">Médico:</label>
                                <input
                                    id="medico"
                                    type="text"
                                    value={medico}
                                    onChange={e => setMedico(e.target.value)}
                                    placeholder="Nombre del médico"
                                />
                            </div>
                            <button type="submit" className="btn-blue">🔍 Buscar</button>
                        </form>
                    </div>
                    {loading ? (
                        <div className="mensaje-sin-citas">Cargando...</div>
                    ) : citas.length === 0 ? (
                        <div className="mensaje-sin-citas">
                            🛑 No hay citas en el historial.
                        </div>
                    ) : (
                        <table className="tabla-citas">
                            <thead>
                            <tr>
                                <th>📅 Fecha y Hora</th>
                                <th>👨‍⚕️ Médico</th>
                                <th>📌 Estado</th>
                                <th>📝 Anotaciones</th>
                                <th>⚙️ Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {citas.map(cita => (
                                <tr key={cita.id}>
                                    <td>{new Date(cita.fechaHora).toLocaleString('es-CR')}</td>
                                    <td>{cita.medico?.nombre}</td>
                                    <td>
                                        <span className={`badge-estado badge-${cita.estado}`}>{cita.estado}</span>
                                    </td>
                                    <td>{cita.anotaciones ? cita.anotaciones : "—"}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn-completar"
                                            onClick={() => verDetalle(cita)}
                                        >
                                            <i className="fa fa-eye"></i> Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                    <button className="btn-volver" style={{ marginTop: '2rem' }} onClick={() => navigate('/buscarCita')}>
                        ← Volver
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
