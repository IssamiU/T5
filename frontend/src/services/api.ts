import axios from 'axios';
import {
  Cliente,
  Produto,
  Servico,
  Consumo,
  Pet
} from './types';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use(config => {
  console.log(`Enviando ${config.method?.toUpperCase()} para ${config.url}`);
  console.log('Dados enviados:', config.data);
  return config;
}, error => {
  console.error('Erro no request:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  console.log(`Resposta de ${response.config.url}:`, response.data);
  return response;
}, error => {
  console.error('Erro na resposta:', error.response?.data || error.message);
  return Promise.reject(error);
});

export default {
  getClientes: () => api.get<Cliente[]>('/clientes'),
  createCliente: (data: Cliente) => api.post<Cliente>('/clientes', data),
  updateCliente: (id: number, data: Cliente) => api.put(`/clientes/${id}`, data),
  deleteCliente: (id: number) => api.delete(`/clientes/${id}`),

  getPetsByCliente: (clienteId: number) => api.get<Pet[]>(`/pets/cliente/${clienteId}`),
  getPetById: (id: number) => api.get<Pet>(`/pets/${id}`),
  createPet: (data: Pet) => api.post<Pet>('/pets', data),
  updatePet: (id: number, data: Pet) => api.put(`/pets/${id}`, data),
  deletePet: (id: number) => api.delete(`/pets/${id}`),

  getProdutos: () => api.get<Produto[]>('/produtos'),
  createProduto: (data: Produto) => api.post<Produto>('/produtos', data),
  updateProduto: (id: number, data: Produto) => api.put(`/produtos/${id}`, data),
  deleteProduto: (id: number) => api.delete(`/produtos/${id}`),

  getServicos: () => api.get<Servico[]>('/servicos'),
  createServico: (data: Servico) => api.post<Servico>('/servicos', data),
  updateServico: (id: number, data: Servico) => api.put(`/servicos/${id}`, data),
  deleteServico: (id: number) => api.delete(`/servicos/${id}`),

  createConsumo: (data: Consumo) => api.post<Consumo>('/consumos', data),
  getConsumos: () => api.get<Consumo[]>('/consumos'),
  updateConsumo: (id: number, data: Consumo) => api.put(`/consumos/${id}`, data),
  deleteConsumo: (id: number) => api.delete(`/consumos/${id}`),

  getTopClientesQuantidade: () => api.get<any[]>('/relatorios/top-clientes-quantidade'),
  getTopClientesValor: () => api.get<any[]>('/relatorios/top-clientes-valor'),
  getItensMaisConsumidos: () => api.get<any[]>('/relatorios/itens-mais-consumidos'),
  getItensPorTipoRacaPet: () => api.get<any[]>('/relatorios/itens-por-tipo-raca-pet'),

  getProdutosMaisConsumidos: () => api.get<any[]>('/relatorios/itens-mais-consumidos'),
  getServicosPorTipoPet: () => api.get<any[]>('/relatorios/itens-por-tipo-raca-pet'),
};
