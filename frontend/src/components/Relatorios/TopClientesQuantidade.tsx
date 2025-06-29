import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface ClienteQuantidade {
  nome: string;
  quantidade: number;
}

const TopClientesQuantidade: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteQuantidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getTopClientesQuantidade();
        setClientes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar relatório', error);
        setError('Erro ao carregar relatório');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-4">Carregando relatório...</div>;
  
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Top 10 Clientes por Quantidade de Consumos</h2>
      
      {clientes.length === 0 ? (
        <p className="text-gray-500">Nenhum dado disponível</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((cliente, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cliente.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                    {cliente.quantidade} unidades
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopClientesQuantidade;
