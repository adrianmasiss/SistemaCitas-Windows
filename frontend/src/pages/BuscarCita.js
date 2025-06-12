import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BuscarCita() {
    const [especialidad, setEspecialidad] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [horarios, setHorarios] = useState({});
    const [verHorarios, setVerHorarios] = useState({});
    const [verMasDias, setVerMasDias] = useState({});
    const navigate = useNavigate();

    // Buscar médicos por filtros
    const buscarMedicos = (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        let url = `/api/medicos/buscar?`;
        if (especialidad) url += `especialidad=${encodeURIComponent(especialidad)}&`;
        if (ciudad) url += `ciudad=${encodeURIComponent(ciudad)}`;
        fetch(url)
            .then(async res => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then(async data => {
                setMedicos(data);
                let horariosMap = {};
                for (let medico of data) {
                    const response = await fetch(`/api/horario-extendido?medicoId=${medico.id}&offset=1&dias=3`);
                    if (!response.ok) throw new Error(await response.text());
                    const obj = await response.json();
                    const grupos = obj.espaciosAgrupados || [];
                    let fechas = {};
                    for (const g of grupos) {
                        fechas[g.fecha] = g.slots || [];
                    }
                    horariosMap[medico.id] = fechas;
                }
                setHorarios(horariosMap);
                setLoading(false);
            })
            .catch(err => {
                alert('Error al buscar médicos: ' + err.message);
                setLoading(false);
                setMedicos([]);
            });
    };

    useEffect(() => {
        buscarMedicos();
        // eslint-disable-next-line
    }, []);

    const handleToggleHorarios = (medicoId) => {
        setVerHorarios(prev => ({
            ...prev,
            [medicoId]: !prev[medicoId]
        }));
    };

    const handleVerMas = (medicoId, fecha) => {
        setVerMasDias(prev => ({
            ...prev,
            [medicoId]: {
                ...prev[medicoId],
                [fecha]: !prev[medicoId]?.[fecha]
            }
        }));
    };

    // NUEVA función para reservar cita y navegar a ConfirmarCita con todos los datos
    const handleReservarCita = (medico, slot) => {
        navigate('/confirmarCita', {
            state: {
                medicoId: medico.id,
                medicoNombre: medico.nombre,
                medicoFoto: medico.foto,
                fechaHora: `${slot.fecha}T${slot.hora}`,
                ubicacion: medico.localidad,
                medicoEspecialidad: medico.especialidad,
                medicoCostoConsulta: medico.costoConsulta
            }
        });
    };

    return (
        <div className="layout-wrapper">
            <div className="contenido-principal">
                <div className="contenedor">
                    <div className="search-box">
                        <form onSubmit={buscarMedicos}>
                            <input
                                type="text"
                                name="especialidad"
                                placeholder="Especialidad"
                                value={especialidad}
                                onChange={e => setEspecialidad(e.target.value)}
                            />
                            <input
                                type="text"
                                name="ciudad"
                                placeholder="Ciudad"
                                value={ciudad}
                                onChange={e => setCiudad(e.target.value)}
                            />
                            <button type="submit">Buscar</button>
                        </form>
                    </div>
                    {loading && <div style={{ textAlign: "center" }}>Cargando...</div>}
                    {!loading && medicos.length === 0 && (
                        <div style={{ textAlign: "center" }}>
                            <p>No results found for your search.</p>
                        </div>
                    )}
                    {!loading && medicos.map(medico => (
                        <div className="medico-card" key={medico.id}>
                            <div className="medico-header">
                                <div className="medico-info">
                                    <img
                                        src={medico.foto && medico.foto !== "" ? medico.foto : "/images/profile.png"}
                                        alt={medico.nombre}
                                    />
                                    <div>
                                        <b style={{ color: "#2c3e50" }}>{medico.nombre}</b>{" "}
                                        <span style={{ color: "#007bff", fontWeight: "bold" }}>
                                            ₡{medico.costoConsulta}
                                        </span>
                                        <br />
                                        <span>💼 <span>{medico.especialidad}</span></span><br />
                                        <span>📍 <span>{medico.localidad}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {horarios[medico.id] &&
                                Object.values(horarios[medico.id]).every(lista => lista.length === 0) ? (
                                    <p>Sin horarios disponibles en los próximos 3 días.</p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleToggleHorarios(medico.id)}
                                        className="toggle-button"
                                    >
                                        {verHorarios[medico.id] ? "Ocultar horarios ⬆️" : "Ver horarios ⬇️"}
                                    </button>
                                )}
                                {verHorarios[medico.id] && horarios[medico.id] && (
                                    <div className="fechas horarios-toggle" style={{ display: "flex" }}>
                                        {Object.entries(horarios[medico.id]).map(([fecha, lista]) => {
                                            const mostrarTodos = verMasDias[medico.id]?.[fecha] || false;
                                            const mostrar = mostrarTodos ? lista : lista.slice(0, 3);
                                            return (
                                                <div className="fecha-col" key={fecha}>
                                                    <h4>{fecha.split("-").reverse().join("/")}</h4>
                                                    {lista.length === 0 ? (
                                                        <p>No se encontraron resultados para tu búsqueda.</p>
                                                    ) : (
                                                        <>
                                                        {mostrar.map((slot, idx) =>
                                                                slot.disponible ? (
                                                                    <button
                                                                        type="button"
                                                                        className="slot-ext"
                                                                        key={idx}
                                                                        onClick={() => handleReservarCita(medico, slot)}
                                                                    >
                                                                        {slot.horaFormateada || slot.hora}
                                                                    </button>
                                                                ) : (
                                                                    <span className="slot-ext reservado" key={idx}>
                                                                        {slot.horaFormateada || slot.hora}
                                                                    </span>
                                                                )
                                                        )}
                                                            {lista.length > 3 && (
                                                                <button
                                                                    type="button"
                                                                    className="toggle-button"
                                                                    onClick={() => handleVerMas(medico.id, fecha)}
                                                                >
                                                                    {mostrarTodos ? "Ver menos" : "Ver más"}
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <div className="schedule-link">
                                <a href={`/horarioExtendido?medicoId=${medico.id}`}>Ver todos ➜</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BuscarCita;
