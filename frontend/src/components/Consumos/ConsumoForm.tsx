import React, { useState, useEffect } from 'react';
import { Consumo } from '../../services/types';
import api from '../../services/api';

interface ConsumoFormProps {
  onSubmit: (consumo: Consumo) => void;
}

const ConsumoForm: React.FC<ConsumoFormProps> = ({ onSubmit }) => {
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [produtoId, setProdutoId] = useState<number | ''>('');
  const [servicoId, setServicoId] = useState<number | ''>('');
  const [quantidadeProduto, setQuantidadeProduto] = useState(0);
  const [quantidadeServico, setQuantidadeServico] = useState(0);
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, produtosRes, servicosRes] = await Promise.all([
          api.getClientes(),
          api.getProdutos(),
          api.getServicos()
        ]);
        
        setClientes(clientesRes.data);
        setProdutos(produtosRes.data);
        setServicos(servicosRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteId) {
      alert('Selecione um cliente');
      return;
    }
    
    if (!produtoId && !servicoId) {
      alert('Selecione pelo menos um produto ou serviço');
      return;
    }

    if (produtoId && quantidadeProduto <= 0) {
      alert('Informe a quantidade do produto');
      return;
    }

    if (servicoId && quantidadeServico <= 0) {
      alert('Informe a quantidade do serviço');
      return;
    }

    if (produtoId && quantidadeProduto > 0) {
      const consumoProduto: Consumo = {
        clienteId: Number(clienteId),
        produtoId: Number(produtoId),
        quantidade: quantidadeProduto,
        data: new Date().toISOString(),
        valorTotal: 0
      };
      
      try {
        await api.createConsumo(consumoProduto);
      } catch (error) {
        alert('Erro ao registrar consumo do produto');
        return;
      }
    }

    if (servicoId && quantidadeServico > 0) {
      const consumoServico: Consumo = {
        clienteId: Number(clienteId),
        servicoId: Number(servicoId),
        quantidade: quantidadeServico,
        data: new Date().toISOString(),
        valorTotal: 0
      };
      
      try {
        await api.createConsumo(consumoServico);
      } catch (error) {
        alert('Erro ao registrar consumo do serviço');
        return;
      }
    }

    alert('Consumo(s) registrado(s) com sucesso!');
    
    setClienteId('');
    setProdutoId('');
    setServicoId('');
    setQuantidadeProduto(0);
    setQuantidadeServico(0);
  };

  if (loading) return <div>Carregando dados...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Registrar Consumo</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Cliente *</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
        
        <div className="border rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Produto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Produto</label>
              <select
                value={produtoId}
                onChange={(e) => setProdutoId(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Selecione um produto</option>
                {produtos.map(produto => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Quantidade do Produto</label>
              <input
                type="number"
                min="0"
                value={quantidadeProduto}
                onChange={(e) => setQuantidadeProduto(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                disabled={!produtoId}
              />
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-4 text-green-800">Serviço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Serviço</label>
              <select
                value={servicoId}
                onChange={(e) => setServicoId(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Selecione um serviço</option>
                {servicos.map(servico => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome} - {servico.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Quantidade do Serviço</label>
              <input
                type="number"
                min="0"
                value={quantidadeServico}
                onChange={(e) => setQuantidadeServico(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                disabled={!servicoId}
              />
            </div>
          </div>
        </div>
        
        {/* Resumo */}
        {(produtoId || servicoId) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Resumo do Consumo:</h4>
            <ul className="space-y-1">
              {produtoId && quantidadeProduto > 0 && (
                <li>• Produto: {produtos.find(p => p.id === produtoId)?.nome} (Qtd: {quantidadeProduto})</li>
              )}
              {servicoId && quantidadeServico > 0 && (
                <li>• Serviço: {servicos.find(s => s.id === servicoId)?.nome} (Qtd: {quantidadeServico})</li>
              )}
            </ul>
          </div>
        )}
        
        <button 
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Registrar Consumo
        </button>
      </form>
    </div>
  );
};

export default ConsumoForm;
