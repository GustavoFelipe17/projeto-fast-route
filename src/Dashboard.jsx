import { useState, useEffect } from 'react';
import { tarefasAPI, motoristasAPI, caminhoesAPI } from './services/api';
import {
  FaClipboardList,
  FaUserFriends,
  FaTruckMoving,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaPlus,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';
import Motoristas from './Motoristas';
import Caminhoes from './Caminhoes';
import Estatisticas from './Estatisticas';
import { authenticatedAPI } from './services/auth';

function Dashboard({ user, onLogout }) {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  const [statusSelecionado, setStatusSelecionado] = useState('Em Progresso');
  
  // Estados iniciam VAZIOS - sem localStorage
  const [tarefas, setTarefas] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [caminhoes, setCaminhoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showNovaOperacaoModal, setShowNovaOperacaoModal] = useState(false);
  const [showDesignarModal, setShowDesignarModal] = useState(false);
  const [showAvisoModal, setShowAvisoModal] = useState(false);
  const [taskToRemove, setTaskToRemove] = useState(null);
  
  const [showEditarTarefaModal, setShowEditarTarefaModal] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  
  const [motoristaDesignado, setMotoristaDesignado] = useState('');
  const [caminhaoDesignado, setCaminhaoDesignado] = useState('');
  const [tarefaParaDesignar, setTarefaParaDesignar] = useState(null);
  
  const [showConfirmarOperacaoModal, setShowConfirmarOperacaoModal] = useState(false);
  const [taskToConfirm, setTaskToConfirm] = useState(null);
  
  const [showCancelarOperacaoModal, setShowCancelarOperacaoModal] = useState(false);
  const [taskToCancel, setTaskToCancel] = useState(null);
  const [observacaoCancelamento, setObservacaoCancelamento] = useState('');
  const [tarefaObservacaoExpandida, setTarefaObservacaoExpandida] = useState(null);
  
  const [abaSelecionada, setAbaSelecionada] = useState('Tarefas');

  const [showReagendarModal, setShowReagendarModal] = useState(false);
  const [tarefaParaReagendar, setTarefaParaReagendar] = useState(null);
  const [novaDataReagendamento, setNovaDataReagendamento] = useState('');
  const [novoPeriodoReagendamento, setNovoPeriodoReagendamento] = useState('');
  const [motoristaReagendamento, setMotoristaReagendamento] = useState('');
  const [caminhaoReagendamento, setCaminhaoReagendamento] = useState('');

  // Carregar dados da API quando o componente montar
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tarefasRes, motoristasRes, caminhoesRes] = await Promise.all([
        authenticatedAPI.tarefas.listar(),
        authenticatedAPI.motoristas.listar(),
        authenticatedAPI.caminhoes.listar()
      ]);
      
      setTarefas(tarefasRes.data);
      setMotoristas(motoristasRes.data);
      setCaminhoes(caminhoesRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleReagendar = (tarefa) => {
  setTarefaParaReagendar(tarefa);
  setNovaDataReagendamento('');
  setNovoPeriodoReagendamento('');
  setMotoristaReagendamento('');
  setCaminhaoReagendamento('');
  setShowReagendarModal(true);
};

// Fechar modal de reagendamento
const handleFecharModalReagendamento = () => {
  setShowReagendarModal(false);
  setTarefaParaReagendar(null);
  setNovaDataReagendamento('');
  setNovoPeriodoReagendamento('');
  setMotoristaReagendamento('');
  setCaminhaoReagendamento('');
};

  const handleConfirmarReagendamento = async () => {
    if (!novaDataReagendamento || !novoPeriodoReagendamento || !motoristaReagendamento || !caminhaoReagendamento) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      console.log('🔧 Reagendando tarefa:', {
        tarefaId: tarefaParaReagendar.id,
        status: 'Designada',
        motorista: motoristaReagendamento,
        caminhao: caminhaoReagendamento,
        data: novaDataReagendamento,
        periodo: novoPeriodoReagendamento
      });

      // Usar PATCH em vez de PUT para atualização parcial
      const response = await authenticatedAPI.tarefas.editar(tarefaParaReagendar.id, {
        status: 'Designada',
        motorista: motoristaReagendamento,
        caminhao: caminhaoReagendamento,
        data: novaDataReagendamento,
        periodo: novoPeriodoReagendamento
      });

      console.log('✅ Tarefa reagendada com sucesso:', response.data);

      // Atualizar o estado das tarefas
      setTarefas(tarefas.map(t => 
        t.id === tarefaParaReagendar.id ? response.data : t
      ));

      // Atualizar status do motorista e caminhão
      setMotoristas(motoristas.map(m => 
        m.nome === motoristaReagendamento ? {...m, status: 'Ocupado'} : m
      ));
      setCaminhoes(caminhoes.map(c => 
        c.placa === caminhaoReagendamento ? {...c, status: 'Ocupado'} : c
      ));

      handleFecharModalReagendamento();
      alert('✅ Tarefa reagendada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao reagendar tarefa:', error);
      console.error('❌ Detalhes do erro:', error.response?.data);
      alert('❌ Erro ao reagendar tarefa. Tente novamente.');
    }
  };


  const handleNovaOperacao = () => {
    setShowNovaOperacaoModal(true);
  };

  // Salvar nova tarefa com API
  const handleSalvarNovaTarefa = async (novaTarefa) => {
    try {
      console.log('📤 Dados enviados:', novaTarefa); // ← Debug
      const response = await authenticatedAPI.tarefas.criar(novaTarefa);
      console.log('📥 Resposta recebida:', response); // ← Debug
      
      setTarefas([response.data, ...tarefas]);
      setShowNovaOperacaoModal(false);
    } catch (error) {
      console.error('❌ Erro completo:', error.response?.data); // ← Ver erro específico
      console.error('❌ Status:', error.response?.status);
      alert('Erro ao criar tarefa. Verifique os dados.');
    }
  };

  const handleDesignar = (tarefa) => {
    setTarefaParaDesignar(tarefa);
    setMotoristaDesignado(tarefa.motorista || '');
    setCaminhaoDesignado(tarefa.caminhao || '');
    setShowDesignarModal(true);
  };

  // Designar tarefa com API
  const handleDesignarTarefa = async () => {
    if (!motoristaDesignado || !caminhaoDesignado) {
      setShowAvisoModal(true);
      return;
    }

    try {
      console.log('🔧 Designando tarefa:', {
        tarefaId: tarefaParaDesignar.id,
        status: 'Designada',
        motorista: motoristaDesignado,
        caminhao: caminhaoDesignado
      });

      // Usar PATCH em vez de PUT para atualização parcial
      const response = await authenticatedAPI.tarefas.editar(tarefaParaDesignar.id, {
        status: 'Designada',
        motorista: motoristaDesignado,
        caminhao: caminhaoDesignado
      });

      console.log('✅ Tarefa designada com sucesso:', response.data);

      setTarefas(tarefas.map(t => 
        t.id === tarefaParaDesignar.id ? response.data : t
      ));

      // Atualizar status do motorista e caminhão para "Ocupado"
      setMotoristas(motoristas.map(m => 
        m.nome === motoristaDesignado ? {...m, status: 'Ocupado'} : m
      ));
      setCaminhoes(caminhoes.map(c => 
        c.placa === caminhaoDesignado ? {...c, status: 'Ocupado'} : c
      ));

      setShowDesignarModal(false);
      setTarefaParaDesignar(null);
      setMotoristaDesignado('');
      setCaminhaoDesignado('');
      
      alert('✅ Tarefa designada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao designar tarefa:', error);
      console.error('❌ Detalhes do erro:', error.response?.data);
      alert('❌ Erro ao designar tarefa. Tente novamente.');
    }
  }

  // Excluir tarefa com API
  const handleExcluir = async (tarefaParaExcluir) => {
    try {
      await authenticatedAPI.tarefas.deletar(tarefaParaExcluir.id);
      
      // Liberar motorista e caminhão se estavam designados
      if (tarefaParaExcluir.motorista) {
        setMotoristas(motoristas.map(m => 
          m.nome === tarefaParaExcluir.motorista ? {...m, status: 'Disponível'} : m
        ));
      }
      if (tarefaParaExcluir.caminhao) {
        setCaminhoes(caminhoes.map(c => 
          c.placa === tarefaParaExcluir.caminhao ? {...c, status: 'Disponível'} : c
        ));
      }
      
      setTarefas(tarefas.filter(t => t.id !== tarefaParaExcluir.id));
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      alert('Erro ao excluir tarefa');
    }
  };

  const handleConfirmar = (tarefaId) => {
    const tarefa = tarefas.find(t => t.id === tarefaId);
    if (tarefa) {
      setTaskToConfirm(tarefa);
      setShowConfirmarOperacaoModal(true);
    }
  };

  // Confirmar operação com API
  const executeConfirmarOperacao = async () => {
    if (!taskToConfirm) return;
    
    try {
      // ✅ CORREÇÃO: Usar EDITAR (PATCH) em vez de ATUALIZAR (PUT)
      // para atualizar apenas campos específicos sem sobrescrever o 'codigo'
      const updateData = {
        status: 'Em Progresso'
      };

      // Adicionar motorista e caminhão apenas se existirem
      if (taskToConfirm.motorista) {
        updateData.motorista = taskToConfirm.motorista;
      }
      if (taskToConfirm.caminhao) {
        updateData.caminhao = taskToConfirm.caminhao;
      }

      console.log('🔧 Confirmando operação:', updateData);
      
      // ✅ MUDANÇA: Usar 'editar' (PATCH) em vez de 'atualizar' (PUT)
      const response = await authenticatedAPI.tarefas.editar(taskToConfirm.id, updateData);
      
      setTarefas(tarefas.map(t => 
        t.id === taskToConfirm.id ? response.data : t
      ));
      
      setShowConfirmarOperacaoModal(false);
      setTaskToConfirm(null);
      
      alert('✅ Operação confirmada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao confirmar operação:', error);
      console.error('❌ Detalhes do erro:', error.response?.data);
      alert('❌ Erro ao confirmar operação');
    }
  };
  
  // Concluir tarefa com API
  const handleConcluirTarefa = async (tarefaId) => {
    try {
      // ✅ CORREÇÃO: Usar PATCH em vez de PUT
      const response = await authenticatedAPI.tarefas.editar(tarefaId, {
        status: 'Concluída',
        dataFinalizacao: new Date().toISOString().split('T')[0]
      });
      
      setTarefas(tarefas.map(t => 
        t.id === tarefaId ? response.data : t
      ));
      
      // Liberar motorista e caminhão
      const tarefaConcluida = tarefas.find(t => t.id === tarefaId);
      if (tarefaConcluida) {
        if (tarefaConcluida.motorista) {
          setMotoristas(motoristas.map(m => 
            m.nome === tarefaConcluida.motorista ? {...m, status: 'Disponível'} : m
          ));
        }
        if (tarefaConcluida.caminhao) {
          setCaminhoes(caminhoes.map(c => 
            c.placa === tarefaConcluida.caminhao ? {...c, status: 'Disponível'} : c
          ));
        }
      }
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      alert('Erro ao concluir tarefa');
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
      setObservacaoCancelamento('');
      setShowCancelarOperacaoModal(true);
    }
  };

  const handleEditarTarefa = (tarefa) => {
    setTarefaParaEditar(tarefa);
    setShowEditarTarefaModal(true);
  };

  // Salvar edição com API
  const handleSalvarEdicaoTarefa = async (tarefaEditada) => {
    try {
      const response = await authenticatedAPI.tarefas.editar(tarefaParaEditar.id, {
        codigo: tarefaEditada.codigo,
        cliente: tarefaEditada.cliente,
        endereco: tarefaEditada.endereco,
        tipo: tarefaEditada.tipo,           // ← ADICIONAR ESTA LINHA
        equipamento: tarefaEditada.equipamento,
        peso: tarefaEditada.peso,
        data: tarefaEditada.data,           // ← ADICIONAR ESTA LINHA
        periodo: tarefaEditada.periodo      // ← ADICIONAR ESTA LINHA
      });
      
      setTarefas(tarefas.map(t => 
        t.id === tarefaParaEditar.id ? response.data : t
      ));
      
      setShowEditarTarefaModal(false);
      setTarefaParaEditar(null);
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      alert('Erro ao editar tarefa');
    }
  };

  const handleSalvarMotorista = async (novoMotorista) => {
    try {
      const response = await authenticatedAPI.motoristas.criar(novoMotorista);
      setMotoristas([...motoristas, response.data]);
      alert('✅ Motorista criado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao criar motorista:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error;
        if (errorMessage && errorMessage.includes('já cadastrado')) {
          alert('❌ Email ou CNH já cadastrado!');
        } else {
          alert('❌ Erro nos dados. Verifique os campos.');
        }
      } else {
        alert('❌ Erro ao criar motorista. Tente novamente.');
      }
    }
  };

  const handleEditarMotorista = async (id, dadosAtualizados) => {
    try {
      const response = await authenticatedAPI.motoristas.atualizar(id, dadosAtualizados);
      setMotoristas(motoristas.map(m => 
        m.id === id ? response.data : m
      ));
      alert('✅ Motorista atualizado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar motorista:', error);
      alert('❌ Erro ao atualizar motorista.');
    }
  };

  const handleExcluirMotorista = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este motorista?')) {
      try {
        await authenticatedAPI.motoristas.deletar(id);
        setMotoristas(motoristas.filter(m => m.id !== id));
        alert('✅ Motorista excluído com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao excluir motorista:', error);
        alert('❌ Erro ao excluir motorista.');
      }
    }
  };

  const handleSalvarCaminhao = async (novoCaminhao) => {
    try {
      const response = await authenticatedAPI.caminhoes.criar(novoCaminhao);
      setCaminhoes([...caminhoes, response.data]);
      alert('✅ Caminhão criado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao criar caminhão:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error;
        if (errorMessage && errorMessage.includes('já cadastrada')) {
          alert('❌ Placa já cadastrada!');
        } else {
          alert('❌ Erro nos dados. Verifique os campos.');
        }
      } else {
        alert('❌ Erro ao criar caminhão. Tente novamente.');
      }
    }
  };

  const handleEditarCaminhao = async (id, dadosAtualizados) => {
    try {
      const response = await authenticatedAPI.caminhoes.atualizar(id, dadosAtualizados);
      setCaminhoes(caminhoes.map(c => 
        c.id === id ? response.data : c
      ));
      alert('✅ Caminhão atualizado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar caminhão:', error);
      alert('❌ Erro ao atualizar caminhão.');
    }
  };

  const handleExcluirCaminhao = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este caminhão?')) {
      try {
        await authenticatedAPI.caminhoes.deletar(id);
        setCaminhoes(caminhoes.filter(c => c.id !== id));
        alert('✅ Caminhão excluído com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao excluir caminhão:', error);
        alert('❌ Erro ao excluir caminhão.');
      }
    }
  };

  const handleFecharModalEdicao = () => {
    setShowEditarTarefaModal(false);
    setTarefaParaEditar(null);
  };

  // Cancelar operação com API
  const executeCancelarOperacao = async () => {
    if (!taskToCancel) return;
    if (!observacaoCancelamento.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }
    
    try {
      // ✅ CORREÇÃO: Usar PATCH em vez de PUT
      const response = await authenticatedAPI.tarefas.editar(taskToCancel.id, {
        status: 'Cancelada',
        observacao: observacaoCancelamento.trim(),
        dataFinalizacao: new Date().toISOString().split('T')[0]
      });
      
      setTarefas(tarefas.map(t => 
        t.id === taskToCancel.id ? {
          ...response.data,
          observacaoCancelamento: observacaoCancelamento.trim()
        } : t
      ));
      
      // Liberar motorista e caminhão
      if (taskToCancel.motorista) {
        setMotoristas(motoristas.map(m => 
          m.nome === taskToCancel.motorista ? {...m, status: 'Disponível'} : m
        ));
      }
      if (taskToCancel.caminhao) {
        setCaminhoes(caminhoes.map(c => 
          c.placa === taskToCancel.caminhao ? {...c, status: 'Disponível'} : c
        ));
      }
      
      setShowCancelarOperacaoModal(false);
      setTaskToCancel(null);
      setObservacaoCancelamento('');
    } catch (error) {
      console.error('Erro ao cancelar operação:', error);
      alert('Erro ao cancelar operação');
    }
  };


  const handleFecharModalCancelamento = () => {
    setShowCancelarOperacaoModal(false);
    setTaskToCancel(null);
    setObservacaoCancelamento('');
  };

  const toggleObservacaoCancelamento = (tarefaId) => {
    if (tarefaObservacaoExpandida === tarefaId) { 
      setTarefaObservacaoExpandida(null);
    } else {
      setTarefaObservacaoExpandida(tarefaId);
    }
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

  // Indicador de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando dados...</p>
          <p className="text-sm text-gray-500 mt-2">Conectando ao servidor...</p>
        </div>
      </div>
    );
  }

  // Tratamento de erro
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro de Conexão</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <div className="text-sm text-gray-600 mb-4">
            <p>Verifique se:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>• O servidor backend está rodando na porta 5000</li>
              <li>• O PostgreSQL está ativo</li>
              <li>• As credenciais do banco estão corretas</li>
            </ul>
          </div>
          <button 
            onClick={carregarDados}
            className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center justify-between w-full">
                <span>Fast Route</span>
              </div>
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
            <div className="text-sm text-gray-700">
              <span>Admin User</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{user?.nome}</span>
              </div>
            </div>
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
                                {tarefa.status === 'Cancelada' && tarefa.observacaoCancelamento && (
                                  <div className="px-4 md:px-5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Tarefa cancelada</span>
                                      <button
                                        onClick={() => toggleObservacaoCancelamento(tarefa.id)}
                                        className="p-1 rounded-full hover:bg-red-100 transition-colors group"
                                        title={tarefaObservacaoExpandida === tarefa.id ? 'Ocultar motivo' : 'Ver motivo do cancelamento'}
                                      >
                                        <svg 
                                          xmlns="http://www.w3.org/2000/svg" 
                                          className="h-4 w-4 text-red-500 group-hover:text-red-700" 
                                          fill="none" 
                                          viewBox="0 0 24 24" 
                                          stroke="currentColor"
                                        >
                                          <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    
                                    {tarefaObservacaoExpandida === tarefa.id && (
                                      <div className="mt-2 p-3 bg-red-50 rounded-lg border-l-4 border-red-400 animate-fade-in-up">
                                        <div className="flex items-start gap-2">
                                          <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                          >
                                            <path 
                                              strokeLinecap="round" 
                                              strokeLinejoin="round" 
                                              strokeWidth="2" 
                                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                                            />
                                          </svg>
                                          <div className="flex-1">
                                            <p className="text-sm font-medium text-red-800 mb-1">
                                              Motivo do cancelamento:
                                            </p>
                                            <p className="text-sm text-red-700 leading-relaxed">
                                              {tarefa.observacaoCancelamento}
                                            </p>
                                            {tarefa.dataCancelamento && (
                                              <p className="text-xs text-red-600 mt-2 font-medium">
                                                Cancelada em: {new Date(tarefa.dataCancelamento).toLocaleDateString('pt-BR')}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2 px-4 pb-3 md:px-5 md:pb-4">
                                  {tarefa.status === 'Pendente' && (
                                    <>
                                      <button
                                        onClick={() => handleDesignar(tarefa)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                                      >
                                        <FaClipboardList /> Designar
                                      </button>
                                    </>
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
                                {tarefa.status === 'Cancelada' && tarefa.observacaoCancelamento && (
                                  <div className="px-4 md:px-5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Tarefa cancelada</span>
                                      <button
                                        onClick={() => toggleObservacaoCancelamento(tarefa.id)}
                                        className="p-1 rounded-full hover:bg-red-100 transition-colors group"
                                        title={tarefaObservacaoExpandida === tarefa.id ? 'Ocultar motivo' : 'Ver motivo do cancelamento'}
                                      >
                                        <svg 
                                          xmlns="http://www.w3.org/2000/svg" 
                                          className="h-4 w-4 text-red-500 group-hover:text-red-700" 
                                          fill="none" 
                                          viewBox="0 0 24 24" 
                                          stroke="currentColor"
                                        >
                                          <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    
                                    {tarefaObservacaoExpandida === tarefa.id && (
                                      <div className="mt-2 p-3 bg-red-50 rounded-lg border-l-4 border-red-400 animate-fade-in-up">
                                        <div className="flex items-start gap-2">
                                          <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                          >
                                            <path 
                                              strokeLinecap="round" 
                                              strokeLinejoin="round" 
                                              strokeWidth="2" 
                                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                                            />
                                          </svg>
                                          <div className="flex-1">
                                            <p className="text-sm font-medium text-red-800 mb-1">
                                              Motivo do cancelamento:
                                            </p>
                                            <p className="text-sm text-red-700 leading-relaxed">
                                              {tarefa.observacaoCancelamento}
                                            </p>
                                            {tarefa.dataCancelamento && (
                                              <p className="text-xs text-red-600 mt-2 font-medium">
                                                Cancelada em: {new Date(tarefa.dataCancelamento).toLocaleDateString('pt-BR')}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
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
                        {tarefa.status === 'Cancelada' && (
                        <div className="flex justify-end mt-1">
                          <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                            Tentativas: {tarefa.tentativas}
                          </span>
                        </div>
                      )}
                      </div>
                      <div className="px-4 pb-2 md:px-5 md:pb-3 flex-grow">
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
                      {tarefa.status === 'Cancelada' && tarefa.observacaoCancelamento && (
                        <div className="px-4 md:px-5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Tarefa cancelada</span>
                            <button
                              onClick={() => toggleObservacaoCancelamento(tarefa.id)}
                              className="p-1 rounded-full hover:bg-red-100 transition-colors group"
                              title={tarefaObservacaoExpandida === tarefa.id ? 'Ocultar motivo' : 'Ver motivo do cancelamento'}
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 text-red-500 group-hover:text-red-700" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth="2" 
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                              </svg>
                            </button>
                          </div>
                          
                          {tarefaObservacaoExpandida === tarefa.id && (
                            <div className="mt-2 p-3 bg-red-50 rounded-lg border-l-4 border-red-400 animate-fade-in-up">
                              <div className="flex items-start gap-2">
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                                  />
                                </svg>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-red-800 mb-1">
                                    Motivo do cancelamento:
                                  </p>
                                  <p className="text-sm text-red-700 leading-relaxed">
                                    {tarefa.observacaoCancelamento}
                                  </p>
                                  {tarefa.dataCancelamento && (
                                    <p className="text-xs text-red-600 mt-2 font-medium">
                                      Cancelada em: {new Date(tarefa.dataCancelamento).toLocaleDateString('pt-BR')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 px-4 pb-3 md:px-5 md:pb-4 mt-auto">
                        {tarefa.status === 'Pendente' && (
                          <>
                            <button
                              onClick={() => handleDesignar(tarefa)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <FaClipboardList /> Designar
                            </button>
                            <button
                              onClick={() => handleEditarTarefa(tarefa)}
                              className="text-blue-500 hover:text-blue-700 p-1.5 rounded-md border border-blue-300 hover:border-blue-500 transition-colors flex items-center gap-1"
                              title="Editar tarefa"
                            >
                              <FaEdit size={16} />
                            </button>
                          </>
                        )}
                         {tarefa.status === 'Em Progresso' && (
                             <button
                                onClick={() => handleConcluirTarefa(tarefa.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                            >
                                Concluir
                            </button>
                         )}
                        {tarefa.status === 'Cancelada' && (
                          <button
                            onClick={() => handleReagendar(tarefa)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 shadow-sm transition-colors"
                            title="Reagendar tarefa"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                            </svg>
                            Reagendar
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
            </section>
          )}
          {abaSelecionada === 'Motoristas' && (
            <section>
              <Motoristas 
                motoristas={motoristas}
                onSalvar={handleSalvarMotorista}        // ← Função para criar
                onEditar={handleEditarMotorista}        // ← Função para editar  
                onExcluir={handleExcluirMotorista}      // ← Função para excluir
              />
            </section>
          )}
          {abaSelecionada === 'Caminhoes' && (
            <section>
              <Caminhoes 
                caminhoes={caminhoes}
                onSalvar={handleSalvarCaminhao}         // ← Função para criar
                onEditar={handleEditarCaminhao}         // ← Função para editar
                onExcluir={handleExcluirCaminhao}       // ← Função para excluir
              />
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const novaTarefa = {
                    codigo: e.target.codigo.value,
                    cliente: e.target.cliente.value,
                    endereco: e.target.endereco.value, // ✅ CORRIGIDO
                    tipo: e.target.tipo.value,
                    equipamento: e.target.equipamento.value,
                    peso: e.target.peso.value,
                    data: e.target.data.value,
                    periodo: e.target.periodo.value,
                  };
                  handleSalvarNovaTarefa(novaTarefa);
                }}
                className="space-y-4"
              >
                {/* Campo Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
                  <select 
                    name="tipo" 
                    required 
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Entrega">Entrega</option>
                    <option value="Retirada">Retirada</option>
                  </select>
                </div>

                {/* Campo Data da Operação */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Data da Operação</label>
                  <input 
                    name="data" 
                    type="date" 
                    required 
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                    min={new Date().toISOString().split('T')[0]} // Impede datas passadas
                  />
                </div>

                {/* Campo Período */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Período de Entrega</label>
                  <select 
                    name="periodo" 
                    required 
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  >
                    <option value="">Selecione o período</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                  </select>
                </div>

                {/* Campo Código */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Código</label>
                  <input 
                    name="codigo" 
                    type="text" 
                    required 
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" 
                    placeholder="Ex: T001"
                  />
                </div>

                {/* Campo Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
                  <input 
                    name="cliente" 
                    type="text" 
                    required 
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" 
                    placeholder="Nome do cliente"
                  />
                </div>

                {/* Campo Endereço */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Endereço</label>
                  <textarea 
                    name="endereco" 
                    required 
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" 
                    rows="2" 
                    placeholder="Endereço completo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Campo Equipamento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Equipamento</label>
                    <select 
                      name="equipamento" 
                      required 
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                    >
                      <option value="">Selecione o equipamento</option>
                      <option value="TUBULAR">TUBULAR</option>
                      <option value="ESCORA">ESCORA</option>
                      <option value="MULTIDIRECIONAL">MULTIDIRECIONAL</option>
                      <option value="FACHADEIRO">FACHADEIRO</option>
                    </select>
                  </div>

                  {/* Campo Peso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Peso (kg)</label>
                    <input 
                      name="peso" 
                      type="number" 
                      required 
                      defaultValue="0"
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" 
                      placeholder="Peso em kg" 
                      min="0"
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowNovaOperacaoModal(false)} 
                    className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                  >
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="mb-4 text-gray-700">
                Deseja cancelar a operação <strong className="font-semibold">#{taskToCancel.codigo} - {taskToCancel.cliente}</strong>?
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo do cancelamento <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={observacaoCancelamento}
                  onChange={(e) => setObservacaoCancelamento(e.target.value)}
                  placeholder="Descreva o motivo do cancelamento da tarefa..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows="4"
                  maxLength="500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {observacaoCancelamento.length}/500 caracteres
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleFecharModalCancelamento} 
                  className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executeCancelarOperacao} 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                  disabled={observacaoCancelamento.trim() === ''}
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </div>
          </div>
        )}
        {showEditarTarefaModal && tarefaParaEditar && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Editar Tarefa</h3>
                <button onClick={handleFecharModalEdicao} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const tarefaEditada = {
                    codigo: e.target.codigo.value,
                    cliente: e.target.cliente.value,
                    endereco: e.target.endereco.value,
                    tipo: e.target.tipo.value,
                    equipamento: e.target.equipamento.value,
                    peso: e.target.peso.value,
                    data: e.target.data.value,
                    periodo: e.target.periodo.value,
                  };
                  handleSalvarEdicaoTarefa(tarefaEditada);
                }}
                className="space-y-4"
              >
                {/* Campo Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
                  <select 
                    name="tipo" 
                    required 
                    defaultValue={tarefaParaEditar.tipo}
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Entrega">Entrega</option>
                    <option value="Retirada">Retirada</option>
                  </select>
                </div>

                {/* Campo Data */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Data da Operação</label>
                  <input 
                    name="data" 
                    type="date" 
                    required 
                    defaultValue={tarefaParaEditar.data}
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Campo Período */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Período de Entrega</label>
                  <select 
                    name="periodo" 
                    required 
                    defaultValue={tarefaParaEditar.periodo}
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  >
                    <option value="">Selecione o período</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                  </select>
                </div>

                {/* Campo Código */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Código</label>
                  <input 
                    name="codigo" 
                    type="text" 
                    required 
                    defaultValue={tarefaParaEditar.codigo}
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" 
                    placeholder="Ex: T001"
                  />
                </div>

                {/* Campo Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
                  <input 
                    name="cliente" 
                    type="text" 
                    required 
                    defaultValue={tarefaParaEditar.cliente}
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" 
                    placeholder="Nome do cliente"
                  />
                </div>

                {/* Campo Endereço */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Endereço</label>
                  <textarea 
                    name="endereco" 
                    required 
                    defaultValue={tarefaParaEditar.endereco}
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" 
                    rows="2" 
                    placeholder="Endereço completo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Campo Equipamento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Equipamento</label>
                    <select 
                      name="equipamento" 
                      required 
                      defaultValue={tarefaParaEditar.equipamento}
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                    >
                      <option value="">Selecione o equipamento</option>
                      <option value="TUBULAR">TUBULAR</option>
                      <option value="ESCORA">ESCORA</option>
                      <option value="MULTIDIRECIONAL">MULTIDIRECIONAL</option>
                      <option value="FACHADEIRO">FACHADEIRO</option>
                    </select>
                  </div>

                  {/* Campo Peso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Peso (kg)</label>
                    <input 
                      name="peso" 
                      type="number" 
                      required 
                      defaultValue={tarefaParaEditar.peso}
                      className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm" 
                      placeholder="Peso em kg" 
                      min="0"
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleFecharModalEdicao}
                    className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showReagendarModal && tarefaParaReagendar && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-5 md:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                  Reagendar Tarefa #{tarefaParaReagendar.codigo}
                </h3>
                <button 
                  onClick={handleFecharModalReagendamento} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <h4 className="font-semibold text-blue-800 mb-1">Detalhes da Tarefa</h4>
                <p className="text-sm text-blue-700">
                  <strong>Cliente:</strong> {tarefaParaReagendar.cliente}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Equipamento:</strong> {tarefaParaReagendar.equipamento}
                </p>
              </div>

              <form className="space-y-4">
                {/* Nova Data */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Nova Data <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={novaDataReagendamento}
                    onChange={(e) => setNovaDataReagendamento(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required 
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  />
                </div>

                {/* Novo Período */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Período <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={novoPeriodoReagendamento}
                    onChange={(e) => setNovoPeriodoReagendamento(e.target.value)}
                    required 
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  >
                    <option value="">Selecione o período</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                  </select>
                </div>

                {/* Motorista */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Motorista <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={motoristaReagendamento}
                    onChange={(e) => setMotoristaReagendamento(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  >
                    <option value="">Selecione um motorista</option>
                    {motoristas
                      .filter(m => m.status === 'Disponível')
                      .map(motorista => (
                        <option key={motorista.id} value={motorista.nome}>
                          {motorista.nome}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Caminhão */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Caminhão <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={caminhaoReagendamento}
                    onChange={(e) => setCaminhaoReagendamento(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  >
                    <option value="">Selecione um caminhão</option>
                    {caminhoes
                      .filter(c => c.status === 'Disponível')
                      .map(caminhao => (
                        <option key={caminhao.id} value={caminhao.placa}>
                          {caminhao.placa} - {caminhao.modelo}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={handleFecharModalReagendamento} 
                    className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    onClick={handleConfirmarReagendamento}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition-colors"
                  >
                    Confirmar Reagendamento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
