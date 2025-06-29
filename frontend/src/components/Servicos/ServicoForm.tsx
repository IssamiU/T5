import React, { useState } from 'react';
import { Servico } from '../../services/types';

interface ServicoFormProps {
  onSubmit: (servico: Servico) => void;
  initialData?: Servico;
}

const ServicoForm: React.FC<ServicoFormProps> = ({ 
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block mb-1">Nome do Serviço *</label>
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
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {initialData ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
      </button>
    </form>
  );
};

export default ServicoForm;
