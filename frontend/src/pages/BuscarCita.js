import React, { useState, useEffect } from "react";

function BuscarCita() {
    const [especialidad, setEspecialidad] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [horarios, setHorarios] = useState({});
    const [verHorarios, setVerHorarios] = useState({}); // Controlar expansión por médico

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
                const ct = res.headers.get('content-type') || '';
                return ct.includes('application/json') ? res.json() : [];
            })
            .then(async data => {
                setMedicos(data);
                // Cargar horarios solo para los médicos encontrados (para próximos 3 días)
                const baseDate = new Date();
                let horariosMap = {};
                for (let medico of data) {
                    const response = await fetch(`/api/horario-extendido?medicoId=${medico.id}&offset=1&dias=3`);                    if (!response.ok) throw new Error(await response.text());
                    const ct2 = response.headers.get('content-type') || '';
                    const obj = ct2.includes('application/json') ? await response.json() : {};
                    const grupos = obj.espaciosAgrupados || [];
                    // Agrupar slots por fecha
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

    // Al montar, buscar todos los médicos aprobados
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

    const verMas = (medicoId, fecha) => {
        setHorarios(h => {
            // Mostramos todos los horarios de ese día
            let nuevos = { ...h };
            if (!nuevos[medicoId][fecha].some(slot => slot._verMas)) {
                nuevos[medicoId][fecha] = nuevos[medicoId][fecha].map((slot, idx) => ({ ...slot, _mostrar: true }));
            } else {
                nuevos[medicoId][fecha] = nuevos[medicoId][fecha].map((slot, idx) =>
                    idx < 3 ? { ...slot, _mostrar: true } : { ...slot, _mostrar: false }
                );
            }
            return nuevos;
        });
    };

    return (
        <div className="layout-wrapper">
            {/* <Header /> */}
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
                                        {Object.entries(horarios[medico.id]).map(([fecha, lista]) => (
                                            <div className="fecha-col" key={fecha}>
                                                <h4>{fecha.split("-").reverse().join("/")}</h4>
                                                {lista.length === 0 ? (
                                                    <p>No se encontraron resultados para tu búsqueda.</p>
                                                ) : (
                                                    <>
                                                        {lista.slice(0, 3).map((slot, idx) =>
                                                            <div className={`slot ${slot.disponible ? "disponible" : "reservado"}`} key={idx}>
                                                                {slot.disponible ? (
                                                                    <a
                                                                        href={`/confirmarCita?medicoId=${medico.id}&fechaHora=${slot.fecha}T${slot.hora}`}
                                                                    >
                                                                        {slot.hora.slice(0, 5)}
                                                                    </a>
                                                                ) : (
                                                                    <span>{slot.hora.slice(0, 5)}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {lista.length > 3 && (
                                                            <button
                                                                type="button"
                                                                className="toggle-button"
                                                                onClick={() => verMas(medico.id, fecha)}
                                                            >
                                                                Ver más
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))}
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
            {/* <Footer /> */}
        </div>
    );
}

export default BuscarCita;
