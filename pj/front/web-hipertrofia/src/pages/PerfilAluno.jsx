import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User, Dumbbell, PlusCircle, ArrowLeft } from 'lucide-react';

export default function PerfilAluno() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recebe o aluno clicado lá do DashboardPersonal
  const aluno = location.state?.alunoSelecionado;
  
  const [rotinas, setRotinas] = useState([]);

  useEffect(() => {
    if (!aluno) {
      navigate('/dashboard-personal');
      return;
    }

    // Busca as rotinas que já existem para este aluno
    api.get(`/rotinas/usuario/${aluno.id}`)
      .then((response) => setRotinas(response.data))
      .catch((error) => console.error("Erro rotinas do aluno:", error));

  }, [aluno, navigate]);

  // Impede quebra de tela
  if (!aluno) return null; 

  const rotinasValidas = rotinas.filter(r => r.itens && r.itens.length > 0);

  return (
    <div style={{ padding: '24px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* CABEÇALHO COM BOTÃO VOLTAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <ArrowLeft 
          size={24} 
          color="#94a3b8" 
          style={{ cursor: 'pointer' }} 
          onClick={() => navigate('/dashboard-personal')} 
        />
        <div>
          <h2 style={{ margin: 0, color: '#f8fafc' }}>{aluno.nome}</h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Visualização do Treinador</p>
        </div>
      </div>

      {/* TAB DE ROTINAS (TREINOS) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dumbbell size={20} color="#3b82f6" /> Treinos Atuais
        </h3>
        
        {/* BOTÃO PARA A TELA 4 (MONTADOR DE TREINO) */}
        <button 
          onClick={() => navigate('/montador-treino', { state: { alunoSelecionado: aluno } })}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <PlusCircle size={18} /> Novo Treino
        </button>
      </div>

      {/* LISTA DE ROTINAS */}
      {rotinasValidas.length === 0 ? (
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', margin: 0 }}>Nenhum treino montado para {aluno.nome}.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {rotinasValidas.map((rotina) => (
            <div key={rotina.id} style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{rotina.nome}</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {rotina.itens ? rotina.itens.length : 0} exercícios cadastrados
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}