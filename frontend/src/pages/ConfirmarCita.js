import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ConfirmarCita() {
    const location = useLocation();
    const navigate = useNavigate();

    // Se espera que vengan por location.state o query params
    const { medicoId, medicoNombre, medicoFoto, fechaHora, ubicacion } = location.state || {};

    // Envía la confirmación al backend (ajusta endpoint y auth según tu proyecto)
    const handleConfirm = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); // si usas JWT
        try {
            const res = await fetch('/api/citas/agendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    medicoId,
                    fechaHora,
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                await res.json();
            } else {
                await res.text();
            }
            // Redirige pasando datos de cita y médico
            navigate('/citaConfirmada', { state: { cita: { fechaHora }, medico: { id: medicoId, nombre: medicoNombre, foto: medicoFoto, localidad: ubicacion } } });
        } catch (err) {
            alert("Error al confirmar cita: " + err.message);
        }
    };

    return (
        <div className="layout-wrapper">
            <Header />
            <div className="contenido-principal">
                <div className="confirm-cita-wrapper">
                    <div className="confirm-cita-card">
                        <div className="confirm-cita-header">
                            <img
                                src={medicoFoto && medicoFoto !== "" ? medicoFoto : "/images/profile.png"}
                                alt="Doctor Photo"
                                className="doctor-photo"
                            />
                            <h2>{medicoNombre}</h2>
                        </div>
                        <div className="confirm-cita-info">
                            <p>
                                <i className="fa fa-calendar"></i>
                                {fechaHora
                                    ? new Date(fechaHora).toLocaleString('es-CR', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit'
                                    })
                                    : ''}
                            </p>
                            <p>
                                <i className="fa fa-map-marker-alt"></i>
                                {ubicacion}
                            </p>
                        </div>
                        <div className="confirm-cita-actions">
                            <form onSubmit={handleConfirm}>
                                <button type="submit" className="btn-confirm">
                                    <i className="fa fa-check"></i> Confirmar
                                </button>
                            </form>
                            <button
                                className="btn-cancel"
                                style={{ marginLeft: 12 }}
                                onClick={() => navigate('/buscarCita')}
                            >
                                <i className="fa fa-times"></i> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
