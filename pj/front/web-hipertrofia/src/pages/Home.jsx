import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Dumbbell } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const [historico, setHistorico] = useState([]);
  const [rotinas, setRotinas] = useState([]); 
  const navigate = useNavigate();
  
  const nomeUsuario = localStorage.getItem('usuarioNome') || 'Atleta';
  const usuarioId = localStorage.getItem('usuarioId');

  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }

    api.get(`/treinos/historico/${usuarioId}`)
      .then((response) => setHistorico(response.data))
      .catch((error) => console.error("Erro histórico:", error));

    api.get(`/rotinas/usuario/${usuarioId}`)
      .then((response) => setRotinas(response.data))
      .catch((error) => console.error("Erro rotinas:", error));

  }, [usuarioId, navigate]);

  const iniciarRotina = (rotina) => {
    navigate('/combate', { state: { rotinaSelecionada: rotina } });
  };

  // 🛑 A MÁGICA ACONTECE AQUI: 
  // Filtra jogando fora as rotinas velhas ou vazias (que não tem itens)
  const rotinasValidas = rotinas.filter(rotina => rotina.itens && rotina.itens.length > 0);

  return (
    <div className={styles.container}>
      <div className={styles.saudacao}>Fala, {nomeUsuario}!</div>
      
      <div className={styles.sessaoTitulo}>Escolha seu Treino Hoje</div>

      {/* Agora usamos o array filtrado (rotinasValidas) para desenhar os botões */}
      {rotinasValidas.length === 0 ? (
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Nenhuma rotina válida encontrada.</p>
      ) : (
        rotinasValidas.map((rotina) => (
          <button 
            key={rotina.id} 
            className={styles.btnIniciar} 
            onClick={() => iniciarRotina(rotina)}
          >
            <Dumbbell size={24} />
            {rotina.nome}
          </button>
        ))
      )}

      <div className={styles.sessaoTitulo}>Seus Últimos Treinos</div>
      
      {historico.length === 0 ? (
        <p style={{ color: '#64748b' }}>Nenhum treino registrado ainda.</p>
      ) : (
        historico.map((treino) => (
          <div key={treino.sessaoId} className={styles.cardTreino}>
            <div className={styles.data}>
              {new Date(treino.data).toLocaleDateString('pt-BR')}
            </div>
            <div className={styles.tonelagem}>
              {treino.tonelagemTotal} kg
            </div>
          </div>
        ))
      )}
    </div>
  );
}