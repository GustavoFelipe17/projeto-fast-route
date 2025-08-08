import { useState } from 'react';
import { FaUserFriends, FaPlus, FaEdit, FaTrash, FaIdCard } from 'react-icons/fa';

function Motoristas({ motoristas, onSalvar, onEditar, onExcluir }) {
  const [showNovoMotoristaModal, setShowNovoMotoristaModal] = useState(false);
  const [showEditarMotoristaModal, setShowEditarMotoristaModal] = useState(false);
  const [motoristaParaEditar, setMotoristaParaEditar] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  // Opções de status para os motoristas
  const statusOptions = ['Disponível', 'Em serviço', 'Indisponível'];

  const handleSalvarMotorista = (e) => {
    e.preventDefault();
    const novoMotorista = {
      nome: e.target.nome.value,
      email: e.target.email.value,
      telefone: e.target.telefone.value,
      cnh: e.target.cnh.value,
      categoria: e.target.categoria.value,
      status: 'Disponível'
    };
    
    onSalvar(novoMotorista); // ← Chama a função do Dashboard
    setShowNovoMotoristaModal(false);
    e.target.reset();
  };

  const handleEditarMotorista = (e) => {
    e.preventDefault();
    const dadosAtualizados = {
      nome: e.target.nome.value,
      email: e.target.email.value,
      telefone: e.target.telefone.value,
      cnh: e.target.cnh.value,
      categoria: e.target.categoria.value,
      status: e.target.status.value
    };
    
    onEditar(motoristaParaEditar.id, dadosAtualizados); // ← Chama a função do Dashboard
    setShowEditarMotoristaModal(false);
    setMotoristaParaEditar(null);
  };

  const abrirModalEdicao = (motorista) => {
    setMotoristaParaEditar(motorista);
    setShowEditarMotoristaModal(true);
  };

  // Filtra os motoristas com base no status selecionado e no termo de busca
  const motoristasFiltrados = motoristas.filter((motorista) => {
    const porStatus = filtroStatus ? motorista.status === filtroStatus : true;
    const porTermo = termoBusca
      ? motorista.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        motorista.email.toLowerCase().includes(termoBusca.toLowerCase()) ||
        motorista.cnh.toLowerCase().includes(termoBusca.toLowerCase())
      : true;
    return porStatus && porTermo;
  });

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Gerenciamento de Motoristas</h2>
          <p className="text-sm text-gray-500">Cadastre e gerencie os motoristas da frota.</p>
        </div>
      </div>

      {/* Lista de Motoristas */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Lista de Motoristas</h2>
        <p className="text-sm text-gray-500 mb-4">
          Total: {motoristasFiltrados.length} motorista(s)
        </p>

        {/* Filtros e Botão de Adicionar */}
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por nome, email ou CNH..."
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
              onClick={() => setShowNovoMotoristaModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-all duration-300"
            >
              <FaPlus /> <span className="hidden md:inline">Adicionar Motorista</span>
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Nome</th>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Email</th>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Telefone</th>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">CNH</th>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Status</th>
                <th className="text-center px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {motoristasFiltrados.map((motorista) => (
                <tr key={motorista.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-xs md:text-sm font-bold">
                        <FaUserFriends />
                      </div>
                      <div>
                        <p className="font-semibold text-sm md:text-base">{motorista.nome}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-sm md:text-base">{motorista.email}</td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-sm md:text-base">{motorista.telefone}</td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-sm md:text-base">
                    <div className="flex items-center gap-1">
                      <FaIdCard className="text-gray-400" />
                      {motorista.cnh} (Cat. {motorista.categoria})
                    </div>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${
                        motorista.status === 'Disponível'
                          ? 'bg-green-100 text-green-700'
                          : motorista.status === 'Em serviço'
                          ? 'bg-blue-100 text-blue-700'
                          : motorista.status === 'Indisponível'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {motorista.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                    <button
                      onClick={() => abrirModalEdicao(motorista)}
                      className="text-blue-500 hover:text-blue-700 mr-2 p-1"
                      aria-label="Editar"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => onExcluir(motorista.id)} // ← Chama a função do Dashboard
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Excluir"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {motoristasFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    <FaUserFriends className="mx-auto text-3xl mb-2" />
                    <p>Nenhum motorista encontrado.</p>
                    <p className="text-sm">Ajuste os filtros ou adicione um novo motorista.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs md:text-sm text-gray-500 mt-4">
          Mostrando {motoristasFiltrados.length} de {motoristas.length} motoristas
        </p>
      </div>

      {/* Modal Novo Motorista */}
      {showNovoMotoristaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Cadastrar Novo Motorista</h3>
              <button 
                onClick={() => setShowNovoMotoristaModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSalvarMotorista}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="nome" 
                    required 
                    placeholder="Nome completo do motorista"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="email@exemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="telefone" 
                    required 
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CNH <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="cnh" 
                      required 
                      placeholder="12345678901"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Categoria <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="categoria" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white"
                    >
                      <option value="">Selecionar</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowNovoMotoristaModal(false)} 
                  className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                >
                  Cadastrar Motorista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Motorista */}
      {showEditarMotoristaModal && motoristaParaEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Editar Motorista</h3>
              <button 
                onClick={() => { setShowEditarMotoristaModal(false); setMotoristaParaEditar(null); }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditarMotorista}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="nome" 
                    required 
                    defaultValue={motoristaParaEditar.nome}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    defaultValue={motoristaParaEditar.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="telefone" 
                    required 
                    defaultValue={motoristaParaEditar.telefone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CNH <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="cnh" 
                      required 
                      defaultValue={motoristaParaEditar.cnh}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Categoria <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="categoria" 
                      required 
                      defaultValue={motoristaParaEditar.categoria}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white"
                    >
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="status" 
                    required 
                    defaultValue={motoristaParaEditar.status}
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
                  onClick={() => { setShowEditarMotoristaModal(false); setMotoristaParaEditar(null); }} 
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

export default Motoristas;