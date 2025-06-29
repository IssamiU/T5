import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Pet } from '../../services/types';

const PetEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await api.getPetById(Number(id));
        setPet(response.data);
      } catch (error) {
        setError('Erro ao carregar pet');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPet();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;
    
    try {
      await api.updatePet(pet.id!, pet);
      alert('Pet atualizado com sucesso!');
      navigate('/pets');
    } catch (error) {
      alert('Erro ao atualizar pet');
    }
  };

  const handleChange = (field: keyof Pet, value: any) => {
    if (!pet) return;
    setPet({ ...pet, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando pet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto mt-8">
        <p className="text-red-700 text-center">{error}</p>
        <button 
          onClick={() => navigate('/pets')}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded mx-auto block"
        >
          Voltar para pets
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2极xl font-bold mb-6">Editar Pet</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome *</label>
          <input
            type="text"
            value={pet?.nome || ''}
            onChange={(e) => handleChange('nome', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Tipo *</label>
          <select
            value={pet?.tipo || 'Cachorro'}
            onChange={(e) => handleChange('tipo', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Cachorro">Cachorro</option>
            <option value="Gato">Gato</option>
            <option value="Pássaro">Pássaro</option>
            <option value="Peixe">Peixe</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Raça</label>
          <input
            type="text"
            value={pet?.raca || ''}
            onChange={(e) => handleChange('raca', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-1">Gênero *</label>
          <select
            value={pet?.genero || 'Macho'}
            onChange={(e) => handleChange('genero', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
        </div>
        
        
        <div className="flex space-x-4">
          <button 
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Atualizar Pet
          </button>
          <button 
            type="button"
            onClick={() => navigate('/pets')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PetEditForm;
