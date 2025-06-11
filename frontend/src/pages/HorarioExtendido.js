import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles.css";

export default function HorarioExtendido({
                                             medico: initialMedico,
                                             espaciosAgrupados: initialEspacios,
                                             onNext: propNext,
                                             onPrev: propPrev,
                                             disableNext: propDisableNext,
                                             disablePrev: propDisablePrev,
                                         }) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const medicoId = params.get("medicoId");
    const [medico, setMedico] = useState(initialMedico || null);
    const [espacios, setEspacios] = useState(initialEspacios || []);
    const [offset, setOffset] = useState(1);
    const dias = 7;
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setMedico(initialMedico || null);
    }, [initialMedico]);

    useEffect(() => {
        setEspacios(initialEspacios || []);
    }, [initialEspacios]);

    useEffect(() => {
        if (!initialMedico && medicoId) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const res = await fetch(
                        `/api/horario-extendido?medicoId=${medicoId}&offset=${offset}&dias=${dias}`
                    );
                    if (!res.ok) throw new Error(await res.text());
                    const data = await res.json();
                    setMedico(data.medico);
                    setEspacios(data.espaciosAgrupados || []);
                } catch {
                    setMedico(null);
                    setEspacios([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [medicoId, offset, initialMedico]);

    const handleNext = propNext || (() => setOffset((o) => o + dias));
    const handlePrev = propPrev || (() => setOffset((o) => Math.max(1, o - dias)));
    const disablePrev =
        propDisablePrev !== undefined ? propDisablePrev : offset <= 1;
    const disableNext = propDisableNext !== undefined ? propDisableNext : false;

    // NUEVA función para reservar cita y navegar a ConfirmarCita con todos los datos
    const handleReservarCita = (medico, slot) => {
        navigate('/confirmarCita', {
            state: {
                medicoId: medico.id,
                medicoNombre: medico.nombre,
                medicoFoto: medico.foto,
                fechaHora: `${slot.fecha}T${slot.hora}`,
                ubicacion: medico.localidad,
                especialidad: medico.especialidad,
                costoConsulta: medico.costoConsulta
            }
        });
    };

    if (!medico || loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                Cargando datos del médico...
            </div>
        );
    }

    return (
        <div className="horario-extendido-wrapper">
            {/* Info del médico */}
            <div className="doctor-info">
                <img
                    src={
                        medico.foto && medico.foto !== ""
                            ? medico.foto
                            : "/images/profile.png"
                    }
                    alt={medico.nombre}
                    className="doctor-img"
                />
                <div>
                    <b style={{ color: "#2c3e50", fontSize: "1.1rem" }}>
                        {medico.nombre}
                    </b>
                    <br />
                    <span style={{ color: "#009e52", fontWeight: "bold" }}>
                        ₡{medico.costoConsulta}
                    </span>
                    <div style={{ color: "#555" }}>{medico.especialidad}</div>
                    <div style={{ color: "#777", marginTop: 4 }}>{medico.localidad}</div>
                </div>
            </div>

            {/* Botones navegación */}
            <div className="horario-extendido-nav">
                <button className="btn-nav" onClick={handlePrev} disabled={disablePrev}>
                    Prev
                </button>
                <button
                    className="btn-nav"
                    onClick={handleNext}
                    disabled={disableNext}
                    style={{ marginLeft: 8 }}
                >
                    Next →
                </button>
            </div>

            {/* Tarjetas de horarios */}
            <div className="horario-extendido-cards">
                {espacios.map(({ fecha, slots }) => (
                    <div className="horario-card" key={fecha}>
                        <div className="horario-card-header">
                            {fecha.split("-").reverse().join("/")}
                        </div>
                        <div className="horario-card-body">
                            {slots.length === 0 ? (
                                <div className="sin-horarios">Sin horarios</div>
                            ) : (
                                slots.map((slot, idx) =>
                                    slot.disponible ? (
                                        <button
                                            className="slot-ext"
                                            key={idx}
                                            type="button"
                                            onClick={() => handleReservarCita(medico, slot)}
                                            style={{
                                                background: "#36d27a",
                                                color: "white",
                                                borderRadius: "11px",
                                                padding: "7px 18px",
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                boxShadow: "0 2px 5px rgba(0,150,60,0.06)",
                                                border: "none",
                                                cursor: "pointer",
                                                marginBottom: 4
                                            }}
                                        >
                                            {slot.horaFormateada || slot.hora}
                                        </button>
                                    ) : (
                                        <span className="slot-ext" key={idx}>
                                            {slot.horaFormateada || slot.hora}
                                        </span>
                                    )
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
