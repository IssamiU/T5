import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface ItemConsumido {
  nome: string;
  tipo: 'produto' | 'servico';
  quantidade: number;
}

const ItensMaisConsumidos: React.FC = () => {
  const [itens, setItens] = useState<ItemConsumido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getItensMaisConsumidos();
        setItens(response.data);
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
      <h2 className="text-xl font-bold mb-4">Top 10 Produtos e Serviços Mais Consumidos</h2>
      
      {itens.length === 0 ? (
        <p className="text-gray-500">Nenhum dado disponível</p>
      ) : (
        <div className="space-y-3">
          {itens.map((item, index) => (
            <div key={`${item.nome}-${item.tipo}`} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center">
                <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                  {index + 1}
                </span>
                <div>
                  <span className="font-medium">{item.nome}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    item.tipo === 'produto' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.tipo === 'produto' ? 'Produto' : 'Serviço'}
                  </span>
                </div>
              </div>
              <span className="font-medium text-lg">{item.quantidade} unidades</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItensMaisConsumidos;
