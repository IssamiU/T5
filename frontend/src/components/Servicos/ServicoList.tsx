import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Servico } from '../../services/types';

const ServicoList: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await api.getServicos();
        setServicos(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchServicos();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await api.deleteServico(id);
        setServicos(servicos.filter(servico => servico.id !== id));
      } catch (error) {
        alert('Erro ao excluir serviço');
      }
    }
  };

  if (loading) return <div className="text-center py-4">Carregando serviços...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Serviços</h2>
        <button
          onClick={() => navigate('/servicos/novo')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Cadastrar Serviço
        </button>
      </div>
      <div className="p-6">
        {servicos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Nenhum serviço cadastrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {servicos.map((servico, idx) => (
                  <tr key={servico.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{servico.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {servico.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => navigate(`/servicos/editar/${servico.id}`)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(servico.id!)}
                        className="text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
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

export default ServicoList;
