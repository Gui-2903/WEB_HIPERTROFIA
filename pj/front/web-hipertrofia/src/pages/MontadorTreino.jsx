import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import ModalNovoExercicio from '../components/ModalNovoExercicio';

export default function MontadorTreino() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const aluno = location.state?.alunoSelecionado;

  const [nomeRotina, setNomeRotina] = useState('');
  const [itensTreino, setItensTreino] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

  // Redireciona de volta se a tela for acessada sem um aluno selecionado
  if (!aluno) {
    navigate('/dashboard-personal');
    return null;
  }

  // Recebe os dados processados pelo Modal e adiciona na tela
  const lidarComExercicioSalvo = (exercicioEscolhido) => {
    setItensTreino([
      ...itensTreino, 
      { 
        exercicio: { 
          id: exercicioEscolhido.id, 
          nome: exercicioEscolhido.nome 
        }, 
        observacaoPersonal: "3x10 - ", // Valor padrão para você editar na tela
      }
    ]);
    setModalAberto(false); // Garante que o modal vai fechar ao clicar no exercício!
  };

  const atualizarObservacao = (index, texto) => {
    const novosItens = [...itensTreino];
    novosItens[index].observacaoPersonal = texto;
    setItensTreino(novosItens);
  };

  const removerExercicio = (index) => {
    const novosItens = itensTreino.filter((_, i) => i !== index);
    setItensTreino(novosItens);
  };

  const salvarTreino = () => {
    if (!nomeRotina.trim()) {
      alert("Dê um nome para o treino (ex: Treino A).");
      return;
    }
    if (itensTreino.length === 0) {
      alert("Adicione pelo menos um exercício ao treino.");
      return;
    }

    // Trava de Segurança V1: Impede enviar exercício manual sem ID para o banco
    const exercicioSemId = itensTreino.find(item => !item.exercicio.id);
    if (exercicioSemId) {
      alert(`O exercício "${exercicioSemId.exercicio.nome}" foi criado manualmente.\nNa Versão 2 conectaremos a criação livre ao banco. Por enquanto, selecione as opções pelo Catálogo de Anatomia!`);
      return;
    }

    // Monta o JSON perfeitamente para o Spring Boot
    const payload = {
      usuarioId: aluno.id,
      nome: nomeRotina,
      itens: itensTreino.map((item, index) => ({
        ordem: index + 1,
        observacaoPersonal: item.observacaoPersonal,
        exercicio: { id: item.exercicio.id }
      }))
    };

    api.post('/rotinas', payload)
      .then(() => {
        alert("Treino montado com sucesso!");
        navigate('/perfil-aluno', { state: { alunoSelecionado: aluno } });
      })
      .catch(err => {
        console.error("Erro ao salvar rotina:", err);
        alert("Ocorreu um erro ao salvar o treino.");
      });
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* HEADER DA TELA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <ArrowLeft 
          size={24} 
          color="#94a3b8" 
          style={{ cursor: 'pointer' }} 
          onClick={() => navigate('/perfil-aluno', { state: { alunoSelecionado: aluno } })} 
        />
        <div>
          <h2 style={{ margin: 0, color: '#f8fafc' }}>Montar Novo Treino</h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Aluno: {aluno.nome}</p>
        </div>
      </div>

      {/* INPUT DO NOME DA ROTINA */}
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Nome da Rotina (ex: Treino A - Costas e Bíceps)"
          value={nomeRotina}
          onChange={(e) => setNomeRotina(e.target.value)}
          style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', outline: 'none' }}
        />
      </div>

      {/* LISTA DE EXERCÍCIOS JÁ ADICIONADOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {itensTreino.map((item, index) => (
          <div key={index} style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {index + 1}. {item.exercicio.nome}
              </div>
              <Trash2 
                size={20} 
                color="#ef4444" 
                style={{ cursor: 'pointer' }} 
                onClick={() => removerExercicio(index)} 
              />
            </div>

            <textarea 
              placeholder="💡 Observação/Dica para o aluno (ex: RIR 2, descer lento...)"
              value={item.observacaoPersonal}
              onChange={(e) => atualizarObservacao(index, e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#cbd5e1', fontSize: '0.9rem', resize: 'vertical', minHeight: '60px', outline: 'none' }}
            />
          </div>
        ))}
      </div>

      {/* BOTÃO TRACEJADO QUE ABRE O MODAL */}
      <button 
        onClick={() => setModalAberto(true)}
        style={{ width: '100%', padding: '16px', backgroundColor: '#0f172a', color: '#3b82f6', border: '2px dashed #3b82f6', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}
      >
        <Plus size={24} style={{ marginRight: '8px' }}/> ADICIONAR NOVO EXERCÍCIO
      </button>

      {/* BOTÃO GIGANTE DE SALVAR */}
      <button 
        onClick={salvarTreino}
        style={{ width: '100%', padding: '16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <Save size={24} /> FINALIZAR E SALVAR TREINO
      </button>

      {/* O NOSSO NOVO COMPONENTE (Fica escondido até clicar no botão tracejado) */}
      {/* O COMPONENTE MODAL COM AS PROPS CORRETAS */}
      <ModalNovoExercicio 
        aberto={modalAberto} 
        onFechar={() => setModalAberto(false)} 
        onEscolher={lidarComExercicioSalvo} 
      />

    </div>
  );
}