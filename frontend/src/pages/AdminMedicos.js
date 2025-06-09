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
            }
        } catch (err) {
            setMensaje('Error al cargar la lista.');
        }
    };

    useEffect(() => { fetchMedicos(); }, []);

    const aprobarMedico = async (id) => {
        try {
            const res = await fetch(`/api/admin/aprobar?medicoId=${id}`, {
                method: 'POST',
                headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
            });
            if (res.ok) {
                setMensaje('Médico aprobado correctamente.');
                fetchMedicos();
            } else {
                setMensaje(await res.text());
            }
        } catch {
            setMensaje('Error al aprobar médico.');
        }
    };

    return (
        <div className="layout-wrapper">
            <div className="contenido-principal">
                <div className="contenedor">
                    <h1 style={{textAlign:"center", color:"#2c3e50", marginBottom:"1rem"}}>
                        👨‍⚕️ Administración de Médicos
                    </h1>
                    {mensaje && <div className="success-message" style={{textAlign:"center"}}>{mensaje}</div>}
                    <div className="admin-table" style={{overflowX:"auto"}}>
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Especialidad</th>
                                <th>Estado</th>
                                <th>Acción</th>
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
                                            ? <span className="hist-badge ATENDIDA">Aprobado</span>
                                            : <span className="hist-badge PENDIENTE">Pendiente</span>
                                        }
                                    </td>
                                    <td>
                                        {!medico.aprobado
                                            ? <button className="btn-aprobar" onClick={() => aprobarMedico(medico.id)}>
                                                <i className="fa fa-check"></i> Aprobar
                                            </button>
                                            : <span className="ya-aprobado" style={{fontSize:"1.2rem", color:"green"}}>✔</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
