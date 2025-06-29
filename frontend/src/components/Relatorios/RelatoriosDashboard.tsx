import React from 'react';
import { useNavigate } from 'react-router-dom';

const RelatoriosDashboard: React.FC = () => {
  const navigate = useNavigate();

  const relatorios = [
    {
      id: 'top-clientes-quantidade',
      titulo: 'Top 10 Clientes por Quantidade',
      descricao: 'Ranking dos clientes que mais consumiram produtos e serviços por quantidade',
      rota: '/relatorios/top-clientes-quantidade'
    },
    {
      id: 'top-clientes-valor',
      titulo: 'Top 5 Clientes por Valor',
      descricao: 'Ranking dos clientes que mais gastaram em produtos e serviços',
      rota: '/relatorios/top-clientes-valor'
    },
    {
      id: 'itens-mais-consumidos',
      titulo: 'Produtos e Serviços Mais Consumidos',
      descricao: 'Ranking geral dos produtos e serviços mais populares',
      rota: '/relatorios/itens-mais-consumidos'
    },
    {
      id: 'itens-por-tipo-raca',
      titulo: 'Consumo por Tipo e Raça de Pet',
      descricao: 'Produtos e serviços mais consumidos por tipo e raça de pets',
      rota: '/relatorios/itens-por-tipo-raca'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard de Relatórios</h1>
        <p className="text-gray-600">Selecione um relatório para visualizar os dados analíticos do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatorios.map((relatorio) => (
          <div
            key={relatorio.id}
            onClick={() => navigate(relatorio.rota)}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl border border-gray-200"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {relatorio.titulo}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {relatorio.descricao}
              </p>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Ver Relatório →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatoriosDashboard;
