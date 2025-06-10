import React from "react";
import "../styles.css"; // Asegúrate de que aquí apunte a tu CSS global

export default function HorarioExtendido({ medico, espaciosAgrupados, onNext, onPrev, disableNext, disablePrev }) {
    if (!medico) {
        return <div style={{ textAlign: "center", marginTop: "2rem" }}>Cargando datos del médico...</div>;
    }

    return (
        <div className="horario-extendido-wrapper">
            {/* Info del médico */}
            <div className="doctor-info">
                <img
                    src={medico.foto && medico.foto !== "" ? medico.foto : "/images/profile.png"}
                    alt={medico.nombre}
                    className="doctor-img"
                />
                <div>
                    <b style={{ color: "#2c3e50", fontSize: "1.1rem" }}>{medico.nombre}</b><br />
                    <span style={{ color: "#009e52", fontWeight: "bold" }}>₡{medico.costoConsulta}</span>
                    <div style={{ color: "#555" }}>{medico.especialidad}</div>
                    <div style={{ color: "#777", marginTop: 4 }}>{medico.localidad}</div>
                </div>
            </div>

            {/* Botones navegación */}
            <div className="horario-extendido-nav">
                <button className="btn-nav" onClick={onPrev} disabled={disablePrev}>Prev</button>
                <button className="btn-nav" onClick={onNext} disabled={disableNext} style={{ marginLeft: 8 }}>Next →</button>
            </div>

            {/* Tarjetas de horarios */}
            <div className="horario-extendido-cards">
                {espaciosAgrupados.map(({ fecha, slots }) => (
                    <div className="horario-card" key={fecha}>
                        <div className="horario-card-header">
                            {/* Formato dd/MM/yyyy */}
                            {fecha.split("-").reverse().join("/")}
                        </div>
                        <div className="horario-card-body">
                            {slots.length === 0 ? (
                                <div className="sin-horarios">Sin horarios</div>
                            ) : (
                                slots.map((slot, idx) => (
                                    <div className="slot-ext" key={idx}>
                                        <span>{slot.horaFormateada || slot.hora}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
