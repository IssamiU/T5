import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet } from '../../services/types';
import api from '../../services/api';

interface PetItemProps {
  pet: Pet;
  onDelete: (id: number) => void; 
}

const PetItem: React.FC<PetItemProps> = ({ pet, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o pet ${pet.nome}?`)) {
      try {
        await api.deletePet(pet.id!);
        onDelete(pet.id!);
      } catch (error) {
        alert('Erro ao excluir pet');
      }
    }
  };

  return (
    <div className="border rounded p-3 bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        <div>
          <h4 className="font-medium">{pet.nome}</h4>
          <p className="text-sm text-gray-600">
            {pet.tipo} • {pet.genero}
          </p>
          {pet.raca && <p className="text-sm text-gray-600">Raça: {pet.raca}</p>}
        </div>
      </div>
      
      <div className="mt-2 flex space-x-2">
        <button 
          onClick={() => navigate(`/pets/editar/${pet.id}`)}
          className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded"
        >
          Editar
        </button>
        <button 
          onClick={handleDelete}
          className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded"
        >
          Remover
        </button>
      </div>
    </div>
  );
};

export default PetItem;
