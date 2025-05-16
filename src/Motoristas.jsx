import React, { useState } from 'react';
import { FaPlus, FaTrash, FaPhoneAlt, FaEnvelope, FaIdCard, FaUserPlus } from 'react-icons/fa';

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
  const [filtroStatus, setFiltroStatus] = useState(''); // Estado para o filtro de status

  const handleAdicionarMotorista = () => {
    if (novoMotorista.nome.trim() === '') return;
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

  const handleExcluirMotorista = (id) => {
    setMotoristas(motoristas.filter((motorista) => motorista.id !== id));
  };

  // Filtrar motoristas com base no status selecionado
  const motoristasFiltrados = filtroStatus
    ? motoristas.filter((motorista) => motorista.status === filtroStatus)
    : motoristas;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Motoristas</h1>
        <p className="text-gray-500">Gerencie seus motoristas e suas informações</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Lista de Motoristas</h2>
        <p className="text-sm text-gray-500 mb-4">
          Total: {motoristasFiltrados.length} motorista(s)
        </p>
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar por nome, email ou CNH..."
            className="w-1/3 px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">Todos</option>
            <option value="Disponível">Disponível</option>
            <option value="Em serviço">Em serviço</option>
            <option value="Fora de serviço">Fora de Serviço</option>
          </select>
          <button
            onClick={() => setShowNovoMotoristaModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-all duration-300"
          >
            <FaUserPlus /> Adicionar Motorista
          </button>
        </div>
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Nome</th>
              <th className="text-left px-4 py-2">Contato</th>
              <th className="text-left px-4 py-2">CNH</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-center px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {motoristasFiltrados.map((motorista) => (
              <tr key={motorista.id} className="border-t">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="font-bold">{motorista.nome[0]}</span>
                    </div>
                    <div>
                      <p className="font-bold">{motorista.nome}</p>
                      <p className="text-sm text-gray-500">{motorista.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <p className="flex items-center gap-2">
                    <FaPhoneAlt className="text-gray-500" /> {formatarTelefone(motorista.telefone)}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <FaEnvelope className="text-gray-500" /> {motorista.email}
                  </p>
                </td>
                <td className="px-4 py-2">
                  <p className="flex items-center gap-2">
                    <FaIdCard className="text-gray-500" /> {motorista.cnh}
                  </p>
                  <p className="text-sm text-gray-500">Categoria {motorista.categoria}</p>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      motorista.status === 'Disponível'
                        ? 'bg-green-100 text-green-600'
                        : motorista.status === 'Em serviço'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {motorista.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditarMotorista(motorista)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluirMotorista(motorista.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-gray-500 mt-4">
          Mostrando {motoristasFiltrados.length} de {motoristas.length} motoristas
        </p>
      </div>

      {/* Modal de adicionar/editar motorista */}
      {showNovoMotoristaModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-2">
              {editandoMotorista ? 'Editar Motorista' : 'Adicionar Motorista'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Preencha as informações para {editandoMotorista ? 'editar' : 'cadastrar'} o motorista.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={novoMotorista.nome}
                  onChange={(e) =>
                    setNovoMotorista({ ...novoMotorista, nome: e.target.value })
                  }
                  placeholder="João Silva"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={novoMotorista.email}
                  onChange={(e) =>
                    setNovoMotorista({ ...novoMotorista, email: e.target.value })
                  }
                  placeholder="joao@exemplo.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Número da CNH
                  </label>
                  <input
                    type="text"
                    value={novoMotorista.cnh}
                    onChange={(e) =>
                      setNovoMotorista({ ...novoMotorista, cnh: e.target.value })
                    }
                    placeholder="00000000000"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoria
                  </label>
                  <select
                    value={novoMotorista.categoria}
                    onChange={(e) =>
                      setNovoMotorista({ ...novoMotorista, categoria: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Selecione</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={novoMotorista.status}
                  onChange={(e) =>
                    setNovoMotorista({ ...novoMotorista, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="Disponível">Disponível</option>
                  <option value="Em serviço">Em Serviço</option>
                  <option value="Fora de serviço">Fora de Serviço</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetFormulario}
                  className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md border"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAdicionarMotorista}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
                >
                  {editandoMotorista ? 'Salvar' : 'Adicionar Motorista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Motoristas;