import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const rol = localStorage.getItem('rol');
    const usuarioId = localStorage.getItem('usuarioId');
    const location = useLocation();

    // Rutas donde quieres el header especial de cada rol
    const medicoRoutes = [
        '/medico/gestionCitas',
        '/medico/perfil',
        '/medico/configurarHorario'
    ];
    const adminRoutes = [
        '/admin/medicos'
    ];
    const pacienteRoutes = [
        '/buscarCita',
        '/confirmarCita',
        '/citaConfirmada',
        '/historicoCitas',
        '/horarioExtendido',
        '/detalleCita'
    ];

    // Detecta si está en alguna ruta especial
    const isMedicoHeader = rol === 'MEDICO' && medicoRoutes.some(r => location.pathname.startsWith(r));
    const isAdminHeader = rol === 'ADMIN' && adminRoutes.some(r => location.pathname.startsWith(r));
    const isPacienteHeader = rol === 'PACIENTE' && pacienteRoutes.some(r => location.pathname.startsWith(r));

    const handleLogout = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) { }
        }
        localStorage.clear();
        window.location.href = '/login?logout=true';
    };

    // ===== Header para Médico =====
    if (isMedicoHeader) {
        return (
            <header className="header">
                <div className="header-left">
                    <img src="/images/patient-centered-care-examples.jpg" alt="Logo" className="header-logo" />
                    <span className="header-title">Medical Appointments</span>
                </div>
                <div className="telefono-contacto">+506 5467 0937</div>
                <nav className="header-menu">
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
                </nav>
            </header>
        );
    }

    // ===== Header para Admin =====
    if (isAdminHeader) {
        return (
            <header className="header">
                <div className="header-left">
                    <img src="/images/patient-centered-care-examples.jpg" alt="Logo" className="header-logo" />
                    <span className="header-title">Medical Appointments</span>
                </div>
                <div className="telefono-contacto">+506 5467 0937</div>
                <nav className="header-menu">
                    <Link to="/admin/medicos" className="menu-link">
                        <span role="img" aria-label="admin">🧑‍⚕️</span> Admin Médicos
                    </Link>
                    <button onClick={handleLogout} className="menu-link logout-btn">
                        <span role="img" aria-label="salir">🚪</span> Cerrar sesión
                    </button>
                </nav>
            </header>
        );
    }

    // ===== Header para Paciente =====
    if (isPacienteHeader) {
        return (
            <header className="header">
                <div className="header-left">
                    <img src="/images/patient-centered-care-examples.jpg" alt="Logo" className="header-logo" />
                    <span className="header-title">Medical Appointments</span>
                </div>
                <div className="telefono-contacto">+506 5467 0937</div>
                <nav className="header-menu">
                    <Link to="/about" className="menu-link">About...</Link>
                    <Link to="/buscarCita" className="menu-link">Search</Link>
                    <Link to="/historicoCitas" className="btn-historial">
                        <span role="img" aria-label="citas">🗓️</span> Mis Citas
                    </Link>
                    <button onClick={handleLogout} className="menu-link logout-btn" style={{color: '#fd900a'}}>
                        <span role="img" aria-label="salir">🚪</span> Cerrar sesión
                    </button>
                </nav>
            </header>
        );
    }

    // ===== Header base (para todas las demás páginas) =====
    return (
        <header className="header">
            <div className="header-left">
                <img src="/images/patient-centered-care-examples.jpg" alt="Logo" className="header-logo" />
                <span className="header-title">Medical Appointments</span>
            </div>
            <div className="telefono-contacto">+506 5467 0937</div>
            <nav className="header-menu">
                {/* About solo si NO es ADMIN */}
                {rol !== 'ADMIN' && <Link to="/about" className="menu-link">About...</Link>}
                {/* Search solo si NO es ADMIN ni MEDICO */}
                {rol !== 'ADMIN' && rol !== 'MEDICO' && (
                    <Link to="/buscarCita" className="menu-link">Search</Link>
                )}
                {/* Si NO ha iniciado sesión */}
                {!usuarioId && <Link to="/login" className="menu-link">Login</Link>}
                {/* Si ha iniciado sesión como PACIENTE */}
                {rol === 'PACIENTE' && (
                    <>
                        <Link to="/historicoCitas" className="btn-historial">
                            <span role="img" aria-label="citas">🗓️</span> Mis Citas
                        </Link>
                        <button onClick={handleLogout} className="menu-link logout-btn" style={{color: '#fd900a'}}>
                            <span role="img" aria-label="salir">🚪</span> Cerrar sesión
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
