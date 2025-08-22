// src/services/auth.js
import axios from 'axios';

const API_URL = 'https://gestao-tarefas-api.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token inválido ou expirado
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const authService = {
  // Login melhorado
  login: async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      // Manter a estrutura do erro original para melhor tratamento no frontend
      if (error.response) {
        // Erro com resposta do servidor (4xx, 5xx)
        const customError = new Error(error.response.data?.error || 'Erro ao fazer login');
        customError.response = error.response;
        customError.status = error.response.status;
        throw customError;
      } else if (error.request) {
        // Erro de rede - requisição foi feita mas não houve resposta
        const networkError = new Error('Erro de conexão com o servidor');
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      } else {
        // Erro na configuração da requisição
        throw new Error('Erro interno da aplicação');
      }
    }
  },

  // Cadastro
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      if (error.response) {
        const customError = new Error(error.response.data?.error || 'Erro ao fazer cadastro');
        customError.response = error.response;
        customError.status = error.response.status;
        throw customError;
      } else if (error.request) {
        const networkError = new Error('Erro de conexão com o servidor');
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      } else {
        throw new Error('Erro interno da aplicação');
      }
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  // Verificar se está logado
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Obter dados do usuário
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Verificar token no servidor
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  // Obter token atual
  getToken: () => {
    return localStorage.getItem('authToken');
  }
};

// API com autenticação para as outras funcionalidades
export const authenticatedAPI = {
  // Tarefas
  tarefas: {
    listar: () => api.get('/tarefas'),
    criar: (data) => api.post('/tarefas', data),
    atualizar: (id, data) => api.put(`/tarefas/${id}`, data),
    editar: (id, data) => api.patch(`/tarefas/${id}`, data),
    deletar: (id) => api.delete(`/tarefas/${id}`)
  },

  // Motoristas
  motoristas: {
    listar: () => api.get('/motoristas'),
    criar: (data) => api.post('/motoristas', data),
    atualizar: (id, data) => api.put(`/motoristas/${id}`, data),
    deletar: (id) => api.delete(`/motoristas/${id}`)
  },

  // Caminhões
  caminhoes: {
    listar: () => api.get('/caminhoes'),
    criar: (data) => api.post('/caminhoes', data),
    atualizar: (id, data) => api.put(`/caminhoes/${id}`, data),
    deletar: (id) => api.delete(`/caminhoes/${id}`)
  }
};

export default api;