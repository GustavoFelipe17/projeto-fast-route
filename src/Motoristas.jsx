import { useState } from 'react';
import { FaUserFriends, FaPlus, FaEdit, FaTrash, FaIdCard } from 'react-icons/fa';

function Motoristas({ motoristas, onSalvar, onEditar, onExcluir }) {
  const [showNovoMotoristaModal, setShowNovoMotoristaModal] = useState(false);
  const [showEditarMotoristaModal, setShowEditarMotoristaModal] = useState(false);
  const [motoristaParaEditar, setMotoristaParaEditar] = useState(null);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponível': return 'bg-green-100 text-green-800';
      case 'Em serviço': return 'bg-blue-100 text-blue-800';
      case 'Indisponível': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Gerenciamento de Motoristas</h2>
            <p className="text-sm text-gray-500">Cadastre e gerencie os motoristas da frota.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaUserFriends className="text-gray-500"/>
              Total: <span className="font-semibold">{motoristas.length}</span> motoristas
            </p>
            <button
              onClick={() => setShowNovoMotoristaModal(true)}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm"
            >
              <FaPlus /> Novo Motorista
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Motoristas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {motoristas.map((motorista) => (
          <div
            key={motorista.id}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 truncate">{motorista.nome}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(motorista.status)}`}>
                  {motorista.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold">Email:</span> {motorista.email}</p>
                <p><span className="font-semibold">Telefone:</span> {motorista.telefone}</p>
                <p className="flex items-center gap-1">
                  <FaIdCard className="text-gray-400" />
                  <span className="font-semibold">CNH:</span> {motorista.cnh} (Cat. {motorista.categoria})
                </p>
              </div>
            </div>

            <div className="flex gap-2 p-4 pt-0 md:p-5 md:pt-0">
              <button
                onClick={() => abrirModalEdicao(motorista)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <FaEdit /> Editar
              </button>
              <button
                onClick={() => onExcluir(motorista.id)} // ← Chama a função do Dashboard
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <FaTrash /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {motoristas.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <FaUserFriends className="mx-auto text-4xl mb-2" />
          <p>Nenhum motorista cadastrado.</p>
          <p className="text-sm">Clique em "Novo Motorista" para começar.</p>
        </div>
      )}

      {/* Modal Novo Motorista */}
      {showNovoMotoristaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Novo Motorista</h3>
              <button 
                onClick={() => setShowNovoMotoristaModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSalvarMotorista} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nome Completo</label>
                <input 
                  name="nome" 
                  type="text" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="Nome completo do motorista"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
                <input 
                  name="telefone" 
                  type="tel" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">CNH</label>
                  <input 
                    name="cnh" 
                    type="text" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                    placeholder="12345678901"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
                  <select 
                    name="categoria" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Selecionar</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
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
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                >
                  Salvar
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
            
            <form onSubmit={handleEditarMotorista} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nome Completo</label>
                <input 
                  name="nome" 
                  type="text" 
                  required 
                  defaultValue={motoristaParaEditar.nome}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  defaultValue={motoristaParaEditar.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
                <input 
                  name="telefone" 
                  type="tel" 
                  required 
                  defaultValue={motoristaParaEditar.telefone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">CNH</label>
                  <input 
                    name="cnh" 
                    type="text" 
                    required 
                    defaultValue={motoristaParaEditar.cnh}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
                  <select 
                    name="categoria" 
                    required 
                    defaultValue={motoristaParaEditar.categoria}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select 
                  name="status" 
                  required 
                  defaultValue={motoristaParaEditar.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="Disponível">Disponível</option>
                  <option value="Em serviço">Em serviço</option>
                  <option value="Indisponível">Indisponível</option>
                </select>
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