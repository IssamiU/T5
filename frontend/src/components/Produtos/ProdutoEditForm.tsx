import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Produto } from '../../services/types';

const ProdutoEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api.getProdutos();
        const produtoEncontrado = response.data.find((p: Produto) => p.id === Number(id));
        
        if (produtoEncontrado) {
          setProduto(produtoEncontrado);
        } else {
          setError('Produto não encontrado');
        }
      } catch (error) {
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduto();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto) return;
    
    try {
      await api.updateProduto(produto.id!, produto);
      alert('Produto atualizado com sucesso!');
      navigate('/produtos');
    } catch (error) {
      alert('Erro ao atualizar produto');
    }
  };

  const handleChange = (field: keyof Produto, value: any) => {
    if (!produto) return;
    setProduto({ ...produto, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto mt-8">
        <p className="text-red-700 text-center">{error}</p>
        <button 
          onClick={() => navigate('/produtos')}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded mx-auto block"
        >
          Voltar para produtos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Editar Produto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome *</label>
          <input
            type="text"
            value={produto?.nome || ''}
            onChange={(e) => handleChange('nome', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Preço *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={produto?.preco || ''}
            onChange={(e) => handleChange('preco', Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="flex space-x-4">
          <button 
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-极7"
          >
            Atualizar Produto
          </button>
          <button 
            type="button"
            onClick={() => navigate('/produtos')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProdutoEditForm;
