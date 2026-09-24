import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ExercicioCard from '../components/ExercicioCard';
import styles from './Combate.module.css'; 

export default function Combate() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Pega a rotina enviada pela tela Home
  const rotinaAtual = location.state?.rotinaSelecionada; 
  
  // 2. Extrai os ITENS da rotina e ordena para aparecerem na ordem certa (1, 2, 3...)
  const [itensRotina] = useState(() => {
    const itens = rotinaAtual?.itens || [];
    return itens.sort((a, b) => a.ordem - b.ordem);
  });

  // 3. Estados de controle de treino e navegação entre exercícios
  const [exercicioAtualIndex, setExercicioAtualIndex] = useState(0);
  const [seriesFeitas, setSeriesFeitas] = useState([]);
  
  // Estados do Cronômetro
  const [tempoDescanso, setTempoDescanso] = useState(0);
  const timerRef = useRef(null);

  // Efeito do Cronômetro: Roda a cada 1 segundo quando o tempo > 0
  useEffect(() => {
    if (tempoDescanso > 0) {
      timerRef.current = setInterval(() => {
        setTempoDescanso((prev) => prev - 1);
      }, 1000);
    } else if (tempoDescanso === 0 && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [tempoDescanso]);

  // Disparado quando o usuário clica no "Check" verde de uma série
  const handleSalvarSerie = (serie) => {
    setSeriesFeitas((prev) => [...prev, serie]);
    setTempoDescanso(serie.tempoDescansoSegundos || 90); // Inicia o relógio
  };

  // Botão "Próximo Exercício"
  const avancarExercicio = () => {
    if (exercicioAtualIndex < itensRotina.length - 1) {
      setExercicioAtualIndex((prev) => prev + 1);
    }
  };

  // Botão "Finalizar Treino"
  const finalizarTreino = () => {
    if (seriesFeitas.length === 0) {
      alert("Você precisa fazer pelo menos uma série para salvar o treino!");
      return;
    }

    const payload = {
      usuarioId: localStorage.getItem('usuarioId'),
      rpeGeral: 8,
      pesoCorporalDia: 80.0,
      series: seriesFeitas
    };
    
    api.post('/treinos', payload)
      .then(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        navigate('/home'); 
      })
      .catch((error) => {
        console.error("Erro ao salvar treino:", error);
        alert("Ocorreu um erro ao salvar. Verifique a conexão.");
      });
  };

  // Trava de segurança: Se a tela carregar sem rotina (ex: usuário atualizou a página)
  if (!rotinaAtual || itensRotina.length === 0) {
    return (
      <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
        <h2 style={{ color: '#f8fafc', textAlign: 'center', marginBottom: '20px' }}>
          Nenhum treino selecionado ou rotina vazia.
        </h2>
        <button style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold'}} onClick={() => navigate('/home')}>
          Voltar para Home
        </button>
      </div>
    );
  }

  // 4. Pega o Item Atual e extrai o Exercício que está dentro dele
  const itemAtual = itensRotina[exercicioAtualIndex];
  const exercicioAtual = itemAtual?.exercicio;

  // Formata o relógio (ex: 90 vira 01:30)
  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const seg = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
  };

  return (
    <div className={styles.container}>
      {/* CABEÇALHO */}
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #334155', marginBottom: '24px'}}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f8fafc' }}>
          {rotinaAtual.nome}
        </div>
        {tempoDescanso > 0 && (
          <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '1.1rem' }}>
            ⏱️ {formatarTempo(tempoDescanso)}
          </div>
        )}
      </header>

      <main style={{ paddingBottom: '80px' }}>
        
        {/* CAIXA DE DICA DO TREINADOR */}
        {itemAtual?.observacaoPersonal && (
          <div style={{
            backgroundColor: '#1e293b',
            borderLeft: '4px solid #3b82f6',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '0.9rem',
            color: '#cbd5e1'
          }}>
            💡 <strong>Dica do Treinador:</strong> {itemAtual.observacaoPersonal}
          </div>
        )}

        {/* CARD DO EXERCÍCIO (Carrega a carga anterior e as linhas de input) */}
        {exercicioAtual && (
          <ExercicioCard 
            exercicio={exercicioAtual} 
            onSalvarSerie={handleSalvarSerie} 
          />
        )}

        {/* CONTROLES DE NAVEGAÇÃO DA TELA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          <button 
            onClick={avancarExercicio}
            disabled={exercicioAtualIndex === itensRotina.length - 1}
            style={{ 
              padding: '16px',
              backgroundColor: '#475569',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              opacity: exercicioAtualIndex === itensRotina.length - 1 ? 0.3 : 1,
              cursor: exercicioAtualIndex === itensRotina.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Próximo Exercício ➔
          </button>

          <button 
            onClick={finalizarTreino}
            style={{
              padding: '16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            FINALIZAR TREINO
          </button>
        </div>
      </main>
    </div>
  );
}