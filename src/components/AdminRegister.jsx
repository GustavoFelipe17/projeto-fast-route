// src/components/AdminRegister.jsx
import { useState } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaPhoneAlt, FaLock, FaEye, FaEyeSlash, FaSpinner, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import { authService } from '../services/auth';

function AdminRegister({ onBackToLogin, onRegisterSuccess }) {
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
  const [adminAccess, setAdminAccess] = useState(false);
  const [adminCode, setAdminCode] = useState('');

  // Código de acesso administrativo (você pode alterar este código)
  const ADMIN_ACCESS_CODE = 'ADMIN2025';

  const handleAdminAccess = () => {
    if (adminCode === ADMIN_ACCESS_CODE) {
      setAdminAccess(true);
      setError('');
    } else {
      setError('Código de acesso administrativo inválido');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
    } else if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatTelefone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (error) setError('');
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length === 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
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
      
      // Limpar formulário
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: ''
      });
      
      alert('✅ Usuário cadastrado com sucesso!');
      
      // Não fazer login automático, apenas notificar sucesso
      if (onRegisterSuccess) {
        onRegisterSuccess(response.user);
      }
      
    } catch (err) {
      console.error('Erro no cadastro:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tela de verificação de acesso administrativo
  if (!adminAccess) {
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
          <div className="flex items-center mb-6">
            <button
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-700 mr-3"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <FaUserShield className="text-blue-600 text-2xl mr-3" />
            <h1 className="text-2xl font-bold text-blue-700">Acesso Administrativo</h1>
          </div>

          <h2 className="text-lg text-gray-600 text-center mb-6">
            Digite o código de acesso para cadastrar novos usuários
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Código de Acesso</label>
              <input 
                type="password" 
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Digite o código administrativo"
                className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              />
            </div>
            
            <button 
              onClick={handleAdminAccess}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Acessar Painel de Cadastro
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              ⚠️ Área restrita - Somente administradores autorizados
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tela de cadastro (após verificação de acesso)
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
            onClick={() => setAdminAccess(false)}
            className="text-blue-600 hover:text-blue-700 mr-3"
            disabled={loading}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <FaUserShield className="text-blue-600 text-xl mr-2" />
          <h1 className="text-2xl font-bold text-blue-700">Cadastro Administrativo</h1>
        </div>

        <h2 className="text-lg text-gray-600 text-center mb-6">
          Cadastrar novo usuário no sistema
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
              placeholder="email@exemplo.com" 
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
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center space-x-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            <span>{loading ? 'Cadastrando...' : 'Cadastrar Usuário'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Painel administrativo - Cadastro de novos usuários
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;