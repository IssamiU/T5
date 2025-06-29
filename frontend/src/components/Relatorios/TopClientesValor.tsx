import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface ClienteValor {
  nome: string;
  totalGasto: number;
}

const TopClientesValor: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteValor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getTopClientesValor();
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
      <h2 className="text-xl font-bold mb-4">Top 5 Clientes por Valor Gasto</h2>
      
      {clientes.length === 0 ? (
        <p className="text-gray-500">Nenhum dado disponível</p>
      ) : (
        <div className="space-y-3">
          {clientes.map((cliente, index) => (
            <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center space-x-3">
                <span className="bg-green-100 text-green-800 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  {index + 1}
                </span>
                <div>
                  <span className="text-lg font-medium text-gray-900">{cliente.nome}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-green-600">
                  {cliente.totalGasto.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopClientesValor;
