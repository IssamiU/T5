import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Consumo } from '../../services/types';

const ConsumoList: React.FC = () => {
  const [consumos, setConsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsumos();
  }, []);

  const fetchConsumos = async () => {
    try {
      const response = await api.getConsumos();
      setConsumos(response.data);
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar consumos');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este consumo?')) {
      try {
        await api.deleteConsumo(id);
        setConsumos(consumos.filter(consumo => consumo.id !== id));
      } catch (error) {
        alert('Erro ao excluir consumo');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando consumos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Histórico de Consumos</h2>
        <button
          onClick={() => navigate('/consumos/novo')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Cadastrar Consumo
        </button>
      </div>

      <div className="p-6">
        {consumos.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum consumo registrado</h3>
            <button
              onClick={() => navigate('/consumos/novo')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Cadastrar Primeiro Consumo
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto/Serviço</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consumos.map((consumo, index) => (
                  <tr key={consumo.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {consumo.cliente?.nome || `Cliente #${consumo.clienteId}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {consumo.cliente?.id || consumo.clienteId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {consumo.produto ? (
                          <>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                              Produto
                            </span>
                            {consumo.produto.nome}
                          </>
                        ) : consumo.servico ? (
                          <>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                              Serviço
                            </span>
                            {consumo.servico.nome}
                          </>
                        ) : (
                          <span className="text-gray-700">
                            {consumo.produtoId ? `Produto #${consumo.produtoId}` : `Serviço #${consumo.servicoId}`}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {consumo.produto && `Preço unitário: ${consumo.produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                        {consumo.servico && `Preço unitário: ${consumo.servico.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {consumo.quantidade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {consumo.valorTotal.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {new Date(consumo.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(consumo.data).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/consumos/editar/${consumo.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(consumo.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumoList;
