import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RegistroPaciente() {
    const [datos, setDatos] = useState({
        nombre: '',
        username: '',
        clave: '',
        confirmClave: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        if (!datos.nombre || !datos.username || !datos.clave || !datos.confirmClave) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (datos.clave !== datos.confirmClave) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const res = await fetch('/api/auth/registerPaciente', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            if (!res.ok) {
                setError(await res.text());
                return;
            }

            navigate('/mensajeRegistro?rol=PACIENTE');
        } catch (err) {
            setError('Hubo un error. Intenta de nuevo.');
        }
    };

    return (
        <div className="layout-wrapper">
            <div className="contenido-principal">
                <div className="form-container register-box">
                    <h1>Registro de <span className="txt-paciente">Paciente</span></h1>
                    <form onSubmit={handleSubmit}>
                        <label>Nombre completo:</label>
                        <input
                            type="text"
                            name="nombre"
                            required
                            placeholder="Tu nombre completo"
                            value={datos.nombre}
                            onChange={handleChange}
                        />

                        <label>Nombre de usuario:</label>
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="Usuario para iniciar sesión"
                            value={datos.username}
                            onChange={handleChange}
                        />

                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="clave"
                            required
                            placeholder="Contraseña"
                            value={datos.clave}
                            onChange={handleChange}
                        />

                        <label>Confirmar contraseña:</label>
                        <input
                            type="password"
                            name="confirmClave"
                            required
                            placeholder="Repite la contraseña"
                            value={datos.confirmClave}
                            onChange={handleChange}
                        />

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
