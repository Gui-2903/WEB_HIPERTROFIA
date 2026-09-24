import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Users, Search, ChevronRight } from 'lucide-react';
import styles from './Home.module.css'; // Podemos reaproveitar os estilos globais

export default function DashboardPersonal() {
  const [alunos, setAlunos] = useState([]);
  const navigate = useNavigate();
  
  const nomeUsuario = localStorage.getItem('usuarioNome') || 'Professor';
  const personalId = localStorage.getItem('usuarioId');

  useEffect(() => {
    // Trava de segurança: se não tiver logado, expulsa pra tela inicial
    if (!personalId) {
      navigate('/');
      return;
    }

    // Busca a lista de alunos deste Personal no Spring Boot
    api.get(`/usuarios/personal/${personalId}/alunos`)
      .then((response) => setAlunos(response.data))
      .catch((error) => console.error("Erro ao buscar alunos:", error));

  }, [personalId, navigate]);

  const fazerLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const abrirPerfilAluno = (aluno) => {
    // Envia o usuário para a tela do perfil e carrega o objeto do aluno junto!
    navigate('/perfil-aluno', { state: { alunoSelecionado: aluno } });
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* HEADER DO PERSONAL */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Dashboard</p>
          <h2 style={{ margin: '4px 0 0 0', color: '#3b82f6' }}>Fala, Mestre {nomeUsuario}!</h2>
        </div>
        <button 
          onClick={fazerLogout}
          style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Sair
        </button>
      </header>

      {/* CRM - LISTA DE ALUNOS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Users size={24} color="#3b82f6" />
        <h3 style={{ margin: 0 }}>Meus Alunos</h3>
      </div>

      {alunos.length === 0 ? (
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', margin: 0 }}>Você ainda não tem alunos vinculados.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {alunos.map(aluno => (
            <div 
              key={aluno.id}
              onClick={() => abrirPerfilAluno(aluno)}
              style={{ 
                backgroundColor: '#1e293b', 
                padding: '16px', 
                borderRadius: '8px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                borderLeft: '4px solid #22c55e'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{aluno.nome}</div>
              <ChevronRight size={20} color="#94a3b8" />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}