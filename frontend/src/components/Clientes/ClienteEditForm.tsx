import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Cliente, Endereco, Telefone } from '../../services/types';
import TelefoneInput from './TelefoneInput';

const ClienteEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [nomeSocial, setNomeSocial] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState<Endereco>({
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    codigoPostal: '',
    informacoesAdicionais: ''
  });
  const [telefones, setTelefones] = useState<Telefone[]>([{ ddd: '', numero: '' }]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.getClientes();
        const clienteEncontrado = response.data.find((c: Cliente) => c.id === Number(id));
        
        if (clienteEncontrado) {
          setNome(clienteEncontrado.nome);
          setNomeSocial(clienteEncontrado.nomeSocial || '');
          setEmail(clienteEncontrado.email || '');
          
          if (clienteEncontrado.endereco) {
            setEndereco(clienteEncontrado.endereco);
          }
          
          if (clienteEncontrado.telefones && clienteEncontrado.telefones.length > 0) {
            setTelefones(clienteEncontrado.telefones);
          } else {
            setTelefones([{ ddd: '', numero: '' }]);
          }
        } else {
          setError('Cliente não encontrado');
        }
      } catch (error) {
        setError('Erro ao carregar cliente');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCliente();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      id: Number(id),
      nome: nome.trim(),
      nomeSocial: nomeSocial.trim(),
      email: email.trim(),
      endereco,
      telefones: telefones.map(tel => ({
        ...tel,
        ddd: tel.ddd.trim(),
        numero: tel.numero.trim()
      })),
      pets: [] 
    };

    try {
      await api.updateCliente(Number(id), dadosCliente);
      alert('Cliente atualizado com sucesso!');
      navigate('/clientes');
    } catch (error) {
      alert('Erro ao atualizar cliente');
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando cliente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto mt-8">
        <p className="text-red-700 text-center">{error}</p>
        <button 
          onClick={() => navigate('/clientes')}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded mx-auto block"
        >
          Voltar para clientes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Editar Cliente</h2>
      
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

        <div className="flex space-x-4">
          <button 
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Atualizar Cliente
          </button>
          <button 
            type="button"
            onClick={() => navigate('/clientes')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteEditForm;
