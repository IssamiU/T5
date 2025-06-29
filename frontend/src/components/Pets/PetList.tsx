import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PetItem from './PetItem';
import { Pet } from '../../services/types';

interface PetListProps {
  clienteId: number;
}

const PetList: React.FC<PetListProps> = ({ clienteId }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        console.log('Buscando pets para cliente ID:', clienteId);
        const response = await api.getPetsByCliente(Number(clienteId));
        setPets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('极Erro ao carregar pets', error);
        setError('Erro ao carregar pets');
        setLoading(false);
      }
    };
    
    if (clienteId) {
      fetchPets();
    }
  }, [clienteId]);

  const handleDelete = (petId: number) => {
    setPets(pets.filter(pet => pet.id !== petId));
  };

  if (loading) return <div>Carregando pets...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Pets do Cliente #{clienteId}</h3>
        <button
          onClick={() => navigate('/pets/novo')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Cadastrar Pet
        </button>
      </div>
      
      {pets.length === 0 ? (
        <p className="text-gray-500">Nenhum pet cadastrado para este cliente</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pets.map(pet => (
            <PetItem 
              key={pet.id} 
              pet={pet} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PetList;
