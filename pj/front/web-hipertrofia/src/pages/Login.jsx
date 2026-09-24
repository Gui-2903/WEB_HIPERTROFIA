import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();
  
  api.post('/usuarios/login', { email, senha })
    .then((response) => {
      // 1. Extrai tudo que o Java devolveu
      const { id, nome, perfil } = response.data;
      
      // 2. Salva no cofre do navegador (agora guardando o PERFIL também)
      localStorage.setItem('usuarioId', id);
      localStorage.setItem('usuarioNome', nome);
      localStorage.setItem('usuarioPerfil', perfil); // NOVO!

      // 3. A INTELIGÊNCIA DE ROTEAMENTO
      if (perfil === 'PERSONAL') {
        navigate('/dashboard-personal'); // Vai para a mesa de comando
      } else {
        navigate('/home'); // Aluno padrão vai para o vestiário/treino
      }
    })
    .catch((error) => {
      console.error("Erro no login:", error);
      alert("E-mail ou senha incorretos.");
    });
};

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
        <div className={styles.title}>GYNGUI</div>
        
        {erro && <div className={styles.error}>{erro}</div>}
        
        <input 
          type="email" 
          className={styles.inputBox} 
          placeholder="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          className={styles.inputBox} 
          placeholder="Senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          required 
        />
        
        <button type="submit" className={styles.btnSubmit}>ENTRAR</button>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Ainda não tem uma conta?</p>
          <button 
            onClick={() => navigate('/cadastro')}
            style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
          >
            Cadastre-se agora
          </button>
        </div>
      </form>
    </div>
  );
}