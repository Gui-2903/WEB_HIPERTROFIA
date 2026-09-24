import { useState, useEffect } from 'react';
import styles from './ExercicioCard.module.css';
import LinhaSerie from './LinhaSerie';
import { api } from '../services/api';

export default function ExercicioCard({ exercicio, onSalvarSerie }) {
  const [historicoCarga, setHistoricoCarga] = useState(null);
  const [historicoSeries, setHistoricoSeries] = useState([]); // NOVO: Guarda a lista pura
  const usuarioId = localStorage.getItem('usuarioId');

  useEffect(() => {
    api.get(`/treinos/ultima-carga/${usuarioId}/${exercicio.id}`)
      .then((response) => {
        if (response.status === 200 && response.data && response.data.length > 0) {
          setHistoricoSeries(response.data); // Salva o array (ex: [{peso:80, reps:10}, ...])
          
          const formatado = response.data
            .map((serie, index) => `S${index + 1}: ${serie.peso}kg x ${serie.repeticoes}`)
            .join(' | ');
            
          setHistoricoCarga(formatado);
        }
      })
      .catch((error) => console.log("Erro ao buscar carga", error));
  }, [exercicio.id, usuarioId]);

  return (
    <div className={styles.card}>
      <div className={styles.titulo}>{exercicio.nome}</div>
      
      <div className={styles.historico}>
        📋 {historicoCarga ? `Último Treino: ${historicoCarga}` : `${exercicio.grupoMuscular} | ${exercicio.tipoEquipamento}`}
      </div>

      <div className={styles.cabecalhoGrid}>
        <span>Série</span>
        <span>Peso</span>
        <span>Reps</span>
        <span>RIR</span>
        <span></span>
      </div>

      {/* NOVO: Passando o histórico específico para cada linha (índices 0, 1 e 2) */}
      <LinhaSerie numero="1" exercicioId={exercicio.id} onSalvar={onSalvarSerie} historico={historicoSeries[0]} />
      <LinhaSerie numero="2" exercicioId={exercicio.id} onSalvar={onSalvarSerie} historico={historicoSeries[1]} />
      <LinhaSerie numero="3" exercicioId={exercicio.id} onSalvar={onSalvarSerie} historico={historicoSeries[2]} />
    </div>
  );
}