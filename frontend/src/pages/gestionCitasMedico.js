import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Cambia a tu endpoint real
const API_URL = '/api/medico/citas';

export default function GestionCitasMedico() {
    const [citas, setCitas] = useState([]);
    const [estado, setEstado] = useState('');
    const [paciente, setPaciente] = useState('');
    const [loading, setLoading] = useState(true);

    // Cargar citas filtradas
    const fetchCitas = async () => {
        setLoading(true);
        try {
            let query = [];
            if (estado) query.push(`estado=${estado}`);
            if (paciente) query.push(`paciente=${encodeURIComponent(paciente)}`);
            const res = await fetch(`${API_URL}?${query.join('&')}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok) throw new Error('Error al cargar citas');
            const data = await res.json();
            setCitas(data);
        } catch (err) {
            setCitas([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCitas();
        // eslint-disable-next-line
    }, []);

    const handleFiltrar = (e) => {
        e.preventDefault();
        fetchCitas();
    };

    // Completar cita (POST)
    const completarCita = async (citaId, anotaciones) => {
        try {
            const res = await fetch(`/api/medico/completarCita`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ citaId, anotaciones })
            });
            if (!res.ok) throw new Error(await res.text());
            fetchCitas(); // recargar
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="layout-wrapper">
            <div className="contenido-principal">
                <div className="contenedor-citas">
                    <h1 style={{ textAlign: "center", color: "#2c3e50" }}>📋 Gestión de Citas</h1>
                    <div className="filtros-citas">
                        <form className="formulario-filtros" onSubmit={handleFiltrar}>
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
                                <label htmlFor="paciente">Paciente:</label>
                                <input
                                    id="paciente"
                                    type="text"
                                    value={paciente}
                                    onChange={e => setPaciente(e.target.value)}
                                    placeholder="Nombre del paciente"
                                />
                            </div>
                            <div className="campo-filtro">
                                <label style={{ opacity: 0 }}>Filtrar</label>
                                <button type="submit" className="btn-blue">🔍 Filtrar</button>
                            </div>
                        </form>
                    </div>
                    {loading ? (
                        <div className="mensaje-sin-citas">Cargando...</div>
                    ) : citas.length === 0 ? (
                        <div className="mensaje-sin-citas">
                            🛑 No hay citas para mostrar con los filtros seleccionados.
                        </div>
                    ) : (
                        <table className="tabla-citas">
                            <thead>
                            <tr>
                                <th>📅 Fecha y Hora</th>
                                <th>🧍 Paciente</th>
                                <th>📌 Estado</th>
                                <th>📝 Anotaciones</th>
                                <th>⚙️ Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {citas.map(cita => (
                                <tr key={cita.id}>
                                    <td>{new Date(cita.fechaHora).toLocaleString('es-CR')}</td>
                                    <td>{cita.paciente?.nombre}</td>
                                    <td>{cita.estado}</td>
                                    <td>{cita.anotaciones || ""}</td>
                                    <td>
                                        {cita.estado !== 'ATENDIDA' ? (
                                            <CompletarForm citaId={cita.id} completarCita={completarCita} />
                                        ) : (
                                            <span>✅ Completada</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

// Formulario inline para anotar/completar cita
function CompletarForm({ citaId, completarCita }) {
    const [anotaciones, setAnotaciones] = useState('');
    return (
        <form
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onSubmit={e => {
                e.preventDefault();
                completarCita(citaId, anotaciones);
                setAnotaciones('');
            }}>
            <input
                type="text"
                name="anotaciones"
                className="input-anotaciones"
                placeholder="Agregar..."
                value={anotaciones}
                onChange={e => setAnotaciones(e.target.value)}
            />
            <button type="submit" className="btn-completar">✔ Completar</button>
        </form>
    );
}
