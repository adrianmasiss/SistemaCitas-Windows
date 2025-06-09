import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ErrorPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Recibe error por state o props
    const { error } = location.state || { error: "Ocurrió un error inesperado" };

    return (
        <div className="layout-wrapper">
            <h1>Ocurrió un error</h1>
            <p>{error}</p>
            <button className="btn-volver-ext" onClick={() => navigate('/buscarCita')}>
                Volver a búsqueda de citas
            </button>
        </div>
    );
}
