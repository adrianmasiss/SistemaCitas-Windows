import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DIAS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

export default function RegistroGeneral() {
    const [rol, setRol] = useState('PACIENTE');
    const [datos, setDatos] = useState({
        nombre: '', username: '', clave: '', confirmClave: '',
        especialidad: '', costoConsulta: '', localidad: '',
        foto: '', presentacion: '',
        diaInicioTrabajo: DIAS[0], diaFinTrabajo: DIAS[0],
        horaInicioTrabajo: '', horaFinTrabajo: '', frecuencia: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };
    const handleRolChange = e => {
        setRol(e.target.value);
        // Reset datos extras al cambiar rol
        setDatos(d => ({
            ...d,
            especialidad: '', costoConsulta: '', localidad: '', foto: '',
            presentacion: '', diaInicioTrabajo: DIAS[0], diaFinTrabajo: DIAS[0],
            horaInicioTrabajo: '', horaFinTrabajo: '', frecuencia: ''
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (!datos.nombre || !datos.username || !datos.clave || !datos.confirmClave) {
            setError('Nombre, usuario y contraseña son obligatorios.');
            return;
        }
        if (datos.clave !== datos.confirmClave) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        let url = '/api/auth/registerPaciente';
        let body = { ...datos };
        if (rol === 'MEDICO') {
            url = '/api/auth/registerMedico';
            // (El backend ya ignora los campos no usados)
        } else if (rol === 'ADMIN') {
            url = '/api/auth/registerAdmin';
        }
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...body, rol })
            });
            if (!res.ok) {
                setError(await res.text());
                return;
            }
            navigate('/mensajeRegistro?rol=' + rol);
        } catch (err) {
            setError('Error de red. Intenta de nuevo.');
        }
    };

    return (
        <div className="layout-wrapper">
            <Header />
            <div className="contenido-principal">
                <div className="form-container register-box">
                    <h1>Registro de Usuario</h1>
                    <form onSubmit={handleSubmit}>
                        <label>Nombre completo:</label>
                        <input type="text" name="nombre" required placeholder="Nombre completo"
                               value={datos.nombre} onChange={handleChange} />
                        <label>Nombre de usuario:</label>
                        <input type="text" name="username" required placeholder="Usuario"
                               value={datos.username} onChange={handleChange} />
                        <label>Contraseña:</label>
                        <input type="password" name="clave" required placeholder="Contraseña"
                               value={datos.clave} onChange={handleChange} />
                        <label>Confirmar contraseña:</label>
                        <input type="password" name="confirmClave" required placeholder="Confirmar contraseña"
                               value={datos.confirmClave} onChange={handleChange} />

                        <label>Rol:</label>
                        <select value={rol} onChange={handleRolChange}>
                            <option value="PACIENTE">Paciente</option>
                            <option value="MEDICO">Médico</option>
                            <option value="ADMIN">Administrador</option>
                        </select>

                        {rol === 'MEDICO' && (
                            <>
                                <label>Especialidad:</label>
                                <input type="text" name="especialidad" value={datos.especialidad}
                                       onChange={handleChange} placeholder="Ej: Cardiología" required={rol === 'MEDICO'} />
                                <label>Costo Consulta:</label>
                                <input type="number" name="costoConsulta" value={datos.costoConsulta}
                                       onChange={handleChange} placeholder="₡35000" required={rol === 'MEDICO'} />
                                <label>Localidad:</label>
                                <input type="text" name="localidad" value={datos.localidad}
                                       onChange={handleChange} placeholder="Ej: Heredia" required={rol === 'MEDICO'} />
                                <label>URL Foto:</label>
                                <input type="text" name="foto" value={datos.foto}
                                       onChange={handleChange} placeholder="https://..." />
                                <label>Presentación:</label>
                                <textarea name="presentacion" value={datos.presentacion}
                                          onChange={handleChange} placeholder="Soy médico con experiencia en..."></textarea>
                                <label>Día de Inicio de Trabajo:</label>
                                <select name="diaInicioTrabajo" value={datos.diaInicioTrabajo} onChange={handleChange}>
                                    {DIAS.map(d => <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
                                </select>
                                <label>Día de Fin de Trabajo:</label>
                                <select name="diaFinTrabajo" value={datos.diaFinTrabajo} onChange={handleChange}>
                                    {DIAS.map(d => <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
                                </select>
                                <label>Hora de inicio de trabajo:</label>
                                <input type="time" name="horaInicioTrabajo" value={datos.horaInicioTrabajo}
                                       onChange={handleChange} />
                                <label>Hora de fin de trabajo:</label>
                                <input type="time" name="horaFinTrabajo" value={datos.horaFinTrabajo}
                                       onChange={handleChange} />
                                <label>Duración de cada cita (minutos):</label>
                                <input type="number" name="frecuencia" min={5} value={datos.frecuencia}
                                       onChange={handleChange} />
                            </>
                        )}

                        {error && <div className="error">{error}</div>}
                        <button type="submit" className="btn-primary">Registrarse</button>
                    </form>
                    <div className="login-link" style={{ marginTop: "1rem" }}>
                        ¿Ya tienes cuenta?
                        <a href="/login">Inicia sesión</a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
