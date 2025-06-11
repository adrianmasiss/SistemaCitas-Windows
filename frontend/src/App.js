import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BuscarCita from './pages/BuscarCita';
import Login from './pages/Login';
import RegistroMedico from './pages/RegistroMedico';
import MensajeRegistro from "./pages/MensajeRegistro";
import RegistroPaciente from "./pages/RegistroPaciente";
import AdminMedicos from "./pages/AdminMedicos";
import GestionCitasMedico from "./pages/gestionCitasMedico";
import HorarioExtendido from "./pages/HorarioExtendido";
import ConfigurarHorario from './pages/ConfigurarHorario';
import ConfirmarCita from './pages/ConfirmarCita';
import CitaConfirmada from './pages/CitaConfirmada';
import HistoricoCitas from './pages/HistoricoCitas';
import PerfilMedico from './pages/PerfilMedico';
import DetalleCita from './pages/DetalleCita';






function App() {

    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/buscarCita" element={<BuscarCita />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registroMedico" element={<RegistroMedico />} />
                    <Route path="/registroPaciente" element={<RegistroPaciente />} />
                    <Route path="/MensajeRegistro" element={<MensajeRegistro />} />
                    <Route path="/admin/medicos" element={<AdminMedicos />} />
                    <Route path="/medico/gestionCitas" element={<GestionCitasMedico />} />
                    <Route path="/horarioExtendido" element={<HorarioExtendido />} />
                    <Route path="/medico/configurarHorario" element={<ConfigurarHorario />} />
                    <Route path="/confirmarCita" element={<ConfirmarCita />} />
                    <Route path="/citaConfirmada" element={<CitaConfirmada />} />
                    <Route path="/historicoCitas" element={<HistoricoCitas />} />
                    <Route path="/medico/perfil" element={<PerfilMedico />} />
                    <Route path="/detalleCita" element={<DetalleCita />} />
                    {/* Aquí irán más páginas */}
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;