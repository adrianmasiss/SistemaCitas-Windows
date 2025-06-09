import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


export default function Login() {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState({ username: '', clave: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const logout = params.get('logout');
    const loginError = params.get('error');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, clave: user.clave })
            });
            if (res.status === 401) return setError('Usuario o contraseña inválidos.');
            if (!res.ok) throw new Error(await res.text());

            const data = await res.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('nombre', data.nombre);
            // Guardar el identificador del usuario para usarlo en otras vistas
            localStorage.setItem('usuarioId', data.usuarioId);

            if (data.rol === 'ADMIN') navigate('/admin/medicos');
            else if (data.rol === 'MEDICO') navigate('/medico/gestionCitas');
            else navigate('/buscarCita');
        } catch (err) {
            setError('Hubo un error inesperado. Intenta de nuevo.');
        }
    };

    return (
        <div className="login-bg">

            <div className="login-center">
                <div className="login-card">
                    <h2 className="login-title">Login</h2>
                    <img
                        src="/images/194_210_MjAyMC0wNS0wNiAwNzoyMDoxOQ==_dummy-male-img-1.png"
                        alt="User Icon"
                        className="login-avatar"
                    />
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <span className="input-icon"><i className="fa fa-user"></i></span>
                            <input
                                type="text"
                                name="username"
                                placeholder="User id"
                                required
                                value={user.username}
                                onChange={e => setUser({...user, username: e.target.value})}
                                autoFocus
                            />
                        </div>
                        <div className="input-group">
                            <span className="input-icon"><i className="fa fa-key"></i></span>
                            <input
                                type="password"
                                name="clave"
                                placeholder="User Password"
                                required
                                value={user.clave}
                                onChange={e => setUser({...user, clave: e.target.value})}
                            />
                        </div>
                        {error && <div className="error-msg">{error}</div>}
                        {loginError && <div className="error-msg">Usuario o contraseña inválidos.</div>}
                        {logout && <div className="logout-msg">Has cerrado sesión correctamente.</div>}
                        <button type="submit" className="btn-primary">Log in</button>
                    </form>
                    <div className="register-link">
                        <p>Don't have an account?{' '}
                            <span className="register-text" style={{cursor: "pointer"}}
                                  onClick={() => setShowModal(true)}>Register here</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* MODAL de selección de tipo de usuario */}
            {showModal &&
                <div className="modal" style={{display: 'block'}}>
                    <div className="modal-registro">
                        <h3>Registrarse como:</h3>
                        <button className="modal-btn" onClick={() => navigate('/registroPaciente')}>Paciente</button>
                        <button className="modal-btn" onClick={() => navigate('/registroMedico')}>Médico</button>
                        <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            }
        </div>
    );
}
