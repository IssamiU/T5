import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Cliente } from '../../services/types';
import ClienteItem from './ClienteItem';

const ClienteList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.getClientes();
        setClientes(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const handleDelete = (id: number) => {
    setClientes(clientes.filter(cliente => cliente.id !== id));
  };

  if (loading) return <div>Carregando clientes...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
        <button
          onClick={() => navigate('/clientes/novo')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Cadastrar Cliente
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientes.length === 0 ? (
          <div className="text-center text-gray-500 py-8 col-span-2">Nenhum cliente cadastrado</div>
        ) : (
          clientes.map(cliente => (
            <ClienteItem 
              key={cliente.id} 
              cliente={cliente} 
              onDelete={handleDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ClienteList;
