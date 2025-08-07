// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const tarefasAPI = {
  listar: () => api.get('/tarefas'),
  criar: (data) => api.post('/tarefas', data),
  atualizar: (id, data) => api.put(`/tarefas/${id}`, data),
  editar: (id, data) => api.patch(`/tarefas/${id}`, data),
  deletar: (id) => api.delete(`/tarefas/${id}`)
};

export const motoristasAPI = {
  listar: () => api.get('/motoristas'),
  criar: (data) => api.post('/motoristas', data),
  atualizar: (id, data) => api.put(`/motoristas/${id}`, data),
  deletar: (id) => api.delete(`/motoristas/${id}`)
};

export const caminhoesAPI = {
  listar: () => api.get('/caminhoes'),
  criar: (data) => api.post('/caminhoes', data),
  atualizar: (id, data) => api.put(`/caminhoes/${id}`, data),
  deletar: (id) => api.delete(`/caminhoes/${id}`)
};

export default api;