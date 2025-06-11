import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, Link } from 'react-router-dom';

export default function CitaConfirmada() {
    const location = useLocation();
    const { medico = {}, cita = {} } = location.state || {};

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

    return (
        <div className="layout-wrapper">
            <div className="contenido-principal">
                <div className="confirm-cita-wrapper" style={{ minHeight: '70vh' }}>
                    <div className="confirm-cita-card" style={{ maxWidth: 480, padding: "2.8rem 2.4rem" }}>
                        <img
                            src={medico.foto && medico.foto !== "" ? medico.foto : '/images/profile.png'}
                            alt="Doctor"
                            className="doctor-photo"
                            style={{
                                width: 110, height: 110,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #2c72de',
                                marginBottom: 12
                            }}
                        />
                        <h2 style={{
                            fontSize: 26,
                            color: "#2c3e50",
                            fontWeight: "bold",
                            marginBottom: 18
                        }}>
                            Cita confirmada con el Dr. {medico.nombre}
                        </h2>
                        <div style={{ color: "#444", fontSize: 18, marginBottom: 8 }}>
                            <i className="fa fa-calendar" style={{ marginRight: 7, color: "#2c72de" }} />
                            {cita.fechaHora
                                ? new Date(cita.fechaHora).toLocaleString('es-CR', {
                                    year: 'numeric', month: '2-digit', day: '2-digit',
                                    hour: '2-digit', minute: '2-digit'
                                })
                                : 'Sin fecha'}
                        </div>
                        <div style={{ color: "#285d7c", fontSize: 16 }}>
                            <i className="fa fa-location-dot" style={{ marginRight: 7, color: "#2ecc71" }} />
                            {medico.localidad}
                        </div>
                        <div style={{ color: "#2c3e50", fontSize: 16, margin: '10px 0 2px 0' }}>
                            <i className="fa fa-hand-holding-medical" style={{ marginRight: 7, color: "#007bff" }} />
                            {medico.especialidad}
                        </div>
                        <div style={{ color: "#009e52", fontSize: 17, fontWeight: "bold", marginBottom: 18 }}>
                            <i className="fa fa-money-bill-wave" style={{ marginRight: 7 }} />
                            ₡{medico.costoConsulta}
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <Link to="/historicoCitas" className="btn-confirm"
                                  style={{
                                      background: "#28a745",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: 8,
                                      fontWeight: "bold",
                                      fontSize: 18,
                                      padding: "10px 24px",
                                      textDecoration: "none",
                                      display: "inline-block"
                                  }}>
                                <i className="fa fa-calendar-check"></i> Ver mis citas
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
