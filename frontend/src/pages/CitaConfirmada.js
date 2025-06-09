import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, Link } from 'react-router-dom';

export default function CitaConfirmada() {
    // Recibe los datos de la cita por navigation state (o puedes adaptar si usas context/global)
    const location = useLocation();
    const { medico = {}, cita = {} } = location.state || {};

    // Si no hay datos, muestra mensaje (puedes adaptar según tu flujo)
    if (!medico || !cita) {
        return (
            <div className="layout-wrapper">
                <Header />
                <div className="contenido-principal">
                    <div className="confirm-cita-wrapper">
                        <div className="confirm-cita-card">
                            <h2>Datos no disponibles</h2>
                            <Link to="/buscarCita" className="btn-confirm">
                                Volver a buscar cita
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Muestra los datos de la cita confirmada
    return (
        <div className="layout-wrapper">
            <Header />
            <div className="contenido-principal">
                <div className="confirm-cita-wrapper">
                    <div className="confirm-cita-card">
                        <div className="confirm-cita-header">
                            <img
                                src={medico.foto && medico.foto !== "" ? medico.foto : '/images/profile.png'}
                                alt="Doctor Photo"
                                className="doctor-photo"
                            />
                            <h2>
                                Cita confirmada con el Dr. {medico.nombre}
                            </h2>
                        </div>
                        <div className="confirm-cita-info">
                            <p>
                                <i className="fa fa-calendar"></i>
                                {cita.fechaHora
                                    ? new Date(cita.fechaHora).toLocaleString('es-CR', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit'
                                    })
                                    : 'Sin fecha'}
                            </p>
                            <p>
                                <i className="fa fa-location-dot"></i> {medico.localidad}
                            </p>
                            <p>
                                <i className="fa fa-hand-holding-medical"></i> {medico.especialidad}
                            </p>
                            <p>
                                <i className="fa fa-money-bill-wave"></i> ₡{medico.costoConsulta}
                            </p>
                        </div>
                        <div className="confirm-cita-actions" style={{ textAlign: "center" }}>
                            <Link to="/historicoCitas" className="btn-confirm">
                                <i className="fa fa-calendar-check"></i> Ver mis citas
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
