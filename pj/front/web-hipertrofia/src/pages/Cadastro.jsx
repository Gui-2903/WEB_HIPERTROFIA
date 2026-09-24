import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, User, UserCheck, Dumbbell, Save } from 'lucide-react';

export default function Cadastro() {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('ALUNO'); // Padrão é Aluno
  const [carregando, setCarregando] = useState(false);

  const realizarCadastro = async (e) => {
    e.preventDefault();
    
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      alert("Preencha todos os campos!");
      return;
    }

    setCarregando(true);

    try {
      // O payload exato que o seu Spring Boot espera
      const payload = {
        nome: nome,
        email: email,
        senha: senha,
        perfil: perfil
      };

      await api.post('/usuarios', payload);
      
      alert("Conta criada com sucesso! Faça seu login.");
      navigate('/'); // Volta para a tela de Login

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Ocorreu um erro ao criar a conta. Verifique o console.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* CABEÇALHO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <ArrowLeft 
            size={24} 
            color="#94a3b8" 
            style={{ cursor: 'pointer' }} 
            onClick={() => navigate('/')} 
          />
          <div>
            <h2 style={{ margin: 0, color: '#f8fafc' }}>Criar Conta</h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Junte-se ao GYNGUI</p>
          </div>
        </div>

        <form onSubmit={realizarCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SELETOR DE PERFIL */}
          <div>
            <label style={styles.label}>Qual é o seu perfil?</label>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                type="button"
                onClick={() => setPerfil('ALUNO')}
                style={perfil === 'ALUNO' ? styles.btnPerfilAtivo : styles.btnPerfilInativo}
              >
                <UserCheck size={20} /> Sou Aluno
              </button>
              <button 
                type="button"
                onClick={() => setPerfil('PERSONAL')}
                style={perfil === 'PERSONAL' ? styles.btnPerfilAtivo : styles.btnPerfilInativo}
              >
                <Dumbbell size={20} /> Sou Personal
              </button>
            </div>
          </div>

          {/* DADOS BÁSICOS */}
          <div>
            <label style={styles.label}>Nome Completo</label>
            <input 
              type="text" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joao@email.com"
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          {/* BOTÃO DE CADASTRO */}
          <button 
            type="submit" 
            disabled={carregando}
            style={{...styles.btnSalvar, opacity: carregando ? 0.7 : 1, marginTop: '12px'}}
          >
            {carregando ? 'Criando conta...' : (
              <><Save size={20}/> CRIAR MINHA CONTA</>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' },
  card: { backgroundColor: '#1e293b', width: '100%', maxWidth: '400px', padding: '32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
  label: { color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'bold' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '1rem', outline: 'none', marginTop: '8px' },
  btnPerfilAtivo: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  btnPerfilInativo: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#0f172a', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  btnSalvar: { width: '100%', padding: '16px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }
};