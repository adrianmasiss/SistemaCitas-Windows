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

    const formatTime = (time) => {
        if (time == null) return '';
        // Si es un array tipo [10, 0]
        if (Array.isArray(time) && time.length >= 2) {
            // Rellena con ceros si hace falta
            const h = String(time[0]).padStart(2, '0');
            const m = String(time[1]).padStart(2, '0');
            return `${h}:${m}`;
        }
        // Si es un número tipo 1000, 930, etc
        if (typeof time === 'number') {
            const h = Math.floor(time / 100);
            const m = time % 100;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }
        // Si es string tipo "10:00" o "1000"
        if (typeof time === 'string') {
            if (time.includes(':')) return time.substring(0, 5);
            // Si es "1000", "930", etc
            const n = parseInt(time, 10);
            if (!isNaN(n)) {
                const h = Math.floor(n / 100);
                const m = n % 100;
                return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            }
        }
        // Si nada de lo anterior, por defecto
        return String(time);
    };



    useEffect(() => {
        const medicoId = localStorage.getItem('usuarioId');
        const token = localStorage.getItem('token');
        fetch(`/api/horarios/medico/${medicoId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    window.location.href = '/login';
                    return [];
                }
                return res.json();
            })
            .then(setHorarios)
            .catch(() => setHorarios([]));
    }, []);

    const crearHorario = async () => {
        setError('');
        const medicoId = localStorage.getItem('usuarioId');
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Debe iniciar sesión');
            return false;
        }
        const res = await fetch('/api/horarios/crearPorRango', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                medicoId,
                diaInicio,
                diaFin,
                horaInicio,
                horaFin,
                frecuencia: parseInt(frecuencia, 10),
            }),
        });
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/login';
            return false;
        }
        if (!res.ok) {
            setError(await res.text());
            return false;
        }
        setHoraInicio('');
        setHoraFin('');
        setFrecuencia('');
        const horariosRes = await fetch(`/api/horarios/medico/${medicoId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setHorarios(await horariosRes.json());
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        crearHorario().catch(() => setError('Error al crear horario'));
    };

    const handleFinalizar = async (e) => {
        e.preventDefault();
        let ok = true;
        if (horaInicio && horaFin && frecuencia) {
            ok = await crearHorario();
        }
        if (ok) window.location.href = "/medico/gestionCitas";
    };


    return (
        <div className="layout-wrapper">
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
                                    <td>{formatTime(horario.horaInicio)}</td>
                                    <td>{formatTime(horario.horaFin)}</td>
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
        </div>
    );
}
