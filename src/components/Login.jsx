// src/components/Login.jsx
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { authService } from '../services/auth';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  const fullText = 'Bem-Vindo a Fast Route';

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(typingInterval);
    }, 80);
    return () => clearInterval(typingInterval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const response = await authService.login(formData.email, formData.senha);
        console.log('Login realizado:', response);
        
        // Callback para notificar o componente pai
        onLoginSuccess(response.user);
        
    } catch (err) {
        console.error('Erro no login:', err.message);
        
        // Tratamento específico baseado no tipo de erro
        if (err.response) {
        const status = err.response.status;
        const errorMessage = err.response.data?.error;
        
        switch (status) {
            case 404:
            setError('Email ou senha incorretos. Verifique suas credenciais.');
            break;
            case 401:
            setError('Email ou senha incorretos. Tente novamente.');
            break;
            case 400:
            if (errorMessage?.includes('email')) {
                setError('Por favor, digite um email válido.');
            } else if (errorMessage?.includes('senha')) {
                setError('A senha é obrigatória.');
            } else {
                setError('Dados inválidos. Verifique os campos preenchidos.');
            }
            break;
            case 429:
            setError('Muitas tentativas de login. Tente novamente em alguns minutos.');
            break;
            case 500:
            setError('Erro no servidor. Tente novamente em alguns instantes.');
            break;
            default:
            setError('Erro inesperado. Tente novamente ou contate o suporte.');
        }
        } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network')) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
        } else if (err.code === 'TIMEOUT' || err.message.includes('timeout')) {
        setError('Tempo limite excedido. Verifique sua conexão e tente novamente.');
        } else {
        // Erro genérico ou sem resposta do servidor
        setError('Não foi possível conectar ao servidor. Tente novamente.');
        }
    } finally {
        setLoading(false);
    }
    };

  const navigateToRegister = () => {
    // Esta função será chamada quando o usuário clicar em "Criar conta"
    // Você pode implementar navegação aqui se estiver usando React Router
    window.location.href = '/cadastro'; // Temporário - substitua por navegação adequada
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/background_principal.jpeg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 100%',
      }}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-2 leading-tight">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-4">
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>
        </div>
        
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Acesso ao Sistema
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              disabled={loading}
              className="w-full px-4 py-2 mt-1 rounded-lg bg-blue-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50" 
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required 
                disabled={loading}
                className="w-full px-4 py-2 mt-1 rounded-lg bg-blue-50 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 pr-10" 
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center space-x-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            <span>{loading ? 'Entrando...' : 'Entrar'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Não tem uma conta?{' '}
            <button 
              onClick={navigateToRegister}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Criar conta
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Para fins de teste, use: admin@fastroute.com / password
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;