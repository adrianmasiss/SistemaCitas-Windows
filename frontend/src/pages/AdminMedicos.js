import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminMedicos() {
    const [medicos, setMedicos] = useState([]);
    const [mensaje, setMensaje] = useState('');

    const fetchMedicos = async () => {
        try {
            const res = await fetch('/api/admin/medicos', {
                headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
            });
            if (res.ok) {
                setMedicos(await res.json());
            } else {
                setMensaje('No se pudieron obtener los datos.');
            }
        } catch {
            setMensaje('Error al cargar la lista.');
        }
    };

    useEffect(() => {
        fetchMedicos();
    }, []);

    const aprobarMedico = async (id) => {
        try {
            const res = await fetch(`/api/admin/aprobar?medicoId=${id}`, {
                method: 'POST',
                headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
            });
            if (res.ok) {
                setMensaje('✅ Médico aprobado correctamente.');
                fetchMedicos();
            } else {
                setMensaje(await res.text());
            }
        } catch {
            setMensaje('Error al aprobar médico.');
        }
    };

    return (
        <>
            <main className="layout-wrapper">
                <div className="contenido-principal">
                    <div className="admin-medicos-card">
                        <h2 className="admin-table-title">👨‍⚕️ Administración de Médicos</h2>
                        {mensaje && <div className="success-message" style={{ textAlign: "center" }}>{mensaje}</div>}
                        <div className="admin-table" style={{ overflowX: "auto" }}>
                            <table className="tabla-medicos">
                                <thead>
                                <tr>
                                    <th><i className="fa fa-id-card"></i> ID</th>
                                    <th><i className="fa fa-user-md"></i> Nombre</th>
                                    <th><i className="fa fa-stethoscope"></i> Especialidad</th>
                                    <th><i className="fa fa-info-circle"></i> Estado</th>
                                    <th><i className="fa fa-cogs"></i> Acción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {medicos.map(medico => (
                                    <tr key={medico.id}>
                                        <td>{medico.id}</td>
                                        <td>{medico.nombre}</td>
                                        <td>{medico.especialidad}</td>
                                        <td>
                                            {medico.aprobado
                                                ? <span className="badge-estado badge-ATENDIDA">
                                                        <i className="fa fa-check-circle"></i> Aprobado
                                                      </span>
                                                : <span className="badge-estado badge-PENDIENTE">
                                                        <i className="fa fa-clock"></i> Pendiente
                                                      </span>}
                                        </td>
                                        <td>
                                            {!medico.aprobado
                                                ? <button className="btn-aprobar" onClick={() => aprobarMedico(medico.id)}>
                                                    <i className="fa fa-user-check"></i> Aprobar
                                                </button>
                                                : <span className="ya-aprobado" style={{ fontSize: "1.3rem", color: "green" }}>
                                                        <i className="fa fa-check-double"></i>
                                                      </span>}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
