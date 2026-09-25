import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Combate from './pages/Combate';
import DashboardPersonal from './pages/DashboardPersonal';
import PerfilAluno from './pages/PerfilAluno';
import MontadorTreino from './pages/MontadorTreino';
import Cadastro from './pages/Cadastro';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/combate" element={<Combate />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/dashboard-personal" element={<DashboardPersonal />} />
        <Route path="/perfil-aluno" element={<PerfilAluno />} />
        <Route path="/montador-treino" element={<MontadorTreino />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}