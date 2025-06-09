import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DIAS_SEMANA = [
    { value: 'LUNES', label: 'Lunes' },
    { value: 'MARTES', label: 'Martes' },
    { value: 'MIERCOLES', label: 'Miércoles' },
    { value: 'JUEVES', label: 'Jueves' },
    { value: 'VIERNES', label: 'Viernes' },
    { value: 'SABADO', label: 'Sábado' },
    { value: 'DOMINGO', label: 'Domingo' },
];

export default function ConfigurarHorario() {
    const [diaInicio, setDiaInicio] = useState('LUNES');
    const [diaFin, setDiaFin] = useState('VIERNES');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [frecuencia, setFrecuencia] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [error, setError] = useState('');

    // Cargar horarios actuales al montar
    useEffect(() => {
        // Suponiendo que el ID del médico viene por auth/context...
        const medicoId = localStorage.getItem('usuarioId');
        fetch(`/api/horarios/medico/${medicoId}`)
            .then(res => res.json())
            .then(setHorarios)
            .catch(() => setHorarios([]));
    }, []);

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const medicoId = localStorage.getItem('usuarioId');
        fetch('/api/horarios/crearPorRango', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                medicoId,
                diaInicio,
                diaFin,
                horaInicio,
                horaFin,
                frecuencia: parseInt(frecuencia, 10),
            }),
        })
            .then(res => {
                if (!res.ok) return res.text().then(setError);
                // Recargar horarios después de crear
                return fetch(`/api/horarios/medico/${medicoId}`).then(r => r.json()).then(setHorarios);
            })
            .catch(() => setError('Error al crear horario'));
    };

    // Ir a gestión de citas (o tu ruta deseada)
    const handleFinalizar = (e) => {
        e.preventDefault();
        window.location.href = "/medico/gestionCitas"; // Cambia a tu ruta real si usas react-router
    };

    return (
        <div className="layout-wrapper">
            <Header />
            <div className="contenido-principal">
                <div className="contenedor">
                    <h1>🗓️ Configurar Horario Laboral</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Día de Inicio de Trabajo:</label>
                        <select value={diaInicio} onChange={e => setDiaInicio(e.target.value)} required>
                            {DIAS_SEMANA.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                        <label>Día de Fin de Trabajo:</label>
                        <select value={diaFin} onChange={e => setDiaFin(e.target.value)} required>
                            {DIAS_SEMANA.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                        <label>Hora de Inicio:</label>
                        <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} required />
                        <label>Hora de Fin:</label>
                        <input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} required />
                        <label>Frecuencia (minutos):</label>
                        <input type="number" value={frecuencia} onChange={e => setFrecuencia(e.target.value)} placeholder="Ej. 30" required />
                        <button type="submit">Aplicar horario a rango seleccionado</button>
                    </form>

                    <h2 style={{marginTop: 40}}>📋 Horarios Configurados</h2>
                    <div className="horarios-titles-table" style={{overflowX: "auto"}}>
                        <table>
                            <thead>
                            <tr>
                                <th>Día</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Frecuencia</th>
                            </tr>
                            </thead>
                            <tbody>
                            {horarios.map((horario, idx) => (
                                <tr key={idx}>
                                    <td>{horario.diaSemana}</td>
                                    <td>{horario.horaInicio}</td>
                                    <td>{horario.horaFin}</td>
                                    <td>{horario.frecuencia}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {error && <div className="error">{error}</div>}

                    <form onSubmit={handleFinalizar} style={{ textAlign: "center", marginTop: "2rem" }}>
                        <button className="btn-finalizar" type="submit">✅ Finalizar y ver citas</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
