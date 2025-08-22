// src/App.jsx - Versão com página administrativa
import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Login from './components/Login';
import AdminRegister from './components/AdminRegister';
import { authService } from './services/auth';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'admin-register', 'dashboard'
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Verificar se o usuário já está logado ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Verificar se o token ainda é válido
          const response = await authService.verifyToken();
          if (response.valid) {
            setUser(response.user);
            setCurrentView('dashboard');
          } else {
            // Token inválido, fazer logout
            authService.logout();
            setCurrentView('login');
          }
        } else {
          setCurrentView('login');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        authService.logout();
        setCurrentView('login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Verificar se a URL contém o parâmetro admin para acessar página de cadastro
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setCurrentView('admin-register');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleAdminRegisterSuccess = (userData) => {
    // Não fazer login automático, apenas voltar para login
    setCurrentView('login');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('login');
  };

  const navigateToLogin = () => {
    setCurrentView('login');
    // Limpar parâmetro admin da URL
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando...</p>
          <p className="text-sm text-gray-500 mt-2">Verificando autenticação</p>
        </div>
      </div>
    );
  }

  // Renderização condicional baseada no estado atual
  switch (currentView) {
    case 'admin-register':
      return (
        <AdminRegister 
          onRegisterSuccess={handleAdminRegisterSuccess}
          onBackToLogin={navigateToLogin}
        />
      );
    
    case 'dashboard':
      return (
        <Dashboard 
          user={user}
          onLogout={handleLogout}
        />
      );
    
    default: // 'login'
      return (
        <Login 
          onLoginSuccess={handleLoginSuccess}
        />
      );
  }
}

export default App;