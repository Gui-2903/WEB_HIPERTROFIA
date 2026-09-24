import { useMemo, useState, useEffect } from 'react';
import MapaAnatomico, { GRUPOS_MUSCULARES } from './Anatomia/MapaAnatomico';
import { api } from '../services/api';
import './Anatomia/MapaAnatomico.css';

const TODOS = 'Todos';
const ALIAS_GRUPOS = {};

export default function ModalNovoExercicio({ aberto, onFechar, onEscolher }) {
  const [grupoFiltro, setGrupoFiltro] = useState(TODOS);
  const [visaoFrontal, setVisaoFrontal] = useState(true);
  const [busca, setBusca] = useState('');
  
  // Estados para API e Banco de Dados
  const [exercicios, setExercicios] = useState([]);
  const [modoCriacao, setModoCriacao] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoGrupo, setNovoGrupo] = useState('Peitoral');
  const [salvando, setSalvando] = useState(false);

  // Busca do Spring Boot ao abrir o modal
  useEffect(() => {
    if (aberto) {
      api.get('/exercicios')
        .then(res => setExercicios(res.data))
        .catch(err => console.error("Erro ao buscar exercícios:", err));
    }
  }, [aberto]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return exercicios.filter(
      (ex) =>
        (grupoFiltro === TODOS || ex.grupoMuscular === grupoFiltro) &&
        (!termo || ex.nome.toLowerCase().includes(termo)),
    );
  }, [exercicios, grupoFiltro, busca]);

  // Função para salvar direto no banco de dados
  const criarExercicioNoBanco = async () => {
    if (!novoNome.trim()) return;
    setSalvando(true);
    try {
      const response = await api.post('/exercicios', {
        nome: novoNome,
        grupoMuscular: novoGrupo
      });
      // Atualiza a lista local instantaneamente
      setExercicios(prev => [...prev, response.data]);
      setModoCriacao(false);
      setNovoNome('');
      setGrupoFiltro(response.data.grupoMuscular);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar exercício no banco de dados.");
    } finally {
      setSalvando(false);
    }
  };

  if (!aberto) return null;

  const nomesDosChips = GRUPOS_MUSCULARES.map((g) => ALIAS_GRUPOS[g] ?? g);

  return (
    <div className="modal-overlay" style={styles.overlay} role="dialog" aria-modal="true">
      <div className="modal-conteudo" style={styles.modal}>
        <header className="modal-topo" style={styles.header}>
          <h2 style={{ margin: 0, color: '#f8fafc' }}>Catálogo de Exercícios</h2>
          <button type="button" onClick={onFechar} style={styles.closeBtn}>×</button>
        </header>

        <div className="modal-corpo" style={{ padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          
          {/* Lado Esquerdo: Mapa Anatômico */}
          <section className="modal-mapa" style={{ flex: '1 1 300px', backgroundColor: '#1e293b', borderRadius: '12px', padding: '16px' }}>
            <div role="group" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <button style={visaoFrontal ? styles.btnAtivo : styles.btnInativo} onClick={() => setVisaoFrontal(true)}>Frente</button>
              <button style={!visaoFrontal ? styles.btnAtivo : styles.btnInativo} onClick={() => setVisaoFrontal(false)}>Costas</button>
            </div>
            
            <MapaAnatomico
              grupoFiltro={grupoFiltro}
              onSelecionarGrupo={setGrupoFiltro}
              visaoFrontal={visaoFrontal}
              valorTodos={TODOS}
              aliasGrupos={ALIAS_GRUPOS}
            />
          </section>

          {/* Lado Direito: Lista e Criação */}
          <section className="modal-lista" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Alternar entre Buscar e Criar */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={!modoCriacao ? styles.btnAtivo : styles.btnInativo} onClick={() => setModoCriacao(false)}>Buscar Existente</button>
              <button style={modoCriacao ? styles.btnAtivo : styles.btnInativo} onClick={() => setModoCriacao(true)}>+ Criar Novo</button>
            </div>

            {!modoCriacao ? (
              <>
                <input
                  type="search"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar exercício..."
                  style={styles.input}
                />
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[TODOS, ...nomesDosChips].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGrupoFiltro(g)}
                      style={grupoFiltro === g ? styles.chipAtivo : styles.chipInativo}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto', borderTop: '1px solid #334155', paddingTop: '16px' }}>
                  {filtrados.length === 0 ? (
                    <p style={{ color: '#94a3b8' }}>Nenhum exercício cadastrado neste grupo.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {filtrados.map((ex) => (
                        <li key={ex.id}>
                          <button style={styles.itemLista} onClick={() => onEscolher(ex)}>
                            <span style={{ fontWeight: 'bold' }}>{ex.nome}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ex.grupoMuscular}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px' }}>
                <label style={styles.label}>Nome do Exercício Novo</label>
                <input 
                  type="text" 
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Rosca Invertida..."
                  style={styles.input}
                />
                <label style={styles.label}>Grupo Muscular (Alvo)</label>
                <select value={novoGrupo} onChange={(e) => setNovoGrupo(e.target.value)} style={styles.input}>
                  {nomesDosChips.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <button 
                  onClick={criarExercicioNoBanco} 
                  style={{...styles.btnSalvar, opacity: novoNome ? 1 : 0.5}}
                  disabled={!novoNome || salvando}
                >
                  {salvando ? 'Salvando...' : 'Salvar no Banco'}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// Estilos complementares
const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' },
  modal: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', width: '100%', maxWidth: '800px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
  header: { padding: '20px 24px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a' },
  closeBtn: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' },
  btnAtivo: { padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnInativo: { padding: '8px 16px', backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' },
  chipAtivo: { padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer' },
  chipInativo: { padding: '6px 12px', backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '1rem', outline: 'none' },
  label: { color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'bold' },
  itemLista: { width: '100%', padding: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#f8fafc', cursor: 'pointer', textAlign: 'left' },
  btnSalvar: { padding: '12px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};