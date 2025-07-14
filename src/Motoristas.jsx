import React, { useState } from 'react';
import { FaPlus, FaTrash, FaPhoneAlt, FaEnvelope, FaIdCard, FaUserPlus, FaEdit } from 'react-icons/fa'; // Adicionado FaEdit

function formatarTelefone(numero) {
  if (!numero) return '';
  return numero
    .replace(/\D/g, '') // Remove caracteres não numéricos
    .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3'); // Formata o número
}

function Motoristas({ motoristas, setMotoristas }) {
  const [novoMotorista, setNovoMotorista] = useState({
    nome: '',
    email: '',
    telefone: '',
    cnh: '',
    categoria: '',
    status: 'Disponível',
  });
  const [showNovoMotoristaModal, setShowNovoMotoristaModal] = useState(false);
  const [editandoMotorista, setEditandoMotorista] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [termoBusca, setTermoBusca] = useState(''); // Estado para o termo de busca

  // Estados para o modal de confirmação de exclusão
  const [showConfirmarExclusaoModal, setShowConfirmarExclusaoModal] = useState(false);
  const [motoristaParaExcluir, setMotoristaParaExcluir] = useState(null);

  const handleAdicionarMotorista = () => {
    if (novoMotorista.nome.trim() === '') {
        alert('O nome do motorista é obrigatório.'); // Feedback para o usuário
        return;
    }
    // Adicionar mais validações se necessário (email, cnh, etc.)

    if (editandoMotorista) {
      setMotoristas(
        motoristas.map((motorista) =>
          motorista.id === editandoMotorista.id ? { ...editandoMotorista, ...novoMotorista } : motorista
        )
      );
    } else {
      setMotoristas([...motoristas, { id: Date.now(), ...novoMotorista }]);
    }
    resetFormulario();
  };

  const handleEditarMotorista = (motorista) => {
    setEditandoMotorista(motorista);
    setNovoMotorista(motorista);
    setShowNovoMotoristaModal(true);
  };

  const resetFormulario = () => {
    setNovoMotorista({
      nome: '',
      email: '',
      telefone: '',
      cnh: '',
      categoria: '',
      status: 'Disponível',
    });
    setEditandoMotorista(null);
    setShowNovoMotoristaModal(false);
  };

  // Modificado para abrir o modal de confirmação
  const handleExcluirMotorista = (motoristaParaConfirmar) => {
    // Verifica se o motorista está 'Em serviço'
    if (motoristaParaConfirmar.status === 'Em serviço') {
      alert(`O motorista ${motoristaParaConfirmar.nome} está em serviço e não pode ser excluído.`);
      return; // Impede a exclusão
    }
    setMotoristaParaExcluir(motoristaParaConfirmar);
    setShowConfirmarExclusaoModal(true);
  };

  // Nova função para executar a exclusão após confirmação
  const executarExclusaoMotorista = () => {
    if (motoristaParaExcluir) {
      setMotoristas(motoristas.filter((motorista) => motorista.id !== motoristaParaExcluir.id));
      setMotoristaParaExcluir(null); // Limpa o estado
      setShowConfirmarExclusaoModal(false); // Fecha o modal
    }
  };


  // Filtrar motoristas com base no status selecionado e termo de busca
  const motoristasFiltrados = motoristas.filter(motorista => {
    const porStatus = filtroStatus ? motorista.status === filtroStatus : true;
    const porTermo = termoBusca ? 
        (motorista.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
         motorista.email.toLowerCase().includes(termoBusca.toLowerCase()) ||
         motorista.cnh.toLowerCase().includes(termoBusca.toLowerCase())) 
        : true;
    return porStatus && porTermo;
  });

  return (
    <div className="p-0 md:p-6 bg-gray-50 min-h-screen"> {/* Padding ajustado para responsividade */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gerenciamento de Motoristas</h1>
        <p className="text-gray-500 text-sm md:text-base">Gerencie seus motoristas e suas informações</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Lista de Motoristas</h2>
        <p className="text-sm text-gray-500 mb-4">
          Total: {motoristasFiltrados.length} motorista(s)
        </p>
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
              className="flex-grow md:flex-grow-0 px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white"
            >
              <option value="">Todos os Status</option>
              <option value="Disponível">Disponível</option>
              <option value="Em serviço">Em serviço</option>
              <option value="Fora de serviço">Fora de Serviço</option>
            </select>
            <button
              onClick={() => {
                resetFormulario(); // Limpa o formulário antes de abrir
                setEditandoMotorista(null); // Garante que não está em modo de edição
                setShowNovoMotoristaModal(true);
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-all duration-300"
            >
              <FaUserPlus /> <span className="hidden md:inline">Adicionar Motorista</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Nome</th>
                <th className="text-left px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">Contato</th>
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
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {motorista.nome[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm md:text-base">{motorista.nome}</p>
                        <p className="text-xs md:text-sm text-gray-500">{motorista.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    <p className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                      <FaPhoneAlt className="text-gray-500" size={12}/> {formatarTelefone(motorista.telefone)}
                    </p>
                    <p className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-500">
                      <FaEnvelope className="text-gray-500" size={12}/> {motorista.email}
                    </p>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    <p className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                      <FaIdCard className="text-gray-500" size={14}/> {motorista.cnh}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 ml-5">Categoria {motorista.categoria}</p>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${
                        motorista.status === 'Disponível'
                          ? 'bg-green-100 text-green-700'
                          : motorista.status === 'Em serviço'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700' // Alterado para vermelho para 'Fora de serviço'
                      }`}
                    >
                      {motorista.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                    <button
                      onClick={() => handleEditarMotorista(motorista)}
                      className="text-blue-500 hover:text-blue-700 mr-2 p-1"
                      aria-label="Editar"
                    >
                      <FaEdit size={16}/>
                    </button>
                    <button
                      onClick={() => handleExcluirMotorista(motorista)} // Passa o objeto motorista completo
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Excluir"
                    >
                      <FaTrash size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
              {motoristasFiltrados.length === 0 && (
                <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">Nenhum motorista encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs md:text-sm text-gray-500 mt-4">
          Mostrando {motoristasFiltrados.length} de {motoristas.length} motoristas
        </p>
      </div>

      {/* Modal de adicionar/editar motorista */}
      {showNovoMotoristaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                {editandoMotorista ? 'Editar Motorista' : 'Adicionar Novo Motorista'}
                </h3>
                <button onClick={resetFormulario} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <form onSubmit={(e) => {e.preventDefault(); handleAdicionarMotorista();}} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={novoMotorista.nome}
                  onChange={(e) =>
                    setNovoMotorista({ ...novoMotorista, nome: e.target.value })
                  }
                  placeholder="Ex: João Silva"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={novoMotorista.email}
                  onChange={(e) =>
                    setNovoMotorista({ ...novoMotorista, email: e.target.value })
                  }
                  placeholder="Ex: joao@exemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={novoMotorista.telefone}
                  onChange={(e) =>
                    setNovoMotorista({
                      ...novoMotorista,
                      telefone: formatarTelefone(e.target.value),
                    })
                  }
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  maxLength="15"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número da CNH
                  </label>
                  <input
                    type="text"
                    value={novoMotorista.cnh}
                    onChange={(e) =>
                      setNovoMotorista({ ...novoMotorista, cnh: e.target.value.replace(/\D/g, '') }) // Permite apenas números
                    }
                    placeholder="00000000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                    maxLength="11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria CNH
                  </label>
                  <select
                    value={novoMotorista.categoria}
                    onChange={(e) =>
                      setNovoMotorista({ ...novoMotorista, categoria: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white"
                  >
                    <option value="">Selecione</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="AB">AB</option>
                    <option value="AC">AC</option>
                    <option value="AD">AD</option>
                    <option value="AE">AE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={novoMotorista.status}
                  onChange={(e) =>
                    setNovoMotorista({ ...novoMotorista, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white"
                >
                  <option value="Disponível">Disponível</option>
                  <option value="Em serviço">Em serviço</option>
                  <option value="Fora de serviço">Fora de serviço</option>
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
                  type="submit" // Mudado para submit para que o onSubmit do form seja acionado
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                >
                  {editandoMotorista ? 'Salvar Alterações' : 'Adicionar Motorista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão de Motorista */}
      {showConfirmarExclusaoModal && motoristaParaExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-red-600">Excluir Motorista</h3>
                <button onClick={() => {setShowConfirmarExclusaoModal(false); setMotoristaParaExcluir(null);}} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <p className="mb-6 text-gray-700">
              Tem certeza que deseja excluir o motorista <strong className="font-semibold">{motoristaParaExcluir.nome}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmarExclusaoModal(false);
                  setMotoristaParaExcluir(null);
                }}
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executarExclusaoMotorista}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Motoristas;
