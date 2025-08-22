// src/components/Register.jsx
import { useState } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt, FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { authService } from '../services/auth';

function Register({ onRegisterSuccess, onBackToLogin }) {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Formatação automática
    if (name === 'cpf') {
      value = formatCPF(value);
    } else if (name === 'telefone') {
      value = formatTelefone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return value;
  };

  const formatTelefone = (value) => {
    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    
    return value;
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    
    if (formData.cpf.length !== 14) {
      setError('CPF deve ter 11 dígitos');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return false;
    }
    
    if (formData.telefone && formData.telefone.length < 14) {
      setError('Telefone inválido');
      return false;
    }
    
    if (formData.senha.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      setError('Senhas não coincidem');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const { confirmarSenha, ...userData } = formData;
      const response = await authService.register(userData);
      
      console.log('Cadastro realizado:', response);
      
      // Callback para notificar sucesso
      onRegisterSuccess(response.user);
      
    } catch (err) {
      console.error('Erro no cadastro:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: "url('/background_principal.jpeg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 100%',
      }}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={onBackToLogin}
            className="text-blue-600 hover:text-blue-700 mr-3"
            disabled={loading}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <h1 className="text-2xl font-bold text-blue-700">Criar Conta</h1>
        </div>

        <h2 className="text-lg text-gray-600 text-center mb-6">
          Preencha os dados para criar sua conta
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input 
              type="text" 
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required 
              disabled={loading}
              placeholder="Nome Completo" 
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50" 
            />
          </div>
          
          <div className="relative">
            <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input 
              type="text" 
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required 
              disabled={loading}
              placeholder="000.000.000-00" 
              maxLength="14"
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50" 
            />
          </div>
          
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              disabled={loading}
              placeholder="seu@email.com" 
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50" 
            />
          </div>
          
          <div className="relative">
            <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input 
              type="tel" 
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              disabled={loading}
              placeholder="(00) 00000-0000" 
              maxLength="15"
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50" 
            />
          </div>
          
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input 
              type={showPassword ? "text" : "password"} 
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required 
              disabled={loading}
              placeholder="Senha (mín. 6 caracteres)" 
              className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50" 
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
          
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required 
              disabled={loading}
              placeholder="Confirmar Senha" 
              className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50" 
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center space-x-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            <span>{loading ? 'Cadastrando...' : 'Cadastrar'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Já tem uma conta?{' '}
            <button 
              onClick={onBackToLogin}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline disabled:opacity-50"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;