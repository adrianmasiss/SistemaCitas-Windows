import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ usuario }) => {
    const rol = usuario?.rol;
    const usuarioId = usuario?.usuarioId;

    return (
        <div className="header">
            {/* Izquierda: logo */}
            <div className="logo">
                <img src="/images/patient-centered-care-examples.jpg" alt="Logo" />
                Medical Appointments
            </div>

            {/* Centro: Teléfono */}
            <div className="telefono-contacto">
                +506 5467 0937
            </div>

            {/* Derecha: Menú */}
            <div className="menu">
                {/* About solo si NO es ADMIN */}
                {rol !== 'ADMIN' && <Link to="/about">About...</Link>}

                {/* Search solo si NO es ADMIN ni MEDICO */}
                {rol !== 'ADMIN' && rol !== 'MEDICO' && (
                    <Link to="/buscarCita">Search</Link>
                )}

                {/* Si NO ha iniciado sesión */}
                {!usuarioId && <Link to="/login">Login</Link>}

                {/* Si ha iniciado sesión como MÉDICO */}
                {rol === 'MEDICO' && (
                    <div className="menu-rol">
                        <Link to="/medico/perfil">👤 Perfil</Link>
                        <Link to="/medico/configurarHorario">🕒 Horario</Link>
                        <Link to="/medico/gestionCitas" className="btn-historial">📅 Mis Citas</Link>
                        <form action="/logout" method="post" style={{ display: "inline" }}>
                            <button type="submit" className="logout-btn">🚪 Cerrar sesión</button>
                        </form>
                    </div>
                )}

                {/* Si ha iniciado sesión como PACIENTE */}
                {rol === 'PACIENTE' && (
                    <div className="menu-rol">
                        <Link to="/historicoCitas" className="btn-historial">🗓️ Mis Citas</Link>
                        <form action="/logout" method="post" style={{ display: "inline" }}>
                            <button type="submit" className="logout-btn">🚪 Cerrar sesión</button>
                        </form>
                    </div>
                )}

                {/* Si ha iniciado sesión como ADMIN */}
                {rol === 'ADMIN' && (
                    <div className="menu-rol">
                        <Link to="/admin/medicosPendientes">👨‍⚕️ Admin Médicos</Link>
                        <form action="/logout" method="post" style={{ display: "inline" }}>
                            <button type="submit" className="logout-btn">🚪 Cerrar sesión</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
