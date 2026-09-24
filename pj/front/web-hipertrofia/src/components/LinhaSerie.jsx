import { useState } from 'react';
import styles from './LinhaSerie.module.css';
import { Check } from 'lucide-react';

// NOVO: Adicionado 'historico' nas props
export default function LinhaSerie({ numero, exercicioId, onSalvar, historico }) {
  const [peso, setPeso] = useState('');
  const [reps, setReps] = useState('');
  const [rir, setRir] = useState('');
  const [feita, setFeita] = useState(false);

  const handleCheck = () => {
    if (!peso || !reps) return; 
    
    onSalvar({
      exercicioId: exercicioId,
      tipoSerie: "TRABALHO",
      peso: parseFloat(peso),
      repeticoes: parseInt(reps),
      rir: parseInt(rir) || 0,
      tempoDescansoSegundos: 90
    });
    
    setFeita(true);
  };

  // NOVO: Lógica para decidir o texto de fundo
  const placeholderPeso = historico ? historico.peso : "kg";
  const placeholderReps = historico ? historico.repeticoes : "reps";

  return (
    <div className={styles.row}>
      <div className={styles.numero}>{numero}</div>
      
      <input 
        type="number" 
        className={styles.inputBox} 
        placeholder={placeholderPeso} 
        value={peso} 
        onChange={(e) => setPeso(e.target.value)} 
        disabled={feita} 
      />
      
      <input 
        type="number" 
        className={styles.inputBox} 
        placeholder={placeholderReps} 
        value={reps} 
        onChange={(e) => setReps(e.target.value)} 
        disabled={feita} 
      />
      
      <input 
        type="number" 
        className={styles.inputBox} 
        placeholder="RIR" 
        value={rir} 
        onChange={(e) => setRir(e.target.value)} 
        disabled={feita} 
      />
      
      <button 
        className={styles.btnCheck} 
        onClick={handleCheck}
        style={{ backgroundColor: feita ? '#475569' : '#22c55e' }}
        disabled={feita}
      >
        <Check size={20} />
      </button>
    </div>
  );
}