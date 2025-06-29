import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Cliente, Servico, Consumo, Pet, Produto } from './services/types';
import ClienteList from './components/Clientes/ClienteList';
import ClienteForm from './components/Clientes/ClienteForm';
import ClienteEditForm from './components/Clientes/ClienteEditForm';
import ProdutoList from './components/Produtos/ProdutoList';
import ProdutoForm from './components/Produtos/ProdutoForm';
import ProdutoEditForm from './components/Produtos/ProdutoEditForm';
import ServicoList from './components/Servicos/ServicoList';
import ServicoForm from './components/Servicos/ServicoForm';
import ServicoEditForm from './components/Servicos/ServicoEditForm';
import ConsumoForm from './components/Consumos/ConsumoForm';
import ConsumoList from './components/Consumos/ConsumoList';
import ConsumoEditForm from './components/Consumos/ConsumoEditForm';
import TopClientesValor from './components/Relatorios/TopClientesValor';
import TopClientesQuantidade from './components/Relatorios/TopClientesQuantidade';
import ItensMaisConsumidos from './components/Relatorios/ItensMaisConsumidos';
import ItensPorTipoRacaPet from './components/Relatorios/ItensPorTipoRacaPet';
import RelatoriosDashboard from './components/Relatorios/RelatoriosDashboard'; // NOVA IMPORTAÇÃO
import PetList from './components/Pets/PetList';
import PetForm from './components/Pets/PetForm';
import PetEditForm from './components/Pets/PetEditForm';
import ClienteSelector from './components/Clientes/ClienteSelector';
import api from './services/api';

const App: React.FC = () => {
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);

  const handleClienteSubmit = useCallback(async (cliente: Cliente) => {
    try {
      const response = await api.createCliente(cliente);
      alert('Cliente cadastrado com sucesso!');
      console.log('Resposta do backend:', response.data);
    } catch (error) {
      alert('Erro ao cadastrar cliente!');
      console.error('Erro ao cadastrar cliente:', error);
    }
  }, []);

  const handleServicoSubmit = useCallback(async (servico: Servico) => {
    try {
      const response = await api.createServico(servico);
      alert('Serviço cadastrado com sucesso!');
      console.log('Resposta do backend:', response.data);
    } catch (error) {
      alert('Erro ao cadastrar serviço!');
      console.error('Erro ao cadastrar serviço:', error);
    }
  }, []);

  const handleConsumoSubmit = useCallback(async (consumo: Consumo) => {
    try {
      const response = await api.createConsumo(consumo);
      alert('Consumo registrado com sucesso!');
      console.log('Resposta do backend:', response.data);
    } catch (error) {
      alert('Erro ao registrar consumo!');
      console.error('Erro ao registrar consumo:', error);
    }
  }, []);

  const handlePetSubmit = useCallback(async (pet: Pet) => {
    try {
      const response = await api.createPet(pet);
      alert('Pet cadastrado com sucesso!');
      console.log('Resposta do backend:', response.data);
    } catch (error) {
      alert('Erro ao cadastrar pet!');
      console.error('Erro ao cadastrar pet:', error);
    }
  }, []);

  const handleProdutoSubmit = useCallback(async (produto: Produto) => {
    try {
      const response = await api.createProduto(produto);
      alert('Produto cadastrado com sucesso!');
      console.log('Resposta do backend:', response.data);
    } catch (error) {
      alert('Erro ao cadastrar produto!');
      console.error('Erro ao cadastrar produto:', error);
    }
  }, []);

  const handleClienteSelect = useCallback((clienteId: number, navigate: Function) => {
    setSelectedClienteId(clienteId);
    navigate('/pets/list');
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl font-bold text-blue-600">PetLovers Management</h1>
            <p className="text-gray-600 mt-2">Sistema de gerenciamento para pet shops e clínicas veterinárias</p>
          </div>
        </header>

        <nav className="bg-gray-100 border-b">
          <div className="container mx-auto px-4">
            <ul className="flex flex-wrap justify-center space-x-6 py-4">
              <li>
                <a href="/clientes" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Clientes
                </a>
              </li>
              <li>
                <a href="/pets" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Pets
                </a>
              </li>
              <li>
                <a href="/produtos" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Produtos
                </a>
              </li>
              <li>
                <a href="/servicos" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Serviços
                </a>
              </li>
              <li>
                <a href="/consumos" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Consumos
                </a>
              </li>
              <li>
                <a href="/relatorios" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Relatórios
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/clientes" replace />} />

            <Route path="/clientes" element={<ClienteList />} />
            <Route path="/clientes/novo" element={<ClienteForm onSubmit={handleClienteSubmit} />} />
            <Route path="/clientes/editar/:id" element={<ClienteEditForm />} />

            <Route
              path="/pets"
              element={<PetsSelectorWrapper onSelect={handleClienteSelect} />}
            />
            {selectedClienteId && (
              <>
                <Route
                  path="/pets/list"
                  element={<PetList clienteId={selectedClienteId} />}
                />
                <Route
                  path="/pets/novo"
                  element={<PetForm clienteId={selectedClienteId} onSubmit={handlePetSubmit} />}
                />
                <Route path="/pets/editar/:id" element={<PetEditForm />} />
              </>
            )}

            <Route path="/produtos" element={<ProdutoList />} />
            <Route 
              path="/produtos/novo" 
              element={<ProdutoForm onSubmit={handleProdutoSubmit} />} 
            />
            <Route path="/produtos/editar/:id" element={<ProdutoEditForm />} />

            <Route path="/servicos" element={<ServicoList />} />
            <Route path="/servicos/novo" element={<ServicoForm onSubmit={handleServicoSubmit} />} />
            <Route path="/servicos/editar/:id" element={<ServicoEditForm />} />

            <Route path="/consumos" element={<ConsumoList />} />
            <Route path="/consumos/novo" element={<ConsumoForm onSubmit={handleConsumoSubmit} />} />
            <Route path="/consumos/editar/:id" element={<ConsumoEditForm />} />

            <Route path="/relatorios" element={<RelatoriosDashboard />} />
            <Route path="/relatorios/top-clientes-quantidade" element={<TopClientesQuantidade />} />
            <Route path="/relatorios/top-clientes-valor" element={<TopClientesValor />} />
            <Route path="/relatorios/itens-mais-consumidos" element={<ItensMaisConsumidos />} />
            <Route path="/relatorios/itens-por-tipo-raca" element={<ItensPorTipoRacaPet />} />

          </Routes>
        </main>

        <footer className="bg-gray-800 text-white py-3 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300">
              © {new Date().getFullYear()} Computer4Pet - Todos os direitos reservados
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const PetsSelectorWrapper: React.FC<{ 
  onSelect: (clienteId: number, navigate: Function) => void 
}> = ({ onSelect }) => {
  const navigate = useNavigate();
  return <ClienteSelector onSelect={(clienteId: number) => onSelect(clienteId, navigate)} />;
};

export default App;
