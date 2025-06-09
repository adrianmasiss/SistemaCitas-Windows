import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MensajeRegistro() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const rol = params.get('rol');

    return (
        <div className="layout-wrapper">
            <div className="contenido-principal">
                <div className="mensaje-container">
                    <div className="card-exito" style={{
                        background: '#fff',
                        padding: '2rem',
                        maxWidth: 600,
                        margin: '4rem auto',
                        borderRadius: 15,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h1 style={{ color: "#2c3e50", marginBottom: "1rem" }}>🎉 ¡Registro exitoso!</h1>

                        {rol === 'PACIENTE' ? (
                            <p style={{ fontSize: "1.1rem", color: "#333" }}>
                                Tu cuenta ha sido creada correctamente.<br />
                                Ahora puedes iniciar sesión y buscar médicos.
                            </p>
                        ) : rol === 'MEDICO' ? (
                            <p style={{ fontSize: "1.1rem", color: "#333" }}>
                                Tu solicitud ha sido registrada.<br />
                                Un administrador debe aprobar tu cuenta antes de que puedas acceder al sistema.
                            </p>
                        ) : null}

                        <button
                            className="btn-volver-login"
                            style={{
                                marginTop: "2rem",
                                background: "#3498db",
                                color: "white",
                                padding: "0.7rem 1.5rem",
                                borderRadius: "8px",
                                fontWeight: "bold"
                            }}
                            onClick={() => navigate('/login')}
                        >
                            🔐 Volver al Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
