import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const rol = localStorage.getItem('rol');
    const usuarioId = localStorage.getItem('usuarioId');

    const handleLogout = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                // ignore
            }
        }
        localStorage.clear();
        window.location.href = '/login?logout=true';
    };

    return (
        <header className={`header${rol ? ' ' + rol.toLowerCase() : ''}`}>
            {/* Logo e ícono */}
            <div className="header-left">
                <img src="/images/patient-centered-care-examples.jpg" alt="Logo" className="header-logo" />
                <span className="header-title">Medical Appointments</span>
            </div>

            {/* Teléfono */}
            <div className="telefono-contacto">
                +506 5467 0937
            </div>

            {/* Menú derecho */}
            <nav className="header-menu">
                {/* ADMIN */}
                {rol === 'ADMIN' && (
                    <>
                        <Link to="/admin/medicosPendientes" className="menu-link">
                            <span role="img" aria-label="admin">🧑‍⚕️</span> Admin Médicos
                        </Link>
                        <button onClick={handleLogout} className="menu-link logout-btn">
                            <span role="img" aria-label="salir">🚪</span> Cerrar sesión
                        </button>
                    </>
                )}

                {/* MÉDICO */}
                {rol === 'MEDICO' && (
                    <>
                        <Link to="/medico/perfil" className="menu-link">
                            <span role="img" aria-label="perfil">👤</span> Perfil
                        </Link>
                        <Link to="/medico/configurarHorario" className="menu-link">
                            <span role="img" aria-label="horario">🕒</span> Horario
                        </Link>
                        <Link to="/medico/gestionCitas" className="menu-link active">
                            <span role="img" aria-label="citas">📅</span> Mis Citas
                        </Link>
                        <button onClick={handleLogout} className="menu-link logout-btn">
                            <span role="img" aria-label="salir">🚪</span> Cerrar sesión
                        </button>
                    </>
                )}

                {/* PACIENTE */}
                {rol === 'PACIENTE' && (
                    <>
                        <Link to="/historicoCitas" className="menu-link active">
                            <span role="img" aria-label="citas">🗓️</span> Mis Citas
                        </Link>
                        <button onClick={handleLogout} className="menu-link logout-btn">
                            <span role="img" aria-label="salir">🚪</span> Cerrar sesión
                        </button>
                    </>
                )}

                {/* Si NO ha iniciado sesión */}
                {!usuarioId && (
                    <Link to="/login" className="menu-link">Login</Link>
                )}

                {/* About y Search solo si NO es ADMIN ni MEDICO */}
                {(!rol || (rol !== 'ADMIN' && rol !== 'MEDICO')) && (
                    <>
                        <Link to="/about" className="menu-link">About...</Link>
                        <Link to="/buscarCita" className="menu-link">Search</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
