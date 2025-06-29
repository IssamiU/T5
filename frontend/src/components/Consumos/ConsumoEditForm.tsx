import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Consumo } from '../../services/types';

function formatDatetimeLocal(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

const ConsumoEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [consumo, setConsumo] = useState<Consumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [produtoId, setProdutoId] = useState<number | ''>('');
  const [servicoId, setServicoId] = useState<number | ''>('');
  const [quantidade, setQuantidade] = useState(0);
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, produtosRes, servicosRes, consumosRes] = await Promise.all([
          api.getClientes(),
          api.getProdutos(),
          api.getServicos(),
          api.getConsumos()
        ]);
        
        setClientes(clientesRes.data);
        setProdutos(produtosRes.data);
        setServicos(servicosRes.data);
        
        const consumoEncontrado = consumosRes.data.find((c: Consumo) => c.id === Number(id));
        
        if (consumoEncontrado) {
          setConsumo(consumoEncontrado);
        
          setClienteId(consumoEncontrado.clienteId);
          setProdutoId(consumoEncontrado.produtoId || '');
          setServicoId(consumoEncontrado.servicoId || '');
          setQuantidade(consumoEncontrado.quantidade);
          setData(consumoEncontrado.data);
        } else {
          setError('Consumo não encontrado');
        }
      } catch (error) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteId) {
      alert('Selecione um cliente');
      return;
    }
    
    if (!produtoId && !servicoId) {
      alert('Selecione um produto ou serviço');
      return;
    }
    
    if (quantidade <= 0) {
      alert('Informe uma quantidade válida');
      return;
    }
    
    try {
      const dadosAtualizados: Consumo = {
        id: consumo?.id,
        clienteId: Number(clienteId),
        produtoId: produtoId ? Number(produtoId) : undefined,
        servicoId: servicoId ? Number(servicoId) : undefined,
        quantidade,
        data,
        valorTotal: consumo?.valorTotal || 0
      };
      
      await api.updateConsumo(consumo?.id!, dadosAtualizados);
      alert('Consumo atualizado com sucesso!');
      navigate('/consumos');
    } catch (error) {
      alert('Erro ao atualizar consumo');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto mt-8">
        <p className="text-red-700 text-center">{error}</p>
        <button 
          onClick={() => navigate('/consumos')}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded mx-auto block"
        >
          Voltar para consumos
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editar Consumo</h2>
      
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
                onChange={(e) => {
                  setProdutoId(Number(e.target.value) || '');
                  if (e.target.value) setServicoId(''); 
                }}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Nenhum produto</option>
                {produtos.map(produto => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </option>
                ))}
              </select>
            </div>
            
            {produtoId && (
              <div>
                <label className="block mb-2 font-medium">Quantidade do Produto *</label>
                <input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-4 text-green-800">Serviço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Serviço</label>
              <select
                value={servicoId}
                onChange={(e) => {
                  setServicoId(Number(e.target.value) || '');
                  if (e.target.value) setProdutoId(''); 
                }}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Nenhum serviço</option>
                {servicos.map(servico => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome} - {servico.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </option>
                ))}
              </select>
            </div>
            
            {servicoId && (
              <div>
                <label className="block mb-2 font-medium">Quantidade do Serviço *</label>
                <input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Data *</label>
          <input
            type="datetime-local"
            value={data ? formatDatetimeLocal(data) : ''}
            onChange={(e) => setData(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Resumo da Edição:</h4>
          <ul className="space-y-1">
            <li>• Cliente: {clientes.find(c => c.id === clienteId)?.nome || 'Não selecionado'}</li>
            {produtoId && (
              <li>• Produto: {produtos.find(p => p.id === produtoId)?.nome} (Qtd: {quantidade})</li>
            )}
            {servicoId && (
              <li>• Serviço: {servicos.find(s => s.id === servicoId)?.nome} (Qtd: {quantidade})</li>
            )}
            <li>• Data: {data ? new Date(data).toLocaleString('pt-BR') : 'Não definida'}</li>
          </ul>
        </div>
        
        <div className="flex space-x-4">
          <button 
            type="submit"
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Atualizar Consumo
          </button>
          <button 
            type="button"
            onClick={() => navigate('/consumos')}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsumoEditForm;
