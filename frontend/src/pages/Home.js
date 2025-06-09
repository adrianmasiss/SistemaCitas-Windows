import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="contenido-principal" style={{ textAlign: 'center', padding: '3rem' }}>
            <h1>Bienvenido al Sistema de Citas</h1>
            <div>
                <button className="btn btn-login" onClick={() => navigate('/login')}>🔐 Login</button>
                <button className="btn btn-register" style={{ marginLeft: 10 }} onClick={() => setShowModal(true)}>📝 Register Here</button>
            </div>

            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-registro">
                        <h3>Registrarse como:</h3>
                        <button className="btn btn-login" onClick={() => navigate('/registroPaciente')}>Paciente</button>
                        <button className="btn btn-login" onClick={() => navigate('/registroMedico')}>Médico</button>
                        <button style={{ marginTop: 16 }} className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
