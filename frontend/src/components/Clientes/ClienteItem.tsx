import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cliente } from '../../services/types';
import api from '../../services/api';

interface ClienteItemProps {
  cliente: Cliente;
  onDelete: (id: number) => void;
}

const ClienteItem: React.FC<ClienteItemProps> = ({ cliente, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${cliente.nome}?`)) {
      try {
        await api.deleteCliente(cliente.id!);
        onDelete(cliente.id!);
      } catch (error) {
        alert('Erro ao excluir cliente');
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold">{cliente.nome}</h3>
      
      {cliente.nomeSocial && (
        <p className="text-gray-600">Nome Social: {cliente.nomeSocial}</p>
      )}
      
      {cliente.email && (
        <p className="text-gray-600">Email: {cliente.email}</p>
      )}
      
      <div className="mt-3">
        <h4 className="font-medium">Telefones:</h4>
        <ul className="list-disc pl-5">
          {cliente.telefones.map((telefone, index) => (
            <li key={index}>({telefone.ddd}) {telefone.numero}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-3">
        <h4 className="font-medium">Pets:</h4>
        {cliente.pets.length > 0 ? (
          <ul className="list-disc pl-5">
            {cliente.pets.map(pet => (
              <li key={pet.id}>{pet.nome} ({pet.tipo})</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhum pet cadastrado</p>
        )}
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button 
          onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Editar
        </button>
        <button 
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default ClienteItem;
