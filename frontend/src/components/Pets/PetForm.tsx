import React, { useState } from 'react';
import { Pet } from '../../services/types';

interface PetFormProps {
  clienteId: number;
  onSubmit: (pet: Pet) => void;
  initialData?: Pet;
}

const PetForm: React.FC<PetFormProps> = ({ 
  clienteId, 
  onSubmit,
  initialData
}) => {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [tipo, setTipo] = useState(initialData?.tipo || 'Cachorro');
  const [raca, setRaca] = useState(initialData?.raca || '');
  const [genero, setGenero] = useState(initialData?.genero || 'Macho');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!nome.trim()) {
      alert('Nome do pet é obrigatório');
      return;
    }

    console.log('Cliente ID no form:', clienteId); 
    
    const petData: Pet = {
      ...(initialData || {}),
      nome: nome.trim(),
      tipo,
      raca: raca.trim(),
      genero,
      clienteId: Number(clienteId)
    };

    console.log('Dados do pet a enviar:', petData); 
    onSubmit(petData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? 'Editar Pet' : `Cadastrar Pet para Cliente #${clienteId}`}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nome do Pet *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Tipo *</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
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
            <label className="block mb-1 font-medium">Gênero *</label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Raça</label>
          <input
            type="text"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: Poodle, Siamês, etc."
          />
        </div>
        
        <button 
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {initialData ? 'Atualizar Pet' : 'Cadastrar Pet'}
        </button>
      </form>
    </div>
  );
};

export default PetForm;
