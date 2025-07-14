import React, { useState } from 'react';
import { FaPlus, FaTrash, FaTruckMoving, FaEdit } from 'react-icons/fa'; // Adicionado FaEdit

// Componente para gerenciar Caminhões
function Caminhoes({ caminhoes, setCaminhoes }) {
  // Estado para o formulário de novo/edição de caminhão
  const [novoCaminhao, setNovoCaminhao] = useState({
    placa: '',
    modelo: '',
    capacidade: '', // Capacidade em KG
    status: 'Disponível', // Status padrão
  });

  // Estado para controlar a visibilidade do modal
  const [showNovoCaminhaoModal, setShowNovoCaminhaoModal] = useState(false);
  // Estado para armazenar o caminhão que está sendo editado
  const [editandoCaminhao, setEditandoCaminhao] = useState(null);
  // Estado para o filtro de status na tabela
  const [filtroStatus, setFiltroStatus] = useState('');
  // Estado para o termo de busca
  const [termoBusca, setTermoBusca] = useState('');

  // Opções de status para os caminhões
  const statusOptions = ['Disponível', 'Em Uso', 'Em Manutenção'];

  // Função para lidar com a adição ou atualização de um caminhão
  const handleAdicionarCaminhao = () => {
    // Validação simples
    if (novoCaminhao.placa.trim() === '' || novoCaminhao.modelo.trim() === '') {
      alert('Placa e Modelo são obrigatórios!'); // Substituir por um modal de aviso mais elegante se desejar
      return;
    }
    if (isNaN(parseFloat(novoCaminhao.capacidade)) || parseFloat(novoCaminhao.capacidade) <= 0) {
      alert('Capacidade de carga deve ser um número positivo!');
      return;
    }

    if (editandoCaminhao) {
      // Atualiza o caminhão existente
      setCaminhoes(
        caminhoes.map((caminhao) =>
          caminhao.id === editandoCaminhao.id ? { ...editandoCaminhao, ...novoCaminhao, capacidade: parseFloat(novoCaminhao.capacidade) } : caminhao
        )
      );
    } else {
      // Adiciona um novo caminhão
      setCaminhoes([...caminhoes, { id: Date.now(), ...novoCaminhao, capacidade: parseFloat(novoCaminhao.capacidade) }]);
    }
    resetFormulario(); // Limpa o formulário e fecha o modal
  };

  // Função para preparar a edição de um caminhão
  const handleEditarCaminhao = (caminhao) => {
    setEditandoCaminhao(caminhao);
    setNovoCaminhao(caminhao); // Preenche o formulário com os dados do caminhão
    setShowNovoCaminhaoModal(true); // Abre o modal
  };

  // Função para resetar o formulário e fechar o modal
  const resetFormulario = () => {
    setNovoCaminhao({
      placa: '',
      modelo: '',
      capacidade: '',
      status: 'Disponível',
    });
    setEditandoCaminhao(null);
    setShowNovoCaminhaoModal(false);
  };

  // Função para excluir um caminhão
  const handleExcluirCaminhao = (id) => {
    // Adicionar confirmação antes de excluir
    if (window.confirm('Tem certeza que deseja excluir este caminhão?')) {
      setCaminhoes(caminhoes.filter((caminhao) => caminhao.id !== id));
    }
  };

  // Filtra os caminhões com base no status selecionado e no termo de busca
  const caminhoesFiltrados = caminhoes.filter((caminhao) => {
    const porStatus = filtroStatus ? caminhao.status === filtroStatus : true;
    const porTermo = termoBusca
      ? caminhao.placa.toLowerCase().includes(termoBusca.toLowerCase()) ||
        caminhao.modelo.toLowerCase().includes(termoBusca.toLowerCase())
      : true;
    return porStatus && porTermo;
  });

  return (
    <div className="p-0 md:p-6 bg-gray-50 min-h-screen"> {/* Ajustado padding para telas menores */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gerenciamento de Caminhões</h1>
        <p className="text-gray-500 text-sm md:text-base">Gerencie sua frota de caminhões e suas informações.</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Lista de Caminhões</h2>
        <p className="text-sm text-gray-500 mb-4">
          Total: {caminhoesFiltrados.length} caminhão(ões)
        </p>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por placa ou modelo..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
          />
          <div className="flex w-full md:w-auto gap-3">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="flex-grow md:flex-grow-0 px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Todos os Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={() => {
                resetFormulario(); // Garante que o formulário esteja limpo
                setEditandoCaminhao(null); // Garante que não está em modo de edição
                setShowNovoCaminhaoModal(true);
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-all duration-300"
            >
              <FaPlus /> <span className="hidden md:inline">Adicionar Caminhão</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Placa</th>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Modelo</th>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Capacidade (KG)</th>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Status</th>
                <th className="text-center px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {caminhoesFiltrados.map((caminhao) => (
                <tr key={caminhao.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-sky-100 text-sky-700 rounded-full w-8 h-8 flex items-center justify-center text-xs md:text-sm font-bold">
                        {caminhao.placa.substring(0, 3)} {/* Mostra os 3 primeiros caracteres da placa */}
                      </div>
                      <div>
                        <p className="font-semibold text-sm md:text-base">{caminhao.placa}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-sm md:text-base">{caminhao.modelo}</td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-sm md:text-base">{caminhao.capacidade.toLocaleString('pt-BR')} kg</td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${
                        caminhao.status === 'Disponível'
                          ? 'bg-green-100 text-green-700'
                          : caminhao.status === 'Em Uso'
                          ? 'bg-blue-100 text-blue-700'
                          : caminhao.status === 'Em Manutenção'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {caminhao.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                    <button
                      onClick={() => handleEditarCaminhao(caminhao)}
                      className="text-blue-500 hover:text-blue-700 mr-2 p-1"
                      aria-label="Editar"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleExcluirCaminhao(caminhao.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Excluir"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {caminhoesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    Nenhum caminhão encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs md:text-sm text-gray-500 mt-4">
          Mostrando {caminhoesFiltrados.length} de {caminhoes.length} caminhões
        </p>
      </div>

      {/* Modal de adicionar/editar caminhão */}
      {showNovoCaminhaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">
                {editandoCaminhao ? 'Editar Caminhão' : 'Cadastrar Novo Caminhão'}
              </h3>
              <button onClick={resetFormulario} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAdicionarCaminhao(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={novoCaminhao.placa}
                  onChange={(e) =>
                    setNovoCaminhao({ ...novoCaminhao, placa: e.target.value.toUpperCase() })
                  }
                  placeholder="ABC-1234 ou ABC1D23"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={novoCaminhao.modelo}
                  onChange={(e) =>
                    setNovoCaminhao({ ...novoCaminhao, modelo: e.target.value })
                  }
                  placeholder="Ex: Volvo FH 540"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidade de Carga (KG) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={novoCaminhao.capacidade}
                  onChange={(e) =>
                    setNovoCaminhao({ ...novoCaminhao, capacidade: e.target.value })
                  }
                  placeholder="Ex: 25000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={novoCaminhao.status}
                  onChange={(e) =>
                    setNovoCaminhao({ ...novoCaminhao, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white"
                  required
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetFormulario}
                  className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                >
                  {editandoCaminhao ? 'Salvar Alterações' : 'Cadastrar Caminhão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Caminhoes;
