import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PerfilMedico() {
    const [medico, setMedico] = useState({
        id: '', nombre: '', especialidad: '', costoConsulta: '',
        localidad: '', foto: '', presentacion: ''
    });
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    useEffect(() => {
        // Carga los datos del médico (requiere autenticación)
        fetch('/api/medico/perfil', {
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
        })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => setMedico(data))
            .catch(() => setError('No se pudieron cargar los datos.'));
    }, []);

    const handleChange = e => setMedico({ ...medico, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setExito('');
        try {
            const res = await fetch('/api/medico/perfil', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
                body: JSON.stringify(medico)
            });
            if (!res.ok) {
                setError(await res.text());
                return;
            }
            setExito('Perfil actualizado correctamente.');
        } catch (err) {
            setError('Error al actualizar.');
        }
    };

    return (
        <div className="layout-wrapper">
            <Header />
            <div className="contenido-principal">
                <div className="form-container register-box">
                    <h1>Actualizar <span className="txt-medico">Perfil Médico</span></h1>
                    {exito && <div className="success">{exito}</div>}
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="id" value={medico.id} />

                        <label>Nombre completo:</label>
                        <input type="text" name="nombre" required placeholder="Ej: Dr. Carlos Pérez"
                               value={medico.nombre || ''} onChange={handleChange} />

                        <label>Especialidad:</label>
                        <input type="text" name="especialidad" required placeholder="Ej: Cardiología"
                               value={medico.especialidad || ''} onChange={handleChange} />

                        <label>Costo Consulta:</label>
                        <input type="number" step="0.01" name="costoConsulta" required placeholder="₡35000"
                               value={medico.costoConsulta || ''} onChange={handleChange} />

                        <label>Localidad:</label>
                        <input type="text" name="localidad" required placeholder="Ej: Heredia"
                               value={medico.localidad || ''} onChange={handleChange} />

                        <label>URL Foto:</label>
                        <input type="text" name="foto" placeholder="https://..."
                               value={medico.foto || ''} onChange={handleChange} />

                        <label>Presentación:</label>
                        <textarea name="presentacion" placeholder="Ej: Soy médico general con experiencia en atención pediátrica..."
                                  value={medico.presentacion || ''} onChange={handleChange}></textarea>

                        {error && <div className="error">{error}</div>}
                        <button type="submit" className="btn-primary">Guardar y continuar →</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
