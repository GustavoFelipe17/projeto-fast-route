import { useState } from 'react';
import { FaTruckMoving, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function Caminhoes({ caminhoes, onSalvar, onEditar, onExcluir }) {
  const [showNovoCaminhaoModal, setShowNovoCaminhaoModal] = useState(false);
  const [showEditarCaminhaoModal, setShowEditarCaminhaoModal] = useState(false);
  const [caminhaoParaEditar, setCaminhaoParaEditar] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  // Opções de status para os caminhões
  const statusOptions = ['Disponível', 'Em Uso', 'Em Manutenção'];

  const handleSalvarCaminhao = (e) => {
    e.preventDefault();
    const novoCaminhao = {
      placa: e.target.placa.value.toUpperCase(),
      modelo: e.target.modelo.value,
      capacidade: parseFloat(e.target.capacidade.value),
      status: 'Disponível'
    };
    
    onSalvar(novoCaminhao); // ← Chama a função do Dashboard
    setShowNovoCaminhaoModal(false);
    e.target.reset();
  };

  const handleEditarCaminhao = (e) => {
    e.preventDefault();
    const dadosAtualizados = {
      placa: e.target.placa.value.toUpperCase(),
      modelo: e.target.modelo.value,
      capacidade: parseFloat(e.target.capacidade.value),
      status: e.target.status.value
    };
    
    onEditar(caminhaoParaEditar.id, dadosAtualizados); // ← Chama a função do Dashboard
    setShowEditarCaminhaoModal(false);
    setCaminhaoParaEditar(null);
  };

  const abrirModalEdicao = (caminhao) => {
    setCaminhaoParaEditar(caminhao);
    setShowEditarCaminhaoModal(true);
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
    <>
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Gerenciamento de Caminhões</h2>
          <p className="text-sm text-gray-500">Gerencie sua frota de caminhões e suas informações.</p>
        </div>
      </div>

      {/* Lista de Caminhões */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Lista de Caminhões</h2>
        <p className="text-sm text-gray-500 mb-4">
          Total: {caminhoesFiltrados.length} caminhão(ões)
        </p>

        {/* Filtros e Botão de Adicionar */}
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
              onClick={() => setShowNovoCaminhaoModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-all duration-300"
            >
              <FaPlus /> <span className="hidden md:inline">Adicionar Caminhão</span>
            </button>
          </div>
        </div>

        {/* Tabela */}
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
                        <FaTruckMoving />
                      </div>
                      <div>
                        <p className="font-semibold text-sm md:text-base">{caminhao.placa}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-sm md:text-base">{caminhao.modelo}</td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-sm md:text-base">
                    {caminhao.capacidade?.toLocaleString('pt-BR')} kg
                  </td>
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
                      onClick={() => abrirModalEdicao(caminhao)}
                      className="text-blue-500 hover:text-blue-700 mr-2 p-1"
                      aria-label="Editar"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => onExcluir(caminhao.id)} // ← Chama a função do Dashboard
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
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    <FaTruckMoving className="mx-auto text-3xl mb-2" />
                    <p>Nenhum caminhão encontrado.</p>
                    <p className="text-sm">Ajuste os filtros ou adicione um novo caminhão.</p>
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

      {/* Modal Novo Caminhão */}
      {showNovoCaminhaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Cadastrar Novo Caminhão</h3>
              <button 
                onClick={() => setShowNovoCaminhaoModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSalvarCaminhao}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Placa <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="placa" 
                    required 
                    placeholder="ABC-1234 ou ABC1D23"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="modelo" 
                    required 
                    placeholder="Ex: Volvo FH 540"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacidade de Carga (KG) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="capacidade" 
                    required 
                    min="1"
                    step="0.01"
                    placeholder="Ex: 25000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowNovoCaminhaoModal(false)} 
                  className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                >
                  Cadastrar Caminhão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Caminhão */}
      {showEditarCaminhaoModal && caminhaoParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Editar Caminhão</h3>
              <button 
                onClick={() => { setShowEditarCaminhaoModal(false); setCaminhaoParaEditar(null); }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditarCaminhao}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Placa <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="placa" 
                    required 
                    defaultValue={caminhaoParaEditar.placa}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="modelo" 
                    required 
                    defaultValue={caminhaoParaEditar.modelo}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacidade de Carga (KG) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="capacidade" 
                    required 
                    min="1"
                    step="0.01"
                    defaultValue={caminhaoParaEditar.capacidade}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="status" 
                    required 
                    defaultValue={caminhaoParaEditar.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => { setShowEditarCaminhaoModal(false); setCaminhaoParaEditar(null); }} 
                  className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Caminhoes;