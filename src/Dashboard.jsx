import { useState, useRef } from 'react';
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

function Dashboard({ onLogout }) {
  const cardsRef = useRef(null)
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const [statusSelecionado, setStatusSelecionado] = useState('Todos');
  const [tarefas, setTarefas] = useState([]);
  const [showNovaOperacaoModal, setShowNovaOperacaoModal] = useState(false);
  const [showDesignarModal, setShowDesignarModal] = useState(false);
  const [showAvisoModal, setShowAvisoModal] = useState(false);
  const [taskToRemove, setTaskToRemove] = useState(null);
  const [motorista, setMotorista] = useState('');
  const [caminhao, setCaminhao] = useState('');
  const [tarefaParaDesignar, setTarefaParaDesignar] = useState(null);

  const [showConfirmarOperacaoModal, setShowConfirmarOperacaoModal] = useState(false);
  const [taskToConfirm, setTaskToConfirm] = useState(null);

  // Novos estados para o modal de confirmação de cancelamento
  const [showCancelarOperacaoModal, setShowCancelarOperacaoModal] = useState(false);
  const [taskToCancel, setTaskToCancel] = useState(null);
  //ABA MOTORISTA
  const [abaSelecionada, setAbaSelecionada] = useState('Tarefas');
  const [motoristas, setMotoristas] = useState([]);
  const [showNovoMotoristaModal, setShowNovoMotoristaModal] = useState(false);

  const handleNovaOperacao = () => {
    setShowNovaOperacaoModal(true);
  };

  const handleSalvarNovaTarefa = (novaTarefa) => {
    setTarefas([...tarefas, novaTarefa]);
    setShowNovaOperacaoModal(false);
  };

  const handleDesignar = (tarefa) => {
    setTarefaParaDesignar(tarefa);
    setMotorista('');
    setCaminhao('');
    setShowDesignarModal(true);
  };

  const handleDesignarTarefa = () => {
    if (!motorista || !caminhao) {
      setShowAvisoModal(true);
    } else {
      const tarefasAtualizadas = tarefas.map(t =>
        t.id === tarefaParaDesignar.id
          ? { ...t, status: 'Designada', motorista: motorista, caminhao: caminhao }
          : t
      );
      setTarefas(tarefasAtualizadas);
      setShowDesignarModal(false);
      setTarefaParaDesignar(null);
    }
  };

  const handleExcluir = (tarefaParaExcluir) => {
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
        ? { ...tarefa, status: 'Em Progresso' } // Apenas altera o status
        : tarefa
    ));
    setShowConfirmarOperacaoModal(false);
    setTaskToConfirm(null);
  };

  const handleCancelarConfirmacaoOperacao = () => {
    setShowConfirmarOperacaoModal(false);
    setTaskToConfirm(null);
  };

  // Modificada para abrir o modal de confirmação de cancelamento
  const handleCancelarStatus = (tarefaId) => {
    const tarefa = tarefas.find(t => t.id === tarefaId);
    if (tarefa) {
      setTaskToCancel(tarefa);
      setShowCancelarOperacaoModal(true);
    }
  };

  // Nova função para executar o cancelamento da operação
  const executeCancelarOperacao = () => {
    if(!taskToCancel) return;
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === taskToCancel.id ? { ...tarefa, status: 'Cancelada' } : tarefa
    ));
    setShowCancelarOperacaoModal(false);
    setTaskToCancel(null);
  };

  // Nova função para fechar o modal de cancelamento (sem cancelar a tarefa)
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
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden overflow-y-hidden">
      {/* Sidebar */}
      <aside className={`fixed z-20 top-0 left-0 h-full w-56 bg-gradient-to-b from-[#1f1036] to-[#06334b] text-white flex flex-col justify-between transform transition-transform duration-300 ${sidebarAberta ? 'translate-x-0' : '-translate-x-full'}`}>
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
                    className={`flex items-center gap-3 text-white hover:bg-sky-800 px-3 py-2 rounded transition w-full ${abaSelecionada === 'Tarefas' ? 'bg-sky-900' : ''}`}
                  >
                    <FaClipboardList className="text-base" /> Tarefas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaSelecionada('Motoristas')}
                    className={`flex items-center gap-3 text-white hover:bg-sky-800 px-3 py-2 rounded transition w-full ${abaSelecionada === 'Motoristas' ? 'bg-sky-900' : ''}`}
                  >
                    <FaUserFriends className="text-base" /> Motoristas
                  </button>
                </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-white hover:bg-sky-800 px-3 py-2 rounded transition">
                  <FaTruckMoving className="text-base" /> Caminhões
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-white hover:bg-sky-800 px-3 py-2 rounded transition">
                  <FaChartBar className="text-base" /> Estatísticas
                </a>
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

      {/* Conteúdo principal */}
      <main className={`flex-1 p-6 transition-all duration-300 ${sidebarAberta ? 'ml-56' : 'ml-0'}`}>
        <header className="flex items-center justify-between pb-3 mb-6 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarAberta(!sidebarAberta)}
              className="text-sky-700 hover:text-sky-900 text-lg"
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-semibold text-sky-900">Painel de Logística</h1>
          </div>
          <span className="text-sm text-gray-700">Admin User</span>
        </header>
        {abaSelecionada === 'Tarefas' && (
  <section>
    <h2 className="text-lg font-bold mb-4">Gerenciamento de Tarefas</h2>
    {/* Filtros */}
    <div className="flex gap-2 flex-wrap mb-4">
      {statusList.map((status) => {
        const count = tarefas.filter(t => t.status === status.chave).length;
        const isActive = statusSelecionado === status.chave;
        return (
          <button
            key={status.nome}
            onClick={() => setStatusSelecionado(status.chave)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${status.cor} ${isActive ? 'ring-2 ring-offset-1 ring-sky-500' : ''}`}
          >
            {status.nome} <span className="font-bold">{count}</span>
          </button>
        );
      })}
    </div>
    {/* Botão Nova Operação */}
    <div className="mb-4">
      <button
        onClick={handleNovaOperacao}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md shadow-lg transition-all duration-300"
      >
        <FaPlus className="text-base" />
        Nova Operação
      </button>
    </div>
    {/* Cards de tarefas filtradas */}
    {statusSelecionado === 'Designada' ? (
      <div className="relative">
        {/* Botão para mover a barra para a esquerda */}
        <button
          onClick={() => {
            const container = document.getElementById('cards-container');
            container.scrollBy({ left: -300, behavior: 'smooth' });
          }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow-md z-10"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          &lt;
        </button>

        {/* Contêiner dos cards */}
        <div
          id="cards-container"
          className="flex w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
          style={{
            whiteSpace: 'nowrap', // Evita quebra de linha
          }}
        >
          {Array.from(
            new Set(
              tarefasFiltradas
                .filter(t => t.status === 'Designada')
                .map(t => t.motorista)
            )
          ).map((motoristaNome) => (
            <div
              key={motoristaNome}
              className="flex-shrink-0 min-w-[220px] max-w-[260px] mx-2" // Adiciona espaçamento horizontal entre os cards
              style={{
                display: 'inline-block', // Garante que os itens fiquem lado a lado
              }}
            >
              <h4 className="text-base font-bold mb-3 text-sky-800 border-b pb-1 truncate">
                {motoristaNome || 'Sem Motorista'}
              </h4>
              {tarefasFiltradas
                .filter(t => t.status === 'Designada' && t.motorista === motoristaNome)
                .map((tarefa) => (
                  <div
                    key={tarefa.id}
                    className="relative bg-white shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 mb-4 rounded-xl overflow-y-hidden"
                    style={{
                      minWidth: 280,
                      maxWidth: 300,
                      width: '100%',
                    }}
                  >
                    {/* Conteúdo do card */}
                    <div className={`h-2 rounded-t-xl ${tarefa.tipo === 'Entrega' ? 'bg-blue-400' : 'bg-yellow-400'}`} />
                    <div className="px-5 pt-4 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-semibold">{tarefa.codigo}</span>
                        <span className={`flex items-center gap-1 text-sm font-semibold ${tarefa.tipo === 'Entrega' ? 'text-blue-600' : 'text-yellow-600'}`}>
                          <FaTruckMoving className="inline-block" />
                          {tarefa.tipo}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1 ${
                            tarefa.status === 'Pendente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : tarefa.status === 'Designada'
                              ? 'bg-blue-100 text-blue-800'
                              : tarefa.status === 'Em Progresso'
                              ? 'bg-indigo-100 text-indigo-800'
                              : tarefa.status === 'Concluída'
                              ? 'bg-green-100 text-green-800'
                              : tarefa.status === 'Cancelada'
                              ? 'bg-red-100 text-red-800'
                              : ''
                          }`}
                        >
                          {tarefa.status}
                        </span>
                      </div>
                    </div>
                    <div className="px-5 pb-2">
                      <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{tarefa.cliente}</h3>
                      <p className="text-xs text-gray-500 mb-2 truncate">{tarefa.endereco}</p>
                      <p className="text-xs mb-1 truncate">
                        <span className="font-semibold text-gray-800">Equipamento:</span> {tarefa.equipamento}
                      </p>
                      <p className="text-xs mb-1 truncate">
                        <span className="font-semibold text-gray-800">Peso:</span> {tarefa.peso} kg
                      </p>
                      {tarefa.caminhao && (
                        <p className="text-xs mb-1 truncate">
                          <span className="font-semibold text-gray-800">Caminhão:</span> {tarefa.caminhao}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 px-5 pb-4">
                      {tarefa.status === 'Pendente' && (
                        <button
                          onClick={() => handleDesignar(tarefa)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                        >
                          <FaClipboardList /> Designar
                        </button>
                      )}
                      {tarefa.status === 'Designada' && (
                        <button
                          onClick={() => handleConfirmar(tarefa.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                        >
                          <FaClipboardList /> Confirmar
                        </button>
                      )}
                      {tarefa.status !== 'Cancelada' && (
                        <button
                          onClick={() => handleCancelarStatus(tarefa.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        onClick={() => setTaskToRemove(tarefa)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                      >
                        <FaTrash /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Botão para mover a barra para a direita */}
        <button
          onClick={() => {
            const container = document.getElementById('cards-container');
            container.scrollBy({ left: 300, behavior: 'smooth' });
          }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow-md z-10"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          &gt;
        </button>
      </div>
    ) : (
      <div className="flex flex-wrap gap-6">
        {tarefasFiltradas
          .filter(t => statusSelecionado !== 'Designada' && statusSelecionado !== 'Em Progresso')
          .map((tarefa) => (
            <div
              key={tarefa.id}
              className="relative bg-white shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 mb-4 rounded-xl overflow-y-hidden"
              style={{
                minWidth: 280,
                maxWidth: 300,
                width: "100%",
              }}
            >
              {/* Barra colorida no topo */}
              <div className={`h-2 rounded-t-xl ${tarefa.tipo === 'Entrega' ? 'bg-blue-400' : 'bg-yellow-400'}`} />
              {/* Topo do card */}
              <div className="px-5 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-semibold">{tarefa.codigo}</span>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${tarefa.tipo === 'Entrega' ? 'text-blue-600' : 'text-yellow-600'}`}>
                    <FaTruckMoving className="inline-block" />
                    {tarefa.tipo}
                  </span>
                </div>
                <div className="flex justify-end">
                  <span
                    className={`
                      inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1
                      ${
                        tarefa.status === 'Pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : tarefa.status === 'Designada'
                          ? 'bg-blue-100 text-blue-800'
                          : tarefa.status === 'Concluída'
                          ? 'bg-green-100 text-green-800'
                          : tarefa.status === 'Cancelada'
                          ? 'bg-red-100 text-red-800'
                          : ''
                      }
                    `}
                  >
                    {tarefa.status}
                  </span>
                </div>
              </div>
              {/* Conteúdo */}
              <div className="px-5 pb-2">
                <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{tarefa.cliente}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate">{tarefa.endereco}</p>
                <p className="text-xs mb-1 truncate">
                  <span className="font-semibold text-gray-800">Equipamento:</span> {tarefa.equipamento}
                </p>
                <p className="text-xs mb-1 truncate">
                  <span className="font-semibold text-gray-800">Peso:</span> {tarefa.peso} kg
                </p>
                {tarefa.caminhao && (
                  <p className="text-xs mb-1 truncate">
                    <span className="font-semibold text-gray-800">Caminhão:</span> {tarefa.caminhao}
                  </p>
                )}
              </div>
              {/* Botões */}
              <div className="flex gap-2 px-5 pb-4">
                {tarefa.status === 'Pendente' && (
                  <button
                    onClick={() => handleDesignar(tarefa)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                  >
                    <FaClipboardList /> Designar
                  </button>
                )}
                {tarefa.status === 'Designada' && (
                  <button
                    onClick={() => handleConfirmar(tarefa.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                  >
                    <FaClipboardList /> Confirmar
                  </button>
                )}
                {tarefa.status !== 'Cancelada' && (
                  <button
                    onClick={() => handleCancelarStatus(tarefa.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={() => setTaskToRemove(tarefa)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                >
                  <FaTrash /> Excluir
                </button>
              </div>
            </div>
          ))}
      </div>
    )}
      {statusSelecionado === 'Em Progresso' && (
        <div className="flex gap-6 w-full overflow-x-auto">
          {Array.from(
            new Set(
              tarefasFiltradas
                .filter(t => t.status === 'Em Progresso')
                .map(t => t.motorista)
            )
          ).map((motoristaNome) => (
            <div key={motoristaNome} className="flex-1 min-w-[220px] max-w-[260px]">
              <h4 className="text-base font-bold mb-3 text-sky-800 border-b pb-1 truncate">{motoristaNome || 'Sem Motorista'}</h4>
              {tarefasFiltradas
                .filter(t => t.status === 'Em Progresso' && t.motorista === motoristaNome)
                .map((tarefa) => (
                  <div
                    key={tarefa.id}
                    className="relative bg-white shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 mb-4 rounded-xl overflow-y-hidden"
                    style={{
                      minWidth: 280,
                      maxWidth: 300,
                      width: "100%",
                    }}
                  >
                    {/* Barra colorida no topo */}
                    <div className={`h-2 rounded-t-xl ${tarefa.tipo === 'Entrega' ? 'bg-blue-400' : 'bg-yellow-400'}`} />
                    {/* Detalhes do card */}
                    <div className="px-5 pt-4 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-semibold">{tarefa.codigo}</span>
                        <span className={`flex items-center gap-1 text-sm font-semibold ${tarefa.tipo === 'Entrega' ? 'text-blue-600' : 'text-yellow-600'}`}>
                          <FaTruckMoving className="inline-block" />
                          {tarefa.tipo}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1 ${
                            tarefa.status === 'Em Progresso'
                              ? 'bg-indigo-100 text-indigo-800'
                              : ''
                          }`}
                        >
                          {tarefa.status}
                        </span>
                      </div>
                    </div>
                    {/* Conteúdo */}
                    <div className="px-5 pb-2">
                      <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{tarefa.cliente}</h3>
                      <p className="text-xs text-gray-500 mb-2 truncate">{tarefa.endereco}</p>
                      <p className="text-xs mb-1 truncate">
                        <span className="font-semibold text-gray-800">Equipamento:</span> {tarefa.equipamento}
                      </p>
                      <p className="text-xs mb-1 truncate">
                        <span className="font-semibold text-gray-800">Peso:</span> {tarefa.peso} kg
                      </p>
                      {tarefa.caminhao && (
                        <p className="text-xs mb-1 truncate">
                          <span className="font-semibold text-gray-800">Caminhão:</span> {tarefa.caminhao}
                        </p>
                      )}
                    </div>
                    {/* Botões */}
                    <div className="flex gap-2 px-5 pb-4">
                      <button
                        onClick={() => setTaskToRemove(tarefa)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"
                      >
                        <FaTrash /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
      </section>
    )}
    {abaSelecionada === 'Motoristas' && (
      <section>
        <Motoristas motoristas={motoristas} setMotoristas={setMotoristas} />
      </section>
    )}
  </main>

      {/* Modal Nova Operação */}
      {showNovaOperacaoModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4">Criar Nova Tarefa</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const novaTarefa = {
                  id: Date.now(),
                  codigo: e.target.codigo.value,
                  cliente: e.target.cliente.value,
                  endereco: e.target.endereco.value,
                  tipo: e.target.tipo.value,
                  equipamento: e.target.equipamento.value,
                  peso: e.target.peso.value,
                  status: 'Pendente',
                  motorista: '',
                  caminhao: '',
                };
                handleSalvarNovaTarefa(novaTarefa);
              }}
            >
              {/* Campos do formulário ... */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Tipo</label>
                <select
                  name="tipo"
                  required
                  className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="Entrega">Entrega</option>
                  <option value="Retirada">Retirada</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Contrato</label>
                <input
                  name="codigo"
                  type="text"
                  required
                  className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Número do contrato"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Cliente</label>
                <input
                  name="cliente"
                  type="text"
                  required
                  className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Endereço</label>
                <input
                  name="endereco"
                  type="text"
                  required
                  className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Endereço"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Equipamento</label>
                <select
                  name="equipamento"
                  required
                  className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-sky-500 focus:border-sky-500"
                  defaultValue=""
                >
                  <option value="" disabled>Selecione o equipamento</option>
                  <option value="TUBULAR">TUBULAR</option>
                  <option value="ESCORA">ESCORA</option>
                  <option value="MULTIDIRECIONAL">MULTIDIRECIONAL</option>
                  <option value="TUBO EQUIPADO">TUBO EQUIPADO</option>
                  <option value="FACHADEIRO">FACHADEIRO</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Peso (kg)</label>
                <input
                  name="peso"
                  type="number"
                  required
                  defaultValue="0"
                  className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Peso em kg"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNovaOperacaoModal(false)}
                  className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Designar Tarefa */}
      {showDesignarModal && tarefaParaDesignar && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4">Designar Tarefa #{tarefaParaDesignar.codigo}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDesignarTarefa();
              }}
            >
              {/* Campos do formulário ... */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Motorista</label>
                <select
                  value={motorista}
                  onChange={(e) => setMotorista(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="">Selecione um motorista</option>
                  {motoristas.map((motorista) => (
                    <option key={motorista.id} value={motorista.nome}>
                      {motorista.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Caminhão</label>
                <select
                  value={caminhao}
                  onChange={(e) => setCaminhao(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 rounded-lg border focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="">Selecione um caminhão</option>
                  <option value="Caminhão Volvo FH">Caminhão Volvo FH</option>
                  <option value="Caminhão Scania R450">Caminhão Scania R450</option>
                  <option value="Caminhão Mercedes Actros">Caminhão Mercedes Actros</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDesignarModal(false)}
                  className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
                >
                  Designar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Aviso para Designação */}
      {showAvisoModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <h3 className="text-xl font-bold mb-4 text-yellow-600">Atenção</h3>
            <p className="mb-6">Por favor, selecione um motorista e um caminhão para designar a tarefa.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAvisoModal(false)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir Tarefa */}
      {taskToRemove && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <h3 className="text-xl font-bold mb-4 text-red-600">Excluir Tarefa</h3>
            <p className="mb-6">Tem certeza que deseja excluir a tarefa <strong className="font-semibold">#{taskToRemove.codigo} - {taskToRemove.cliente}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTaskToRemove(null)}
                className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md border"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleExcluir(taskToRemove);
                  setTaskToRemove(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Operação (para status Em Progresso) */}
      {showConfirmarOperacaoModal && taskToConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4">Confirmação de Operação</h3>
            <p className="mb-6">
              Deseja confirmar a operação <strong className="font-semibold">#{taskToConfirm.codigo} - {taskToConfirm.cliente}</strong> e enviá-la para o motorista responsável?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelarConfirmacaoOperacao}
                className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md border"
              >
                Cancelar
              </button>
              <button
                onClick={executeConfirmarOperacao}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOVO Modal de Cancelamento de Operação */}
      {showCancelarOperacaoModal && taskToCancel && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4 text-red-600">Cancelamento de Operação</h3>
            <p className="mb-6">
              Deseja cancelar a operação <strong className="font-semibold">#{taskToCancel.codigo} - {taskToCancel.cliente}</strong>?
              A mesma será movida para o status 'Cancelada' e não será enviada ao motorista.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleFecharModalCancelamento} // Fecha o modal sem cancelar a tarefa
                className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md border"
              >
                Não
              </button>
              <button
                onClick={executeCancelarOperacao} // Executa o cancelamento
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
              >
                Sim, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;