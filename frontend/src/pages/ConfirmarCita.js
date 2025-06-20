import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ConfirmarCita() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            if (location.state) {
                sessionStorage.setItem('confirmarCitaState', JSON.stringify(location.state));
            }
            navigate('/login?redirect=confirmarCita');
        }
    }, [navigate, location.state]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            sessionStorage.removeItem('confirmarCitaState');
        }
    }, []);

    // Recibe info por state o por sessionStorage (como fallback)
    const citaState = location.state || (() => {
        const stored = sessionStorage.getItem('confirmarCitaState');
        return stored ? JSON.parse(stored) : {};
    })();

    // Recibe info por state o por params (como fallback)
    const { medicoId, medicoNombre, medicoFoto, fechaHora, ubicacion, medicoEspecialidad = '', medicoCostoConsulta = '' } = citaState;
    const normalizarFechaHora = (str) => {
        let match = str && str.match(/^(\d{4}),(\d{1,2}),(\d{1,2})T(\d{1,2}),(\d{1,2})$/);
        if (match) {
            let [, year, month, day, hour, minute] = match;
            month = month.padStart(2, '0');
            day = day.padStart(2, '0');
            hour = hour.padStart(2, '0');
            minute = minute.padStart(2, '0');
            return `${year}-${month}-${day}T${hour}:${minute}`;
        }
        return str;
    };

    const getFechaFormateada = (fechaHora) => {
        if (!fechaHora) return "Fecha no válida";
        const str = normalizarFechaHora(fechaHora.includes(' ') ? fechaHora.replace(' ', 'T') : fechaHora);
        const date = new Date(str);
        if (isNaN(date.getTime())) return "Fecha no válida";
        return date.toLocaleString('es-CR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!medicoId || !medicoNombre || !fechaHora || !ubicacion) {
        return (
            <div className="layout-wrapper">
                <div className="contenido-principal">
                    <div className="confirm-cita-wrapper">
                        <div className="confirm-cita-card" style={{ maxWidth: 350 }}>
                            <h2>Datos de la cita no disponibles.</h2>
                            <button className="btn-cancel" onClick={() => navigate('/buscarCita')}>
                                Volver a buscar cita
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Confirmar cita
    const handleConfirm = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const pacienteId = localStorage.getItem("usuarioId");
        if (!token || !pacienteId) {
            navigate('/login');
            return;
        }
        try {
            const fechaHoraNormalizada = normalizarFechaHora(fechaHora);
            const url = `/api/citas/paciente/confirmar?pacienteId=${pacienteId}&medicoId=${medicoId}&fechaHora=${encodeURIComponent(fechaHoraNormalizada)}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    ...(token ? {Authorization: `Bearer ${token}`} : {})
                }
            });

            if (!res.ok) throw new Error(await res.text());
            // Pasa todos los datos que tienes aquí:
            navigate('/citaConfirmada', {
                state: {
                    medico: {
                        nombre: medicoNombre,
                        foto: medicoFoto,
                        localidad: ubicacion,
                        especialidad: medicoEspecialidad,
                        costoConsulta: medicoCostoConsulta
                    },
                    cita: { fechaHora: fechaHoraNormalizada }
                }
            });
        } catch (err) {
            alert("Error al confirmar cita: " + err.message);
        }
    };

    return (
        <div className="layout-wrapper" style={{ minHeight: "90vh" }}>
            <div className="contenido-principal">
                <div className="confirm-cita-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "65vh" }}>
                    <div className="confirm-cita-card"
                         style={{
                             maxWidth: 400,
                             padding: "2.5rem 2rem",
                             boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.09)",
                             borderRadius: 20,
                             background: "#fff",
                             textAlign: "center"
                         }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
                            <h2 style={{
                                fontSize: 25,
                                color: "#2c3e50",
                                margin: 0
                            }}>Confirmar Cita</h2>
                        </div>
                        <img
                            src={medicoFoto && medicoFoto !== "" ? medicoFoto : "/images/profile.png"}
                            alt="Doctor"
                            className="doctor-photo"
                            style={{
                                width: 90, height: 90,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #2c72de',
                                marginBottom: 12
                            }}
                        />
                        <div style={{ fontWeight: 600, fontSize: 22, margin: "0 0 7px 0", color: "#31456A" }}>
                            {medicoNombre}
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <div style={{ color: "#2353a8", fontSize: 17, margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                                <i className="fa fa-calendar" style={{ color: "#2c72de" }} />
                                {getFechaFormateada(fechaHora)}
                            </div>
                            <div style={{ color: "#285d7c", fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <i className="fa fa-map-marker" style={{ color: "#2ecc71" }} />
                                {ubicacion}
                            </div>
                            {medicoEspecialidad && (
                                <div style={{ color: "#007bff", fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
                                    <i className="fa fa-hand-holding-medical" style={{ color: "#007bff" }} />
                                    {medicoEspecialidad}
                                </div>
                            )}
                            {medicoCostoConsulta && (
                                <div style={{ color: "#009e52", fontSize: 17, fontWeight: "bold", marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                    <i className="fa fa-money-bill-wave" style={{ color: "#009e52" }} />
                                    ₡{medicoCostoConsulta}
                                </div>
                            )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 15, marginTop: 10 }}>
                            <form onSubmit={handleConfirm}>
                                <button type="submit" className="btn-confirm"
                                        style={{
                                            background: "#28a745",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 8,
                                            fontWeight: "bold",
                                            fontSize: 16,
                                            padding: "8px 18px",
                                            cursor: "pointer"
                                        }}>
                                    <i className="fa fa-check"></i> Confirmar
                                </button>
                            </form>
                            <button
                                className="btn-cancel"
                                style={{
                                    background: "#e74c3c",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    fontWeight: "bold",
                                    fontSize: 16,
                                    padding: "8px 18px",
                                    cursor: "pointer"
                                }}
                                onClick={() => navigate('/buscarCita')}
                            >
                                <i className="fa fa-times"></i> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
