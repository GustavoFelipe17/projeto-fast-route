import { useState, useRef, useEffect } from 'react';
import {
  FaClipboardList,
  FaUserFriends,
  FaTruckMoving,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaPlus,
  FaTrash,
} from 'react-icons/fa';
import Motoristas from './Motoristas';
import Caminhoes from './Caminhoes';
import Estatisticas from './Estatisticas';

// Função para gerar uma data aleatória nos últimos X dias
const getRandomDateLastXDays = (days) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * days));
  return pastDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

function Dashboard({ onLogout }) {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const [statusSelecionado, setStatusSelecionado] = useState('Em Progresso');
  
  const [tarefas, setTarefas] = useState(() => {
    try {
      const savedTarefas = localStorage.getItem('tarefas');
      return savedTarefas ? JSON.parse(savedTarefas) : [
        { id: 1, codigo: 'T001', cliente: 'Cliente Alpha', endereco: 'Rua A, 123', tipo: 'Entrega', equipamento: 'TUBULAR', peso: '100', status: 'Concluída', motorista: 'Motorista 1', caminhao: 'ABC-1234', dataFinalizacao: getRandomDateLastXDays(60) },
        { id: 2, codigo: 'T002', cliente: 'Cliente Beta', endereco: 'Av. B, 456', tipo: 'Retirada', equipamento: 'ESCORA', peso: '250', status: 'Concluída', motorista: 'Motorista 1', caminhao: 'ABC-1234', dataFinalizacao: getRandomDateLastXDays(60) },
        { id: 3, codigo: 'T003', cliente: 'Cliente Charlie', endereco: 'Praça C, 789', tipo: 'Entrega', equipamento: 'MULTIDIRECIONAL', peso: '500', status: 'Em Progresso', motorista: 'Motorista 2', caminhao: 'DEF-5678', dataFinalizacao: null },
        { id: 4, codigo: 'T004', cliente: 'Cliente Delta', endereco: 'Rod. D, km 10', tipo: 'Entrega', equipamento: 'FACHADEIRO', peso: '300', status: 'Cancelada', motorista: 'Motorista 3', caminhao: 'GHI-9012', dataFinalizacao: getRandomDateLastXDays(60) },
        { id: 5, codigo: 'T005', cliente: 'Cliente Echo', endereco: 'Al. E, 101', tipo: 'Retirada', equipamento: 'TUBO EQUIPADO', peso: '150', status: 'Concluída', motorista: 'Motorista 1', caminhao: 'ABC-1234', dataFinalizacao: getRandomDateLastXDays(60) },
        { id: 6, codigo: 'T006', cliente: 'Cliente Foxtrot', endereco: 'Rua F, 202', tipo: 'Entrega', equipamento: 'TUBULAR', peso: '120', status: 'Pendente', motorista: '', caminhao: '', dataFinalizacao: null },
        { id: 7, codigo: 'T007', cliente: 'Cliente Golf', endereco: 'Av. G, 303', tipo: 'Entrega', equipamento: 'ESCORA', peso: '220', status: 'Concluída', motorista: 'Motorista 2', caminhao: 'DEF-5678', dataFinalizacao: getRandomDateLastXDays(60) },
        { id: 8, codigo: 'T008', cliente: 'Cliente Hotel', endereco: 'Rua H, 404', tipo: 'Retirada', equipamento: 'MULTIDIRECIONAL', peso: '600', status: 'Cancelada', motorista: 'Motorista 3', caminhao: 'GHI-9012', dataFinalizacao: getRandomDateLastXDays(60) },
        { id: 9, codigo: 'T009', cliente: 'Cliente India', endereco: 'Av. I, 505', tipo: 'Entrega', equipamento: 'FACHADEiro', peso: '350', status: 'Concluída', motorista: 'Motorista 1', caminhao: 'ABC-1234', dataFinalizacao: getRandomDateLastXDays(60) },
        { id: 10, codigo: 'T010', cliente: 'Cliente Juliet', endereco: 'Av. J, 606', tipo: 'Retirada', equipamento: 'TUBULAR', peso: '180', status: 'Concluída', motorista: 'Motorista 2', caminhao: 'DEF-5678', dataFinalizacao: getRandomDateLastXDays(30) },
        { id: 11, codigo: 'T011', cliente: 'Cliente Kilo', endereco: 'Rua K, 707', tipo: 'Entrega', equipamento: 'ESCORA', peso: '320', status: 'Cancelada', motorista: 'Motorista 3', caminhao: 'GHI-9012', dataFinalizacao: getRandomDateLastXDays(30) },
        { id: 12, codigo: 'T012', cliente: 'Cliente Lima', endereco: 'Praça L, 808', tipo: 'Retirada', equipamento: 'FACHADEIRO', peso: '400', status: 'Concluída', motorista: 'Motorista 1', caminhao: 'JKL-3456', dataFinalizacao: getRandomDateLastXDays(30) },
      ];
    } catch (error) {
      console.error("Failed to parse tarefas from localStorage", error);
      return []; // Return empty array on error
    }
  });
  const [showNovaOperacaoModal, setShowNovaOperacaoModal] = useState(false);
  const [showDesignarModal, setShowDesignarModal] = useState(false);
  const [showAvisoModal, setShowAvisoModal] = useState(false);
  const [taskToRemove, setTaskToRemove] = useState(null);
  
  const [motoristaDesignado, setMotoristaDesignado] = useState('');
  const [caminhaoDesignado, setCaminhaoDesignado] = useState('');
  const [tarefaParaDesignar, setTarefaParaDesignar] = useState(null);

  const [showConfirmarOperacaoModal, setShowConfirmarOperacaoModal] = useState(false);
  const [taskToConfirm, setTaskToConfirm] = useState(null);

  const [showCancelarOperacaoModal, setShowCancelarOperacaoModal] = useState(false);
  const [taskToCancel, setTaskToCancel] = useState(null);

  const [abaSelecionada, setAbaSelecionada] = useState('Tarefas');
  
  const [motoristas, setMotoristas] = useState(() => {
    try {
      const savedMotoristas = localStorage.getItem('motoristas');
      return savedMotoristas ? JSON.parse(savedMotoristas) : [
        { id: 1, nome: 'Motorista 1', email: 'm1@example.com', telefone: '11999990001', cnh: '12345678901', categoria: 'D', status: 'Disponível' },
        { id: 2, nome: 'Motorista 2', email: 'm2@example.com', telefone: '11999990002', cnh: '12345678902', categoria: 'E', status: 'Em serviço' },
        { id: 3, nome: 'Motorista 3', email: 'm3@example.com', telefone: '11999990003', cnh: '12345678903', categoria: 'D', status: 'Disponível' },
      ];
    } catch (error) {
      console.error("Failed to parse motoristas from localStorage", error);
      return [];
    }
  });

  const [caminhoes, setCaminhoes] = useState(() => {
    try {
      const savedCaminhoes = localStorage.getItem('caminhoes');
      return savedCaminhoes ? JSON.parse(savedCaminhoes) : [
        { id: 1, placa: 'ABC-1234', modelo: 'Volvo FH 540', capacidade: 25000, status: 'Disponível' },
        { id: 2, placa: 'DEF-5678', modelo: 'Scania R450', capacidade: 27000, status: 'Em Uso' },
        { id: 3, placa: 'GHI-9012', modelo: 'Mercedes Actros', capacidade: 26000, status: 'Em Manutenção' },
        { id: 4, placa: 'JKL-3456', modelo: 'VW Constellation', capacidade: 23000, status: 'Disponível' },
      ];
    } catch (error) {
      console.error("Failed to parse caminhoes from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  useEffect(() => {
    localStorage.setItem('motoristas', JSON.stringify(motoristas));
  }, [motoristas]);

  useEffect(() => {
    localStorage.setItem('caminhoes', JSON.stringify(caminhoes));
  }, [caminhoes]);

  const handleNovaOperacao = () => {
    setShowNovaOperacaoModal(true);
  };

  const handleSalvarNovaTarefa = (novaTarefa) => {
    setTarefas([...tarefas, { ...novaTarefa, id: Date.now(), status: 'Pendente', motorista: '', caminhao: '', dataFinalizacao: null }]);
    setShowNovaOperacaoModal(false);
  };

  const handleDesignar = (tarefa) => {
    setTarefaParaDesignar(tarefa);
    setMotoristaDesignado(tarefa.motorista || '');
    setCaminhaoDesignado(tarefa.caminhao || '');
    setShowDesignarModal(true);
  };

  const handleDesignarTarefa = () => {
    if (!motoristaDesignado || !caminhaoDesignado) {
      setShowAvisoModal(true);
    } else {
      const tarefasAtualizadas = tarefas.map(t =>
        t.id === tarefaParaDesignar.id
          ? { ...t, status: 'Designada', motorista: motoristaDesignado, caminhao: caminhaoDesignado, dataFinalizacao: null } 
          : t
      );
      setTarefas(tarefasAtualizadas);

      setShowDesignarModal(false);
      setTarefaParaDesignar(null);
      setMotoristaDesignado('');
      setCaminhaoDesignado('');
    }
  };

  const handleExcluir = (tarefaParaExcluir) => {
    if (tarefaParaExcluir.motorista) {
        setMotoristas(motoristas.map(m => m.nome === tarefaParaExcluir.motorista ? {...m, status: 'Disponível'} : m));
    }
    if (tarefaParaExcluir.caminhao) {
        setCaminhoes(caminhoes.map(c => c.placa === tarefaParaExcluir.caminhao ? {...c, status: 'Disponível'} : c));
    }
    setTarefas(tarefas.filter(t => t.id !== tarefaParaExcluir.id));
  };

  const handleConfirmar = (tarefaId) => {
    const tarefa = tarefas.find(t => t.id === tarefaId);
    if (tarefa) {
      setTaskToConfirm(tarefa);
      setShowConfirmarOperacaoModal(true);
    }
  };

  const executeConfirmarOperacao = () => {
    if (!taskToConfirm) return;
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === taskToConfirm.id
        ? { ...tarefa, status: 'Em Progresso', dataFinalizacao: null } 
        : tarefa
    ));
    setShowConfirmarOperacaoModal(false);
    setTaskToConfirm(null);
  };
  
  const handleConcluirTarefa = (tarefaId) => {
    const hoje = new Date().toISOString().split('T')[0]; 
    setTarefas(tarefas.map(t => t.id === tarefaId ? { ...t, status: 'Concluída', dataFinalizacao: hoje } : t));
    const tarefaConcluida = tarefas.find(t => t.id === tarefaId);
    if (tarefaConcluida) {
        if (tarefaConcluida.motorista) {
            setMotoristas(motoristas.map(m => m.nome === tarefaConcluida.motorista ? {...m, status: 'Disponível'} : m));
        }
        if (tarefaConcluida.caminhao) {
            setCaminhoes(caminhoes.map(c => c.placa === tarefaConcluida.caminhao ? {...c, status: 'Disponível'} : c));
        }
    }
  };

  const handleCancelarConfirmacaoOperacao = () => {
    setShowConfirmarOperacaoModal(false);
    setTaskToConfirm(null);
  };

  const handleCancelarStatus = (tarefaId) => {
    const tarefa = tarefas.find(t => t.id === tarefaId);
    if (tarefa) {
      setTaskToCancel(tarefa);
      setShowCancelarOperacaoModal(true);
    }
  };

  const executeCancelarOperacao = () => {
    if (!taskToCancel) return;
    const hoje = new Date().toISOString().split('T')[0]; 
    const tarefaCancelada = tarefas.find(t => t.id === taskToCancel.id);
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === taskToCancel.id ? { ...tarefa, status: 'Cancelada', dataFinalizacao: hoje } : tarefa
    ));
    if (tarefaCancelada && tarefaCancelada.motorista) {
        setMotoristas(motoristas.map(m => m.nome === tarefaCancelada.motorista ? {...m, status: 'Disponível'} : m));
    }
    if (tarefaCancelada && tarefaCancelada.caminhao) {
        setCaminhoes(caminhoes.map(c => c.placa === tarefaCancelada.caminhao ? {...c, status: 'Disponível'} : c));
    }
    setShowCancelarOperacaoModal(false);
    setTaskToCancel(null);
  };

  const handleFecharModalCancelamento = () => {
    setShowCancelarOperacaoModal(false);
    setTaskToCancel(null);
  };

  const statusList = [
    { nome: 'Pendentes', cor: 'bg-yellow-100 text-yellow-800', chave: 'Pendente' },
    { nome: 'Designadas', cor: 'bg-blue-100 text-blue-800', chave: 'Designada' },
    { nome: 'Em Progresso', cor: 'bg-indigo-100 text-indigo-800', chave: 'Em Progresso' },
    { nome: 'Concluídas', cor: 'bg-green-100 text-green-800', chave: 'Concluída' },
    { nome: 'Canceladas', cor: 'bg-red-100 text-red-800', chave: 'Cancelada' },
  ];

  const tarefasFiltradas = statusSelecionado === 'Todos'
    ? tarefas
    : tarefas.filter(t => t.status === statusSelecionado);

  return (
    <>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="flex min-h-screen bg-gray-50">
        <aside className={`fixed z-30 top-0 left-0 h-full w-56 bg-gradient-to-b from-[#1f1036] to-[#06334b] text-white flex flex-col justify-between transform transition-transform duration-300 ${sidebarAberta ? 'translate-x-0' : '-translate-x-full'}`}>
          <div>
            <div className="p-6 text-xl font-bold flex items-center gap-2">
              <FaTruckMoving className="text-2xl text-white" />
              <span>Fast Route</span>
            </div>
            <nav className="px-4">
              <p className="uppercase text-xs text-gray-300 font-semibold mb-2 mt-4">Gerenciamento</p>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <button
                    onClick={() => setAbaSelecionada('Tarefas')}
                    className={`flex items-center gap-3 text-white hover:bg-sky-800 px-3 py-2 rounded transition w-full text-left ${abaSelecionada === 'Tarefas' ? 'bg-sky-900' : ''}`}
                  >
                    <FaClipboardList className="text-base" /> Tarefas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaSelecionada('Motoristas')}
                    className={`flex items-center gap-3 text-white hover:bg-sky-800 px-3 py-2 rounded transition w-full text-left ${abaSelecionada === 'Motoristas' ? 'bg-sky-900' : ''}`}
                  >
                    <FaUserFriends className="text-base" /> Motoristas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaSelecionada('Caminhoes')}
                    className={`flex items-center gap-3 text-white hover:bg-sky-800 px-3 py-2 rounded transition w-full text-left ${abaSelecionada === 'Caminhoes' ? 'bg-sky-900' : ''}`}
                  >
                    <FaTruckMoving className="text-base" /> Caminhões
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaSelecionada('Estatisticas')}
                    className={`flex items-center gap-3 text-white hover:bg-sky-800 px-3 py-2 rounded transition w-full text-left ${abaSelecionada === 'Estatisticas' ? 'bg-sky-900' : ''}`}
                  >
                    <FaChartBar className="text-base" /> Estatísticas
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <div className="p-4">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 rounded-md shadow-lg transition-all duration-300 text-sm"
            >
              <FaSignOutAlt className="text-base" />
              Sair
            </button>
          </div>
        </aside>

        <main className={`flex-1 p-3 md:p-6 transition-all duration-300 ${sidebarAberta ? 'ml-56' : 'ml-0'} overflow-y-auto`}>
          <header className="flex items-center justify-between pb-3 mb-6 border-b border-gray-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarAberta(!sidebarAberta)}
                className="text-sky-700 hover:text-sky-900 text-lg p-2 rounded-md hover:bg-gray-200"
              >
                <FaBars />
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-sky-900">Painel de Logística</h1>
            </div>
            <span className="text-sm text-gray-700">Admin User</span>
          </header>

          {abaSelecionada === 'Tarefas' && (
            <section>
              <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Gerenciamento de Tarefas</h2>
                    <p className="text-sm text-gray-500">Monitore e gerencie entregas e retiradas de equipamentos.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaClipboardList className="text-gray-500"/>
                        Total: <span className="font-semibold">{tarefas.length}</span> tarefas
                    </p>
                    <button
                      onClick={handleNovaOperacao}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                    >
                      <FaPlus /> Nova Tarefa
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                {statusList.map((status) => {
                  const count = tarefas.filter(t => t.status === status.chave).length;
                  const isActive = statusSelecionado === status.chave;
                  return (
                    <button
                      key={status.nome}
                      onClick={() => setStatusSelecionado(status.chave)}
                      className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium transition ${status.cor} ${isActive ? 'ring-2 ring-offset-1 ring-sky-500 shadow-md' : 'hover:opacity-80'}`}
                    >
                      {status.nome} <span className="font-bold">{count}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* A SEÇÃO DE "Ações para Tarefas Em Progresso" FOI REMOVIDA DESTA ÁREA */}

              {statusSelecionado === 'Designada' && (
                <div className="px-2 md:px-4 py-4">
                  <div className="flex justify-center items-center mb-3 gap-3">
                    <button
                      onClick={() => {
                        const container = document.getElementById('cards-container-designada');
                        if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full p-2 shadow-md h-10 w-10 flex items-center justify-center"
                    >
                      &lt;
                    </button>
                    <button
                      onClick={() => {
                        const container = document.getElementById('cards-container-designada');
                        if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full p-2 shadow-md h-10 w-10 flex items-center justify-center"
                    >
                      &gt;
                    </button>
                  </div>
                  <div
                    id="cards-container-designada"
                    className="flex overflow-x-auto gap-x-6 py-4 hide-scrollbar"
                  >
                    {Array.from(new Set(tarefasFiltradas.filter(t => t.status === 'Designada').map(t => t.motorista)))
                      .map((motoristaNome) => (
                        <div
                          key={motoristaNome || 'sem-motorista-designada'}
                          className="flex-shrink-0 w-[280px] sm:w-[300px] flex flex-col gap-y-4 bg-gray-100 p-3 rounded-lg shadow"
                        >
                          <h4 className="text-sm md:text-base font-bold text-sky-800 border-b border-gray-300 pb-2 truncate">
                            {motoristaNome || 'Tarefas Sem Motorista'}
                          </h4>
                          {tarefasFiltradas
                            .filter(t => t.status === 'Designada' && t.motorista === motoristaNome)
                            .map((tarefa) => (
                              <div
                                key={tarefa.id}
                                className="relative bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200 rounded-xl overflow-hidden"
                              >
                                <div className={`h-2 rounded-t-xl ${tarefa.tipo === 'Entrega' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                                <div className="px-4 pt-3 pb-1 md:px-5 md:pt-4 md:pb-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400 font-semibold">{tarefa.codigo}</span>
                                    <span className={`flex items-center gap-1 text-xs md:text-sm font-semibold ${tarefa.tipo === 'Entrega' ? 'text-blue-600' : 'text-yellow-600'}`}>
                                      <FaTruckMoving className="inline-block" />
                                      {tarefa.tipo}
                                    </span>
                                  </div>
                                  <div className="flex justify-end">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                        statusList.find(s => s.chave === tarefa.status)?.cor || 'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {tarefa.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="px-4 pb-2 md:px-5 md:pb-3">
                                  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1 leading-tight truncate">{tarefa.cliente}</h3>
                                <p className="text-xs text-gray-500 mb-2 truncate" title={tarefa.endereco}>{tarefa.endereco}</p>
                                {tarefa.data && (
                                  <p className="text-xs mb-1 truncate">
                                    <span className="font-semibold text-gray-700">Data:</span> {new Date(tarefa.data).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                                {tarefa.periodo && (
                                  <p className="text-xs mb-1 truncate">
                                    <span className="font-semibold text-gray-700">Período:</span> {tarefa.periodo}
                                  </p>
                                )}
                                <p className="text-xs mb-1 truncate">
                                  <span className="font-semibold text-gray-700">Equip.:</span> {tarefa.equipamento}
                                </p>
                                  <p className="text-xs mb-1 truncate">
                                    <span className="font-semibold text-gray-700">Peso:</span> {tarefa.peso} kg
                                  </p>
                                  {tarefa.caminhao && (
                                    <p className="text-xs mb-2 truncate">
                                      <span className="font-semibold text-gray-700">Caminhão:</span> {tarefa.caminhao}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 px-4 pb-3 md:px-5 md:pb-4">
                                  {tarefa.status === 'Pendente' && (
                                    <button
                                      onClick={() => handleDesignar(tarefa)}
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                                    >
                                      <FaClipboardList /> Designar
                                    </button>
                                  )}
                                  {tarefa.status === 'Designada' && (
                                    <button
                                      onClick={() => handleConfirmar(tarefa.id)}
                                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                                    >
                                      <FaClipboardList /> Confirmar
                                    </button>
                                  )}
                                  {tarefa.status !== 'Cancelada' && tarefa.status !== 'Concluída' && (
                                    <button
                                      onClick={() => handleCancelarStatus(tarefa.id)}
                                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setTaskToRemove(tarefa)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                                  >
                                    <FaTrash /> Excluir
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {statusSelecionado === 'Em Progresso' && (
                <div className="px-2 md:px-4 py-4">
                  <div className="flex justify-center items-center mb-3 gap-3">
                    <button
                      onClick={() => {
                        const container = document.getElementById('cards-container-progresso');
                        if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full p-2 shadow-md h-10 w-10 flex items-center justify-center"
                    >
                      &lt;
                    </button>
                    <button
                      onClick={() => {
                        const container = document.getElementById('cards-container-progresso');
                        if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full p-2 shadow-md h-10 w-10 flex items-center justify-center"
                    >
                      &gt;
                    </button>
                  </div>
                  <div
                    id="cards-container-progresso"
                    className="flex overflow-x-auto gap-x-6 py-4 hide-scrollbar"
                  >
                    {Array.from(new Set(tarefasFiltradas.filter(t => t.status === 'Em Progresso').map(t => t.motorista)))
                      .map((motoristaNome) => (
                        <div
                          key={motoristaNome || 'sem-motorista-progresso'}
                          className="flex-shrink-0 w-[280px] sm:w-[300px] flex flex-col gap-y-4 bg-gray-100 p-3 rounded-lg shadow"
                        >
                          <h4 className="text-sm md:text-base font-bold text-indigo-800 border-b border-gray-300 pb-2 truncate">
                            {motoristaNome || 'Tarefas Sem Motorista'}
                          </h4>
                          {tarefasFiltradas
                            .filter(t => t.status === 'Em Progresso' && t.motorista === motoristaNome)
                            .map((tarefa) => (
                              <div
                                key={tarefa.id}
                                className="relative bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200 rounded-xl overflow-hidden"
                              >
                                <div className={`h-2 rounded-t-xl ${tarefa.tipo === 'Entrega' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                                <div className="px-4 pt-3 pb-1 md:px-5 md:pt-4 md:pb-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400 font-semibold">{tarefa.codigo}</span>
                                    <span className={`flex items-center gap-1 text-xs md:text-sm font-semibold ${tarefa.tipo === 'Entrega' ? 'text-blue-600' : 'text-yellow-600'}`}>
                                      <FaTruckMoving className="inline-block" />
                                      {tarefa.tipo}
                                    </span>
                                  </div>
                                  <div className="flex justify-end">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                        statusList.find(s => s.chave === tarefa.status)?.cor || 'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {tarefa.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="px-4 pb-2 md:px-5 md:pb-3">
                                  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1 leading-tight truncate">{tarefa.cliente}</h3>
                                  <p className="text-xs text-gray-500 mb-2 truncate" title={tarefa.endereco}>{tarefa.endereco}</p>
                                  <p className="text-xs mb-1 truncate">
                                    <span className="font-semibold text-gray-700">Equip.:</span> {tarefa.equipamento}
                                  </p>
                                  <p className="text-xs mb-1 truncate">
                                    <span className="font-semibold text-gray-700">Peso:</span> {tarefa.peso} kg
                                  </p>
                                  {tarefa.caminhao && (
                                    <p className="text-xs mb-2 truncate">
                                      <span className="font-semibold text-gray-700">Caminhão:</span> {tarefa.caminhao}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 px-4 pb-3 md:px-5 md:pb-4">
                                   <button
                                      onClick={() => handleConcluirTarefa(tarefa.id)}
                                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                                    >
                                      Concluir
                                    </button>
                                  {tarefa.status !== 'Cancelada' && tarefa.status !== 'Concluída' && (
                                    <button
                                      onClick={() => handleCancelarStatus(tarefa.id)}
                                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setTaskToRemove(tarefa)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                                  >
                                    <FaTrash /> Excluir
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {statusSelecionado !== 'Designada' && statusSelecionado !== 'Em Progresso' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 py-4">
                  {tarefasFiltradas.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className="relative bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200 rounded-xl overflow-hidden flex flex-col"
                    >
                      <div className={`h-2 rounded-t-xl ${tarefa.tipo === 'Entrega' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                      <div className="px-4 pt-3 pb-1 md:px-5 md:pt-4 md:pb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 font-semibold">{tarefa.codigo}</span>
                          <span className={`flex items-center gap-1 text-xs md:text-sm font-semibold ${tarefa.tipo === 'Entrega' ? 'text-blue-600' : 'text-yellow-600'}`}>
                            <FaTruckMoving className="inline-block" />
                            {tarefa.tipo}
                          </span>
                        </div>
                        <div className="flex justify-end">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                              statusList.find(s => s.chave === tarefa.status)?.cor || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tarefa.status}
                          </span>
                        </div>
                      </div>
                      <div className="px-4 pb-2 md:px-5 md:pb-3 flex-grow">
                        <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1 leading-tight truncate">{tarefa.cliente}</h3>
                        <p className="text-xs text-gray-500 mb-2 truncate" title={tarefa.endereco}>{tarefa.endereco}</p>
                        <p className="text-xs mb-1 truncate">
                          <span className="font-semibold text-gray-700">Equip.:</span> {tarefa.equipamento}
                        </p>
                        <p className="text-xs mb-1 truncate">
                          <span className="font-semibold text-gray-700">Peso:</span> {tarefa.peso} kg
                        </p>
                        {tarefa.caminhao && (
                          <p className="text-xs mb-2 truncate">
                            <span className="font-semibold text-gray-700">Caminhão:</span> {tarefa.caminhao}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 px-4 pb-3 md:px-5 md:pb-4 mt-auto">
                        {tarefa.status === 'Pendente' && (
                          <button
                            onClick={() => handleDesignar(tarefa)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <FaClipboardList /> Designar
                          </button>
                        )}
                         {tarefa.status === 'Em Progresso' && (
                             <button
                                onClick={() => handleConcluirTarefa(tarefa.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                            >
                                Concluir
                            </button>
                         )}
                        {tarefa.status !== 'Cancelada' && tarefa.status !== 'Concluída' && (
                          <button
                            onClick={() => handleCancelarStatus(tarefa.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => setTaskToRemove(tarefa)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <FaTrash /> Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tarefasFiltradas.length === 0 && statusSelecionado !== 'Todos' && (
                  <div className="text-center py-10 text-gray-500">
                    <FaClipboardList className="mx-auto text-4xl mb-2" />
                    Nenhuma tarefa encontrada para o status "{statusSelecionado}".
                  </div>
              )}
              {tarefas.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      <FaClipboardList className="mx-auto text-4xl mb-2" />
                      Nenhuma tarefa cadastrada ainda. Clique em "Nova Tarefa" para começar.
                    </div>
              )}
            </section>
          )}
          {abaSelecionada === 'Motoristas' && (
            <section>
              <Motoristas motoristas={motoristas} setMotoristas={setMotoristas} />
            </section>
          )}
          {abaSelecionada === 'Caminhoes' && (
            <section>
              <Caminhoes caminhoes={caminhoes} setCaminhoes={setCaminhoes} />
            </section>
          )}
          {abaSelecionada === 'Estatisticas' && (
            <section>
              <Estatisticas tarefas={tarefas} />
            </section>
          )}
        </main>

        {showNovaOperacaoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
            <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Criar Nova Tarefa</h3>
                <button onClick={() => setShowNovaOperacaoModal(false)} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const novaTarefa = {
                    codigo: e.target.codigo.value,
                    cliente: e.target.cliente.value,
                    endereco: e.target.endereco.value,
                    tipo: e.target.tipo.value,
                    equipamento: e.target.equipamento.value,
                    peso: e.target.peso.value,
                    data: e.target.data.value,
                    periodo: e.target.periodo.value,
                  };
                  handleSalvarNovaTarefa(novaTarefa);
                }}
              >
                <div className="space-y-4">
                  {/* Campo Tipo - existente */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
                    <select name="tipo" required className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm">
                      <option value="">Selecione o tipo</option>
                      <option value="Entrega">Entrega</option>
                      <option value="Retirada">Retirada</option>
                    </select>
                  </div>

                  {/* ✅ NOVO CAMPO DATA - Adicione este bloco */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Data da Operação</label>
                    <input 
                      name="data" 
                      type="date" 
                      required 
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                      min={new Date().toISOString().split('T')[0]} // ✅ Impede datas passadas
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Período de Entrega</label>
                    <select name="periodo" required className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm">
                      <option value="">Selecione o período</option>
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                    </select>
                  </div>
                  {/* Campos existentes - mantém como estão */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Código</label>
                    <input name="codigo" type="text" required className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" placeholder="Ex: T001"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
                    <input name="cliente" type="text" required className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" placeholder="Nome do cliente"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Endereço</label>
                    <textarea name="endereco" required className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" rows="2" placeholder="Endereço completo"></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Equipamento</label>
                      <select name="equipamento" required className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm">
                        <option value="">Selecione o equipamento</option>
                        <option value="TUBULAR">TUBULAR</option>
                        <option value="ESCORA">ESCORA</option>
                        <option value="MULTIDIRECIONAL">MULTIDIRECIONAL</option>
                        <option value="FACHADEIRO">FACHADEIRO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Peso (kg)</label>
                      <input name="peso" type="number" required defaultValue="0" className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" placeholder="Peso em kg" min="0"/>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowNovaOperacaoModal(false)} className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors">
                    Criar Tarefa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDesignarModal && tarefaParaDesignar && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
            <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-700">Designar Tarefa <span className="text-blue-600">#{tarefaParaDesignar.codigo}</span></h3>
                 <button onClick={() => setShowDesignarModal(false)} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDesignarTarefa();
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Motorista</label>
                    <select
                      value={motoristaDesignado}
                      onChange={(e) => setMotoristaDesignado(e.target.value)}
                      required
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white"
                    >
                      <option value="">Selecione um motorista</option>
                      {motoristas.filter(m => m.status === 'Disponível' || m.nome === tarefaParaDesignar.motorista).map((m) => (
                        <option key={m.id} value={m.nome}>
                          {m.nome} ({m.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Caminhão</label>
                    <select
                      value={caminhaoDesignado}
                      onChange={(e) => setCaminhaoDesignado(e.target.value)}
                      required
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white"
                    >
                      <option value="">Selecione um caminhão</option>
                      {caminhoes.filter(c => c.status === 'Disponível' || c.placa === tarefaParaDesignar.caminhao).map((c) => (
                        <option key={c.id} value={c.placa}>
                          {c.placa} - {c.modelo} ({c.status})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowDesignarModal(false)} className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors">
                    Designar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAvisoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-auto">
               <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-yellow-600">Atenção</h3>
                <button onClick={() => setShowAvisoModal(false)} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="mb-6 text-gray-700">Por favor, selecione um motorista e um caminhão para designar a tarefa.</p>
              <div className="flex justify-end">
                <button onClick={() => setShowAvisoModal(false)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-md transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {taskToRemove && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-red-600">Excluir Tarefa</h3>
                 <button onClick={() => setTaskToRemove(null)} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="mb-6 text-gray-700">Tem certeza que deseja excluir a tarefa <strong className="font-semibold">#{taskToRemove.codigo} - {taskToRemove.cliente}</strong>? Esta ação não pode ser desfeita.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setTaskToRemove(null)} className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    handleExcluir(taskToRemove); 
                    setTaskToRemove(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmarOperacaoModal && taskToConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-700">Confirmação de Operação</h3>
                <button onClick={handleCancelarConfirmacaoOperacao} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="mb-6 text-gray-700">
                Deseja confirmar a operação <strong className="font-semibold">#{taskToConfirm.codigo} - {taskToConfirm.cliente}</strong> e alterar o status para "Em Progresso"?
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={handleCancelarConfirmacaoOperacao} className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors">
                  Cancelar
                </button>
                <button onClick={executeConfirmarOperacao} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition-colors">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {showCancelarOperacaoModal && taskToCancel && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-red-600">Cancelamento de Operação</h3>
                <button onClick={handleFecharModalCancelamento} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="mb-6 text-gray-700">
                Deseja cancelar a operação <strong className="font-semibold">#{taskToCancel.codigo} - {taskToCancel.cliente}</strong>?
                A mesma será movida para o status 'Cancelada'.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={handleFecharModalCancelamento} className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors">
                  Não
                </button>
                <button onClick={executeCancelarOperacao} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition-colors">
                  Sim, Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
