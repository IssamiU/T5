import React, { useState } from 'react';
import { Cliente, Endereco, Telefone } from '../../services/types';
import TelefoneInput from './TelefoneInput';

interface ClienteFormProps {
  initialData?: Cliente;
  onSubmit: (cliente: Cliente) => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ initialData, onSubmit }) => {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [nomeSocial, setNomeSocial] = useState(initialData?.nomeSocial || '');
  const [email, setEmail] = useState(initialData?.email || '');
  
  const [endereco, setEndereco] = useState<Endereco>(
    initialData?.endereco || {
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      codigoPostal: '',
      informacoesAdicionais: ''
    }
  );
  
  const [telefones, setTelefones] = useState<Telefone[]>(
    initialData?.telefones || [{ ddd: '', numero: '' }]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    
    if (!endereco.estado.trim() || !endereco.cidade.trim()) {
      alert('Estado e cidade são obrigatórios');
      return;
    }
    
    const dadosCliente: Cliente = {
      ...(initialData || {}),
      nome: nome.trim(),
      nomeSocial: nomeSocial.trim(),
      email: email.trim(),
      endereco,
      telefones: telefones.map(tel => ({
        ...tel,
        ddd: tel.ddd.trim(),
        numero: tel.numero.trim()
      })),
      pets: initialData?.pets || [] 
    };

    onSubmit(dadosCliente);
  };

  const addTelefone = () => {
    setTelefones([...telefones, { ddd: '', numero: '' }]);
  };

  const updateTelefone = (index: number, field: keyof Telefone, value: string) => {
    const newTelefones = [...telefones];
    newTelefones[index] = { ...newTelefones[index], [field]: value };
    setTelefones(newTelefones);
  };

  const removeTelefone = (index: number) => {
    if (telefones.length > 1) {
      const newTelefones = [...telefones];
      newTelefones.splice(index, 1);
      setTelefones(newTelefones);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Nome *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Nome Social</label>
          <input
            type="text"
            value={nomeSocial}
            onChange={(e) => setNomeSocial(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="border p-4 rounded">
        <h3 className="text-lg font-medium mb-3">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Estado *</label>
            <input
              type="text"
              value={endereco.estado}
              onChange={(e) => setEndereco({...endereco, estado: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Cidade *</label>
            <input
              type="text"
              value={endereco.cidade}
              onChange={(e) => setEndereco({...endereco, cidade: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Bairro *</label>
            <input
              type="text"
              value={endereco.bairro}
              onChange={(e) => setEndereco({...endereco, bairro: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Rua *</label>
            <input
              type="text"
              value={endereco.rua}
              onChange={(e) => setEndereco({...endereco, rua: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Número *</label>
            <input
              type="text"
              value={endereco.numero}
              onChange={(e) => setEndereco({...endereco, numero: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">CEP</label>
            <input
              type="text"
              value={endereco.codigoPostal}
              onChange={(e) => setEndereco({...endereco, codigoPostal: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1">Informações Adicionais</label>
            <input
              type="text"
              value={endereco.informacoesAdicionais}
              onChange={(e) => setEndereco({...endereco, informacoesAdicionais: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="border p-4 rounded">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Telefones</h3>
          <button 
            type="button" 
            onClick={addTelefone}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Adicionar
          </button>
        </div>
        
        {telefones.map((telefone, index) => (
          <TelefoneInput
            key={index}
            telefone={telefone}
            index={index}
            onChange={updateTelefone}
            onRemove={removeTelefone}
            showRemove={telefones.length > 1}
          />
        ))}
      </div>

      <button 
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        {initialData ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
      </button>
    </form>
  );
};

export default ClienteForm;
