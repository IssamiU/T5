import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Cliente } from '../../services/types';

interface ClienteSelectorProps {
  onSelect: (clienteId: number) => void;
}

const ClienteSelector: React.FC<ClienteSelectorProps> = ({ onSelect }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.getClientes();
        setClientes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar clientes', error);
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  if (loading) return <div>Carregando clientes...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-bold mb-2">Selecione um Cliente</h2>
      {clientes.length === 0 ? (
        <div className="text-gray-500">Nenhum cliente cadastrado</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientes.map(cliente => (
          <div
            key={cliente.id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect(cliente.id!)}
          >
            <h3 className="text-lg font-medium">{cliente.nome}</h3>
            <p className="text-gray-600">ID: {cliente.id}</p>
          </div>
        
        ))}
        
      </div>
      )}
    </div>
  );
};

export default ClienteSelector;
