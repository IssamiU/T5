import React, { useState } from 'react';
import { Produto } from '../../services/types';

interface ProdutoFormProps {
  onSubmit: (produto: Produto) => void;
  initialData?: Produto;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ 
  onSubmit,
  initialData
}) => {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [preco, setPreco] = useState(initialData?.preco || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(initialData || {}),
      nome,
      preco
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Nome do Produto *</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label className="block mb-1">Preço (R$) *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={preco}
          onChange={(e) => setPreco(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <button 
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {initialData ? 'Atualizar Produto' : 'Cadastrar Produto'}
      </button>
    </form>
  );
};

export default ProdutoForm;
