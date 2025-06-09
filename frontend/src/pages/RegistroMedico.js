import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DIAS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

export default function RegistroMedico() {
    const [datos, setDatos] = useState({
        nombre: '', username: '', clave: '', confirmClave: '', especialidad: '',
        costoConsulta: '', localidad: '', foto: '', presentacion: '',
        diaInicioTrabajo: DIAS[0], diaFinTrabajo: DIAS[0],
        horaInicioTrabajo: '', horaFinTrabajo: '', frecuencia: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        if (!datos.nombre || !datos.username || !datos.clave || !datos.confirmClave ||
            !datos.especialidad || !datos.costoConsulta || !datos.localidad ||
            !datos.diaInicioTrabajo || !datos.diaFinTrabajo ||
            !datos.horaInicioTrabajo || !datos.horaFinTrabajo || !datos.frecuencia) {
            setError('Todos los campos obligatorios deben estar completos.');
            return;
        }
        if (datos.clave !== datos.confirmClave) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        try {
            const res = await fetch('/api/auth/registerMedico', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            if (!res.ok) {
                setError(await res.text());
                return;
            }
            navigate('/mensajeRegistro?rol=MEDICO');
        } catch (err) {
            setError('Hubo un error. Intenta de nuevo.');
        }
    };

    return (
        <div className="layout-wrapper">
            <div className="contenido-principal">
                <div className="form-container register-box">
                    <h1>Registro de <span className="txt-medico">Médico</span></h1>
                    <form onSubmit={handleSubmit}>
                        <label>Nombre completo:</label>
                        <input type="text" name="nombre" required value={datos.nombre}
                               onChange={handleChange} placeholder="Tu nombre completo" />

                        <label>Nombre de usuario:</label>
                        <input type="text" name="username" required value={datos.username}
                               onChange={handleChange} placeholder="Usuario para iniciar sesión" />

                        <label>Contraseña:</label>
                        <input type="password" name="clave" required value={datos.clave}
                               onChange={handleChange} placeholder="Contraseña" />

                        <label>Confirmar contraseña:</label>
                        <input type="password" name="confirmClave" required value={datos.confirmClave}
                               onChange={handleChange} placeholder="Repite la contraseña" />

                        <label>Especialidad:</label>
                        <input type="text" name="especialidad" required value={datos.especialidad}
                               onChange={handleChange} placeholder="Ej: Dermatología" />

                        <label>Costo Consulta:</label>
                        <input type="number" name="costoConsulta" required value={datos.costoConsulta}
                               onChange={handleChange} placeholder="₡35000" />

                        <label>Localidad:</label>
                        <input type="text" name="localidad" required value={datos.localidad}
                               onChange={handleChange} placeholder="Ej: Cartago" />

                        <label>URL Foto:</label>
                        <input type="text" name="foto" value={datos.foto}
                               onChange={handleChange} placeholder="https://..." />

                        <label>Presentación:</label>
                        <textarea name="presentacion" value={datos.presentacion}
                                  onChange={handleChange} placeholder="Soy médico con experiencia en..."></textarea>

                        <label>Día de Inicio de Trabajo:</label>
                        <select name="diaInicioTrabajo" value={datos.diaInicioTrabajo} onChange={handleChange} required>
                            {DIAS.map(d => <option value={d} key={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
                        </select>

                        <label>Día de Fin de Trabajo:</label>
                        <select name="diaFinTrabajo" value={datos.diaFinTrabajo} onChange={handleChange} required>
                            {DIAS.map(d => <option value={d} key={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
                        </select>

                        <label>Hora de inicio de trabajo:</label>
                        <input type="time" name="horaInicioTrabajo" value={datos.horaInicioTrabajo}
                               onChange={handleChange} required />

                        <label>Hora de fin de trabajo:</label>
                        <input type="time" name="horaFinTrabajo" value={datos.horaFinTrabajo}
                               onChange={handleChange} required />

                        <label>Duración de cada cita (minutos):</label>
                        <input type="number" name="frecuencia" min={5} value={datos.frecuencia}
                               onChange={handleChange} required />

                        {error && <div className="error">{error}</div>}
                        <button type="submit" className="btn-primary">Registrarse</button>
                    </form>
                    <div className="login-link">
                        ¿Ya tienes cuenta?
                        <a href="/login" className="enlace-login">Inicia sesión</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
