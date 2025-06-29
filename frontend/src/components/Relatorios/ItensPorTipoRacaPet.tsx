import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface ItemPorTipo {
  tipoPet: string;
  racaPet: string;
  itemNome: string;
  itemTipo: 'produto' | 'servico';
  totalQuantidade: number;
}

const ItensPorTipoRacaPet: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consumosResponse, clientesResponse] = await Promise.all([
          api.getConsumos(),
          api.getClientes()
        ]);

        const consumos = consumosResponse.data;
        const clientes = clientesResponse.data;

        const clientePetsMap = new Map();
        clientes.forEach((cliente: any) => {
          if (cliente.pets && cliente.pets.length > 0) {
            clientePetsMap.set(cliente.id, cliente.pets);
          }
        });

        const resultados = new Map();

        consumos.forEach((consumo: any) => {
          const pets = clientePetsMap.get(consumo.cliente.id);
          
          if (pets && pets.length > 0) {
            pets.forEach((pet: any) => {
              let nomeItem = '';
              let tipoItem: 'produto' | 'servico' = 'produto';
              
              if (consumo.produto && consumo.produto.nome) {
                nomeItem = consumo.produto.nome;
                tipoItem = 'produto';
              } else if (consumo.servico && consumo.servico.nome) {
                nomeItem = consumo.servico.nome;
                tipoItem = 'servico';
              } else {
                if (consumo.produtoId) {
                  nomeItem = `Produto #${consumo.produtoId}`;
                  tipoItem = 'produto';
                } else if (consumo.servicoId) {
                  nomeItem = `Serviço #${consumo.servicoId}`;
                  tipoItem = 'servico';
                } else {
                  return;
                }
              }

              const chave = `${pet.tipo}-${pet.raca || 'Sem raça'}`;
              
              if (!resultados.has(chave)) {
                resultados.set(chave, {
                  tipoPet: pet.tipo,
                  racaPet: pet.raca || 'Sem raça',
                  itens: new Map()
                });
              }

              const grupo = resultados.get(chave);
              const chaveItem = `${nomeItem}-${tipoItem}`;

              if (!grupo.itens.has(chaveItem)) {
                grupo.itens.set(chaveItem, {
                  nome: nomeItem,
                  tipo: tipoItem,
                  quantidade: 0
                });
              }

              grupo.itens.get(chaveItem).quantidade += consumo.quantidade;
            });
          }
        });

        const resposta = Array.from(resultados.values()).map(grupo => ({
          tipoPet: grupo.tipoPet,
          racaPet: grupo.racaPet,
          itens: Array.from(grupo.itens.values())
            .sort((a: any, b: any) => b.quantidade - a.quantidade)
            .slice(0, 5) 
        })).filter(grupo => grupo.itens.length > 0);

        setDados(resposta);
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
      <h2 className="text-xl font-bold mb-4">Produtos e Serviços Mais Consumidos por Tipo e Raça de Pet</h2>
      
      {dados.length === 0 ? (
        <p className="text-gray-500">Nenhum dado disponível</p>
      ) : (
        <div className="space-y-6">
          {dados.map((grupo, index) => (
            <div key={`${grupo.tipoPet}-${grupo.racaPet}`} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                 {grupo.tipoPet} - {grupo.racaPet}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Ranking</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Item</th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Tipo</th>
                      <th className="text-right py-2 px-4 text-sm font-medium text-gray-500">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grupo.itens.map((item: any, itemIndex: number) => (
                      <tr key={`${grupo.tipoPet}-${grupo.racaPet}-${item.nome}-${item.tipo}`} 
                          className={itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-4">
                          <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {itemIndex + 1}
                          </span>
                        </td>
                        <td className="py-2 px-4 font-medium">{item.nome}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.tipo === 'produto' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.tipo === 'produto' ? 'Produto' : 'Serviço'}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right font-semibold">{item.quantidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItensPorTipoRacaPet;
